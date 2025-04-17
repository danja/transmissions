import { EventEmitter } from 'events'
import path from 'path'
import { fileURLToPath } from 'url'
import WorkerPool from '../../src/engine/WorkerPool.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Mock Worker implementation
class MockWorker extends EventEmitter {
    constructor(modulePath, options) {
        super()
        this.modulePath = modulePath
        this.options = options
        this.terminated = false
    }

    postMessage(data) {
        if (this.terminated) {
            throw new Error('Worker has been terminated')
        }

        // Simulate worker processing
        setTimeout(() => {
            if (!this.terminated && !this.errorOnNextMessage) {
                this.emit('message', { success: true, input: data })
            } else if (this.errorOnNextMessage) {
                this.emit('error', new Error('Mock worker error'))
            }
        }, 10)
    }

    terminate() {
        this.terminated = true
        return Promise.resolve()
    }

    triggerError() {
        this.errorOnNextMessage = true
    }

    triggerExit(code = 0) {
        this.emit('exit', code)
    }
}

// Mock logger
const mockLogger = {
    debug: jasmine.createSpy('debug'),
    info: jasmine.createSpy('info'),
    warn: jasmine.createSpy('warn'),
    error: jasmine.createSpy('error'),
    trace: jasmine.createSpy('trace')
}

// Save the original worker_threads module
const originalWorkerThreads = global.worker_threads

describe('WorkerPool', () => {
    let workerPool
    const mockModulePath = path.join(__dirname, 'mockWorker.js')

    beforeEach(() => {
        // Mock worker_threads before each test
        global.worker_threads = { Worker: MockWorker }

        // Mock the logger module
        //   jest.mock('../../src/utils/Logger.js', () => mockLogger)

        // Reset mocks before each test
        mockLogger.debug.calls.reset()
        mockLogger.info.calls.reset()
        mockLogger.warn.calls.reset()
        mockLogger.error.calls.reset()

        // Create a new worker pool for each test
        workerPool = new WorkerPool(mockModulePath, 2)
    })

    afterEach(async () => {
        // Restore the original worker_threads module
        global.worker_threads = originalWorkerThreads

        // Ensure worker pool is shut down after each test
        if (workerPool && typeof workerPool.shutdown === 'function') {
            await workerPool.shutdown(true)
        }
    })

    describe('initialization', () => {
        it('should create the specified number of workers', () => {
            expect(workerPool.workers.length).toBe(2)
            expect(workerPool.size).toBe(2)
            expect(workerPool.modulePath).toBe(mockModulePath)
        })

        it('should throw an error if module path is not provided', () => {
            expect(() => new WorkerPool()).toThrowError('Worker module path is required')
        })

        it('should initialize workers with correct event handlers', () => {
            const worker = workerPool.workers[0].worker
            expect(worker.listenerCount('message')).toBe(1)
            expect(worker.listenerCount('error')).toBe(1)
            expect(worker.listenerCount('exit')).toBe(1)
        })
    })

    describe('job queue management', () => {
        it('should enqueue jobs and process them with available workers', async () => {
            const jobData = { taskId: 1, data: 'test' }
            const jobPromise = workerPool.enqueue(jobData)

            // Job should be dispatched to a worker immediately as workers are available
            expect(workerPool.queue.length).toBe(0)
            expect(workerPool.activeJobs).toBe(1)

            const result = await jobPromise
            expect(result.success).toBe(true)
            expect(result.input).toEqual(jobData)
            expect(workerPool.activeJobs).toBe(0)
        })

        it('should queue jobs when all workers are busy', async () => {
            // Fill all workers
            const job1 = workerPool.enqueue({ taskId: 1 })
            const job2 = workerPool.enqueue({ taskId: 2 })

            // This should be queued
            workerPool.enqueue({ taskId: 3 })

            expect(workerPool.queue.length).toBe(1)
            expect(workerPool.activeJobs).toBe(2)

            // Wait for the first jobs to complete
            await Promise.all([job1, job2])

            // The queued job should now be processing
            expect(workerPool.queue.length).toBe(0)
            expect(workerPool.activeJobs).toBe(1)
        })

        it('should handle worker errors gracefully', async () => {
            // Get reference to first worker
            const workerWrapper = workerPool.workers[0]
            const worker = workerWrapper.worker

            // Make the worker error out on next message
            worker.triggerError()

            // Attempt to process a job with this worker
            const jobPromise = workerPool.enqueue({ taskId: 1 })

            // Job should fail
            await expectAsync(jobPromise).toBeRejected()

            // Worker should be marked as not busy after error
            expect(workerWrapper.busy).toBe(false)
            expect(workerPool.activeJobs).toBe(0)
        })
    })

    describe('worker management', () => {
        it('should replace workers that exit unexpectedly', () => {
            const worker = workerPool.workers[0].worker
            const originalWorkerId = workerPool.workers[0].id

            // Simulate worker exit with non-zero code
            worker.triggerExit(1)

            // The worker should be replaced
            expect(workerPool.workers[0].worker).not.toBe(worker)
            expect(workerPool.workers[0].id).toBe(originalWorkerId)
        })

        it('should requeue jobs from terminated workers', async () => {
            // Start a job
            const jobPromise = workerPool.enqueue({ taskId: 1 })

            // Get reference to worker handling the job
            const busyWorker = workerPool.workers.find(w => w.busy)

            // Simulate worker termination
            busyWorker.worker.triggerExit(1)

            // Job should be requeued
            expect(workerPool.queue.length).toBe(1)

            // Job should eventually complete successfully
            const result = await jobPromise
            expect(result.success).toBe(true)
        })
    })

    describe('metrics and status', () => {
        it('should report correct metrics', async () => {
            // Start with no jobs
            expect(workerPool.getMetrics()).toEqual({
                totalWorkers: 2,
                busyWorkers: 0,
                queueLength: 0,
                activeJobs: 0
            })

            // Add some jobs
            const job1 = workerPool.enqueue({ taskId: 1 })
            const job2 = workerPool.enqueue({ taskId: 2 })
            workerPool.enqueue({ taskId: 3 })

            expect(workerPool.getMetrics()).toEqual({
                totalWorkers: 2,
                busyWorkers: 2,
                queueLength: 1,
                activeJobs: 2
            })

            // Complete the first jobs
            await Promise.all([job1, job2])

            expect(workerPool.getMetrics().queueLength).toBe(0)
        })

        it('should correctly report processing status', async () => {
            // Start with no jobs
            expect(workerPool.isProcessing()).toBe(false)

            // Add a job
            const jobPromise = workerPool.enqueue({ taskId: 1 })
            expect(workerPool.isProcessing()).toBe(true)

            // Wait for job to complete
            await jobPromise
            expect(workerPool.isProcessing()).toBe(false)
        })
    })

    describe('shutdown', () => {
        it('should terminate all workers on forced shutdown', async () => {
            // Add some jobs
            workerPool.enqueue({ taskId: 1 })
            workerPool.enqueue({ taskId: 2 })

            // Force shutdown
            await workerPool.shutdown(true)

            expect(workerPool.workers.length).toBe(0)
            expect(workerPool.queue.length).toBe(0)
            expect(workerPool.activeJobs).toBe(0)
        })

        it('should wait for jobs to complete on graceful shutdown', async () => {
            // Complete this job quickly
            const job1 = workerPool.enqueue({ taskId: 1 })

            // Start graceful shutdown
            const shutdownPromise = workerPool.shutdown(false)

            // Shutdown should wait for the job to complete
            expect(workerPool.workers.length).toBe(2)

            // Let job finish
            await job1

            // Wait for shutdown to complete
            await shutdownPromise

            expect(workerPool.workers.length).toBe(0)
        })
    })
})
