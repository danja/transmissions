import { expect } from 'chai';
import express from 'express';
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

    it('should generate valid JWT tokens', (done) => {
        const token = shutdownService.generateToken();
        const decoded = jwt.verify(token, shutdownService.secret);
        expect(decoded).to.have.property('action', 'shutdown');
        done();
    });

    it('should require valid token for shutdown', (done) => {
        const validToken = shutdownService.generateToken();
        
        // Mock request/response objects
        const mockReq = {
            headers: { authorization: `Bearer ${validToken}` }
        };
        const mockRes = {
            status: function(code) {
                return { send: function(msg) {} };
            }
        };
        const nextSpy = jasmine.createSpy('next');

        app._router.handle(mockReq, mockRes, nextSpy);
        expect(nextSpy).toHaveBeenCalled();
        done();
    });

    it('should reject expired tokens', (done) => {
        const expiredToken = jwt.sign(
            { action: 'shutdown' },
            shutdownService.secret,
            { expiresIn: '0s' }
        );

        setTimeout(() => {
            const mockReq = {
                headers: { authorization: `Bearer ${expiredToken}` }
            };
            const mockRes = {
                status: function(code) {
                    expect(code).toBe(403);
                    return { 
                        send: function(msg) {
                            expect(msg).toBe('Invalid token');
                        }
                    };
                }
            };

            app._router.handle(mockReq, mockRes, () => {});
            done();
        }, 100);
    });
});
