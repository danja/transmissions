import { expect } from 'chai';
import WebSocket from 'ws';
import MetricsService from '../../src/processors/http/services/MetricsService.js';
import http from 'http';

describe('MetricsService', () => {
    let metricsService;
    let server;
    let wsClient;

    beforeEach((done) => {
        server = http.createServer();
        server.listen(0, () => {
            metricsService = new MetricsService(server);
            const port = server.address().port;
            wsClient = new WebSocket(`ws://localhost:${port}`);
            wsClient.on('open', done);
        });
    });

    afterEach((done) => {
        wsClient.close();
        server.close(done);
    });

    it('should send metrics updates', (done) => {
        wsClient.on('message', (data) => {
            const metrics = JSON.parse(data.toString());
            expect(metrics).to.have.property('uptime');
            expect(metrics).to.have.property('requests');
            expect(metrics).to.have.property('connections');
            expect(metrics).to.have.property('memory');
            expect(metrics).to.have.property('cpu');
            done();
        });
    });

    it('should increment requests counter', () => {
        const initialRequests = metricsService.metrics.requests;
        metricsService.incrementRequests();
        expect(metricsService.metrics.requests).to.equal(initialRequests + 1);
    });

    it('should track connections', (done) => {
        const newClient = new WebSocket(`ws://localhost:${server.address().port}`);
        newClient.on('open', () => {
            expect(metricsService.metrics.connections).to.equal(2);
            newClient.close();
            setTimeout(() => {
                expect(metricsService.metrics.connections).to.equal(1);
                done();
            }, 100);
        });
    });
});