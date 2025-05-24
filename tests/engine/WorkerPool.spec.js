// tests/engine/WorkerPool.spec.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { EventEmitter } from 'events'

// Mock Worker implementation for testing
class MockWorker extends EventEmitter {
    constructor(modulePath) {
        super()
        this.modulePath = modulePath
        this.terminated = false
    }

    postMessage(data) {
        if (this.terminated) {
            throw new Error('Worker has been terminated')
        }

        // Simulate async worker processing
        setTimeout(() => {
            if (!this.terminated) {
                this.emit('message', { success: true, processedData: data })
            }
        }, 10)
    }

    terminate() {
        this.terminated = true
        return Promise.resolve()
    }
}

// Mock the worker_threads module
vi.mock('worker_threads', () => ({
    Worker: MockWorker
}))

// Mock logger
vi.mock('../../src/utils/Logger.js', () => ({
    default: {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        trace: vi.fn()
    }
}))

const { default: WorkerPool } = await import('../../src/engine/WorkerPool.js')

describe('WorkerPool', () => {
    let workerPool
    const mockModulePath = './example-worker.js'

    beforeEach(() => {
        workerPool = new WorkerPool(mockModulePath, 2)
    })

    afterEach(async () => {
        // Clean up workers after each test
        if (workerPool && workerPool.workers) {
            await Promise.all(workerPool.workers.map(w => w.worker.terminate()))
        }
    })

    describe('initialization', () => {
        it('should create the specified number of workers', () => {
            expect(workerPool.workers).toHaveLength(2)
            expect(workerPool.workers[0]).toHaveProperty('worker')
            expect(workerPool.workers[0]).toHaveProperty('busy', false)
        })

        it('should initialize with empty queue', () => {
            expect(workerPool.queue).toHaveLength(0)
        })
    })

    describe('message dispatch', () => {
        it('should dispatch message to idle worker', () => {
            const testMessage = { type: 'test', data: 'hello' }
            
            workerPool.enqueueMessage(testMessage)
            
            // Should dispatch immediately since workers are idle
            expect(workerPool.queue).toHaveLength(0)
            expect(workerPool.workers[0].busy).toBe(true)
        })

        it('should queue message when all workers are busy', () => {
            const message1 = { type: 'test', data: 'first' }
            const message2 = { type: 'test', data: 'second' }
            const message3 = { type: 'test', data: 'third' }

            // Dispatch first two messages to occupy both workers
            workerPool.enqueueMessage(message1)
            workerPool.enqueueMessage(message2)
            
            // Third message should be queued
            workerPool.enqueueMessage(message3)

            expect(workerPool.queue).toHaveLength(1)
            expect(workerPool.workers[0].busy).toBe(true)
            expect(workerPool.workers[1].busy).toBe(true)
        })

        it('should dispatch queued message when worker becomes idle', (done) => {
            const message1 = { type: 'test', data: 'first' }
            const message2 = { type: 'test', data: 'second' }
            const message3 = { type: 'test', data: 'third' }

            // Fill both workers
            workerPool.enqueueMessage(message1)
            workerPool.enqueueMessage(message2)
            
            // Queue third message
            workerPool.enqueueMessage(message3)
            expect(workerPool.queue).toHaveLength(1)

            // Simulate first worker completing
            setTimeout(() => {
                const firstWorker = workerPool.workers[0]
                firstWorker.worker.emit('message', { success: true })
                
                // Queue should be processed
                setTimeout(() => {
                    expect(workerPool.queue).toHaveLength(0)
                    done()
                }, 20)
            }, 50)
        })
    })

    describe('worker idle handling', () => {
        it('should mark worker as idle and dispatch next message', () => {
            const message1 = { type: 'test', data: 'first' }
            const message2 = { type: 'test', data: 'second' }
            const message3 = { type: 'test', data: 'third' }

            // Send first two messages to occupy both workers
            workerPool.enqueueMessage(message1)
            workerPool.enqueueMessage(message2)
            expect(workerPool.workers[0].busy).toBe(true)
            expect(workerPool.workers[1].busy).toBe(true)

            // Queue third message
            workerPool.enqueueMessage(message3)
            expect(workerPool.queue).toHaveLength(1)

            // Simulate worker completion
            const workerWrapper = workerPool.workers[0]
            workerPool.markWorkerIdle(workerWrapper)

            expect(workerWrapper.busy).toBe(true) // Should be busy again with queued message
            // Should dispatch queued message
            expect(workerPool.queue).toHaveLength(0)
        })
    })

    describe('environment integration', () => {
        it('should work with environment variables set', () => {
            // Simulate environment variables being set
            process.env.TRANSMISSIONS_USE_WORKERS = 'true'
            process.env.TRANSMISSIONS_WORKER_MODULE = './test-worker.js'
            process.env.TRANSMISSIONS_WORKER_POOL_SIZE = '3'

            // Verify the WorkerPool can be created with environment settings
            const envWorkerPool = new WorkerPool(process.env.TRANSMISSIONS_WORKER_MODULE, 
                parseInt(process.env.TRANSMISSIONS_WORKER_POOL_SIZE))
            
            expect(envWorkerPool.workers).toHaveLength(3)

            // Clean up
            delete process.env.TRANSMISSIONS_USE_WORKERS
            delete process.env.TRANSMISSIONS_WORKER_MODULE
            delete process.env.TRANSMISSIONS_WORKER_POOL_SIZE
        })
    })
})