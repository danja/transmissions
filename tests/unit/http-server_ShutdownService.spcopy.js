import { expect } from 'chai';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import ShutdownService from '../../src/processors/http/services/ShutdownService.js';

describe('ShutdownService', () => {
    let app;
    let shutdownService;
    let shutdownCalled = false;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        shutdownService = new ShutdownService();
        shutdownService.setupMiddleware(app);
        shutdownService.setupEndpoints(app, () => { shutdownCalled = true; });
    });

    it('should generate valid JWT tokens', async () => {
        const response = await request(app).get('/admin/token');
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');

        const decoded = jwt.verify(response.body.token, shutdownService.secret);
        expect(decoded).to.have.property('action', 'shutdown');
    });

    it('should require valid token for shutdown', async () => {
        const invalidResponse = await request(app)
            .post('/admin/shutdown')
            .set('Authorization', 'Bearer invalid');
        expect(invalidResponse.status).to.equal(403);

        const tokenResponse = await request(app).get('/admin/token');
        const validResponse = await request(app)
            .post('/admin/shutdown')
            .set('Authorization', `Bearer ${tokenResponse.body.token}`);
        expect(validResponse.status).to.equal(200);
        expect(shutdownCalled).to.be.true;
    });

    it('should reject expired tokens', async () => {
        const expiredToken = jwt.sign(
            { action: 'shutdown' },
            shutdownService.secret,
            { expiresIn: '0s' }
        );

        await new Promise(resolve => setTimeout(resolve, 1));

        const response = await request(app)
            .post('/admin/shutdown')
            .set('Authorization', `Bearer ${expiredToken}`);
        expect(response.status).to.equal(403);
    });
});