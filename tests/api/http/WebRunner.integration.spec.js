// tests/api/http/WebRunner.integration.spec.js

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import WebRunner from '../../../src/api/http/server/WebRunner.js'

describe('WebRunner Integration Tests', () => {
    let webRunner
    let mockAppManager
    let baseUrl

    beforeAll(async () => {
        mockAppManager = {
            start: async (message) => {
                // When message is empty {}, message || fallback won't work as expected
                const hasContent = message && Object.keys(message).filter(k => k !== 'requestId' && k !== 'application').length > 0
                const result = hasContent ? message : { echo: 'default response' }
                // Add metadata like the real AppManager does
                result.requestId = message?.requestId
                result.application = message?.application  
                result.appPath = '/test/path'
                result.subtask = false
                result.appRunStart = new Date().toISOString()
                result.success = true
                return result
            }
        }
        
        webRunner = new WebRunner(mockAppManager, { port: 0 })
        await webRunner.start()
        
        const address = webRunner.server.address()
        baseUrl = `http://localhost:${address.port}/api`
    })

    afterAll(async () => {
        if (webRunner?.server) {
            await webRunner.stop()
        }
    })

    beforeEach(() => {
        // Reset for each test
    })

    describe('POST /api/echo', () => {
        it('should echo simple message', async () => {
            const testMessage = { text: 'Hello integration test!' }
            
            const response = await fetch(`${baseUrl}/echo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testMessage)
            })

            expect(response.status).toBe(200)
            
            const data = await response.json()
            expect(data).toHaveProperty('success', true)
            expect(data).toHaveProperty('requestId')
            expect(data).toHaveProperty('data')
            expect(data.data.text).toEqual(testMessage.text)
            expect(data.data).toHaveProperty('requestId')
        })

        it('should handle empty message', async () => {
            const response = await fetch(`${baseUrl}/echo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            })

            expect(response.status).toBe(200)
            
            const data = await response.json()
            expect(data).toHaveProperty('success', true)
            expect(data).toHaveProperty('data')
            expect(data.data).toHaveProperty('requestId')
            expect(data.data.echo).toEqual('default response')
        })

        it('should handle complex nested message', async () => {
            const complexMessage = {
                data: {
                    numbers: [1, 2, 3],
                    nested: { key: 'value' }
                },
                metadata: {
                    test: 'integration',
                    timestamp: new Date().toISOString()
                }
            }
            
            const response = await fetch(`${baseUrl}/echo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(complexMessage)
            })

            expect(response.status).toBe(200)
            
            const data = await response.json()
            expect(data).toHaveProperty('success', true)
            expect(data.data.data).toEqual(complexMessage.data)
            expect(data.data.metadata.test).toEqual(complexMessage.metadata.test)
            expect(data.data).toHaveProperty('requestId')
        })

        it('should handle malformed JSON gracefully', async () => {
            const response = await fetch(`${baseUrl}/echo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: '{ invalid json'
            })

            expect(response.status).toBe(400)
        })

        it('should handle GET request with 404 Not Found', async () => {
            const response = await fetch(`${baseUrl}/echo`, {
                method: 'GET'
            })

            expect(response.status).toBe(404)
        })
    })

    describe('POST /api/stop', () => {
        it('should handle stop command via echo endpoint', async () => {
            const stopMessage = { system: 'stop' }
            
            const response = await fetch(`${baseUrl}/echo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stopMessage)
            })

            expect(response.status).toBe(200)
            
            const data = await response.json()
            expect(data).toHaveProperty('success', true)
            expect(data.message).toEqual('Shutdown initiated')
        })

        it('should handle direct stop endpoint', async () => {
            const response = await fetch(`${baseUrl}/stop`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            })

            expect(response.status).toBe(200)
            
            const data = await response.json()
            expect(data).toHaveProperty('success', true)
            expect(data.data).toHaveProperty('requestId')
            expect(data.data.echo).toEqual('default response')
        })
    })

    describe('Error handling', () => {
        it('should handle unknown endpoints gracefully', async () => {
            const response = await fetch(`${baseUrl}/unknown`, {
                method: 'POST'
            })

            expect(response.status).toBe(200)
        })

        it('should handle missing Content-Type header', async () => {
            const response = await fetch(`${baseUrl}/echo`, {
                method: 'POST',
                body: 'plain text'
            })

            expect(response.status).toBe(200)
        })
    })

    describe('Concurrent requests', () => {
        it('should handle concurrent requests', async () => {
            const requests = Array.from({ length: 5 }, (_, i) => 
                fetch(`${baseUrl}/echo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ request: i })
                })
            )

            const responses = await Promise.all(requests)
            
            responses.forEach((response, i) => {
                expect(response.status).toBe(200)
            })
        })
    })
})