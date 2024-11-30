import { expect } from 'chai';
import express from 'express';
import ShutdownService from '../../src/processors/http/services/ShutdownService.js';

describe('ShutdownService', () => {
    let app;
    let shutdownService;
    let shutdownCalled = false;

    beforeEach(() => {
        app = express();
        shutdownService = new ShutdownService();
        shutdownService.setupMiddleware(app);
        shutdownService.setupEndpoints(app, () => { shutdownCalled = true; });
    });

    it('should reject requests without auth', (done) => {
        const mockReq = { headers: {} };
        const mockRes = {
            setHeader: jasmine.createSpy('setHeader'),
            status: function (code) {
                expect(code).toBe(401);
                return { send: function () { } };
            }
        };

        app._router.handle(mockReq, mockRes, () => { });
        expect(mockRes.setHeader).toHaveBeenCalledWith('WWW-Authenticate', 'Basic');
        done();
    });

    it('should accept valid credentials', (done) => {
        const credentials = Buffer.from(`${shutdownService.username}:${shutdownService.password}`).toString('base64');
        const mockReq = {
            headers: {
                authorization: `Basic ${credentials}`
            }
        };
        const mockRes = {
            status: jasmine.createSpy('status'),
            send: jasmine.createSpy('send')
        };
        const nextSpy = jasmine.createSpy('next');

        app._router.handle(mockReq, mockRes, nextSpy);
        expect(nextSpy).toHaveBeenCalled();
        done();
    });
});