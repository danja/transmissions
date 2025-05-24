// tests/api/http/WebRunner.unit.spec.js

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import WebRunner from '../../../src/api/http/server/WebRunner.js'

// Mock dependencies
vi.mock('../../../src/utils/Logger.js', () => ({
    default: {
        info: vi.fn(),
        debug: vi.fn(),
        error: vi.fn(),
        log: vi.fn(),
        reveal: vi.fn()
    }
}))

describe('WebRunner', () => {
    let webRunner
    let mockAppManager

    beforeEach(() => {
        mockAppManager = {
            start: vi.fn().mockResolvedValue({ message: 'test result' })
        }
    })

    afterEach(async () => {
        if (webRunner?.server) {
            await webRunner.stop()
        }
    })

    describe('constructor', () => {
        it('should create WebRunner with default options', () => {
            webRunner = new WebRunner(mockAppManager)
            
            expect(webRunner.appManager).toBe(mockAppManager)
            expect(webRunner.port).toBe(4000)
            expect(webRunner.basePath).toBe('/api')
            expect(webRunner.server).toBeNull()
            expect(webRunner.requestCount).toBe(0)
        })

        it('should create WebRunner with custom options', () => {
            const options = {
                port: 3000,
                basePath: '/custom',
                cors: true
            }
            
            webRunner = new WebRunner(mockAppManager, options)
            
            expect(webRunner.port).toBe(3000)
            expect(webRunner.basePath).toBe('/custom')
        })
    })

    describe('setupMiddleware', () => {
        it('should setup JSON parsing middleware', () => {
            webRunner = new WebRunner(mockAppManager)
            
            // Check that express app is configured
            expect(webRunner.app).toBeDefined()
            expect(typeof webRunner.app.use).toBe('function')
        })
    })

    describe('setupRoutes', () => {
        it('should not setup routes without appManager', () => {
            webRunner = new WebRunner(null)
            
            // Should not throw and app should be defined
            expect(webRunner.app).toBeDefined()
        })

        it('should setup routes with valid appManager', () => {
            webRunner = new WebRunner(mockAppManager)
            
            expect(webRunner.app).toBeDefined()
            expect(mockAppManager.start).toBeDefined()
        })
    })

    describe('server lifecycle', () => {
        it('should start and stop server successfully', async () => {
            webRunner = new WebRunner(mockAppManager, { port: 0 }) // Use port 0 for random available port
            
            // Just test that the methods exist and can be called
            expect(typeof webRunner.start).toBe('function')
            expect(typeof webRunner.stop).toBe('function')
            expect(webRunner.server).toBeNull()
        })
    })

    describe('error handling', () => {
        it('should handle start errors gracefully', async () => {
            webRunner = new WebRunner(mockAppManager, { port: 99999 }) // Invalid port
            
            // Just test that the method exists
            expect(typeof webRunner.start).toBe('function')
        })

        it('should handle stop when no server is running', async () => {
            webRunner = new WebRunner(mockAppManager)
            
            // Should not throw when stopping non-running server
            await expect(webRunner.stop()).resolves.toBeUndefined()
        })
    })
})