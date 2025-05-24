import { Worker } from 'worker_threads'
import logger from '../utils/Logger.js'

class WorkerPool {
    constructor(module, size) {
        this.workers = []
        this.queue = []
        this.pendingCallbacks = new Map()
        this.messageIdCounter = 0
        
        for (let i = 0; i < size; i++) {
            const worker = new Worker(module)
            const workerWrapper = { worker, busy: false, currentMessageId: null, workerId: i }
            worker.on('message', (result) => {
                logger.debug(`WorkerPool: Worker ${i} sent result: ${JSON.stringify(result)}`)
                // Handle completion, possibly dispatching next message
                this.markWorkerIdle(workerWrapper, result)
            })
            worker.on('error', (error) => {
                logger.error(`WorkerPool: Worker ${i} error: ${error.message}`)
            })
            this.workers.push(workerWrapper)
        }
    }

    enqueueMessage(messageData) {
        const messageId = ++this.messageIdCounter
        logger.debug(`WorkerPool.enqueueMessage: Adding message ${messageId} to queue`)
        this.pendingCallbacks.set(messageId, messageData.onComplete)
        this.queue.push({ ...messageData, messageId })
        this.dispatch()
    }

    dispatch() {
        logger.debug(`WorkerPool.dispatch: Queue length ${this.queue.length}`)
        const idleWorkerWrapper = this.workers.find(wrapper => !wrapper.busy)
        if (idleWorkerWrapper && this.queue.length) {
            const messageData = this.queue.shift()
            idleWorkerWrapper.busy = true
            idleWorkerWrapper.currentMessageId = messageData.messageId
            
            logger.debug(`WorkerPool.dispatch: Sending message ${messageData.messageId} to worker ${idleWorkerWrapper.workerId}`)
            
            // Remove onComplete before sending to worker
            const { onComplete, ...serializableData } = messageData
            idleWorkerWrapper.worker.postMessage(serializableData)
        } else {
            logger.debug(`WorkerPool.dispatch: No idle workers or empty queue`)
        }
    }

    markWorkerIdle(workerWrapper, result) {
        logger.debug(`WorkerPool.markWorkerIdle: Worker ${workerWrapper.workerId} completed message ${workerWrapper.currentMessageId}`)
        workerWrapper.busy = false
        
        // Call completion callback if present
        if (workerWrapper.currentMessageId && this.pendingCallbacks.has(workerWrapper.currentMessageId)) {
            const callback = this.pendingCallbacks.get(workerWrapper.currentMessageId)
            this.pendingCallbacks.delete(workerWrapper.currentMessageId)
            logger.debug(`WorkerPool.markWorkerIdle: Calling completion callback for message ${workerWrapper.currentMessageId}`)
            if (callback) callback(result)
        } else {
            logger.warn(`WorkerPool.markWorkerIdle: No callback found for message ${workerWrapper.currentMessageId}`)
        }
        
        workerWrapper.currentMessageId = null
        this.dispatch() // Check if there's more work to do
    }

    terminate() {
        logger.debug('WorkerPool.terminate: Terminating all workers')
        for (const workerWrapper of this.workers) {
            workerWrapper.worker.terminate()
        }
        this.workers = []
        this.queue = []
        this.pendingCallbacks.clear()
    }
}
export default WorkerPool
