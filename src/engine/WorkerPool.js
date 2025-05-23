import { Worker } from 'worker_threads'
import logger from '../utils/Logger.js'

class WorkerPool {
    constructor(module, size) {
        this.workers = []
        this.queue = []
        for (let i = 0; i < size; i++) {
            const worker = new Worker(module)
            worker.on('message', () => {
                // Handle completion, possibly dispatching next message
                this.markWorkerIdle(worker)
            })
            this.workers.push({ worker, busy: false })
        }
    }

    enqueueMessage(message) {
        this.queue.push(message)
        this.dispatch()
    }

    dispatch() {
        logger.debug(`WorkerPool.dispatch ********************`)
        const idleWorkerWrapper = this.workers.find(wrapper => !wrapper.busy)
        if (idleWorkerWrapper && this.queue.length) {
            const message = this.queue.shift()
            idleWorkerWrapper.busy = true
            idleWorkerWrapper.worker.postMessage(message)
        }
    }

    markWorkerIdle(workerWrapper) {
        workerWrapper.busy = false
        this.dispatch() // Check if there's more work to do
    }
}
export default WorkerPool
