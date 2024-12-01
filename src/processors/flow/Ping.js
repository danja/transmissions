import { Worker } from 'worker_threads';
import path from 'path';
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';
import ns from '../../utils/ns.js';

class Ping extends Processor {
    constructor(config) {
        super(config);
        this.worker = null;
        this.pingConfig = {
            interval: this.getPropertyFromMyConfig(ns.trm.interval) || 5000,
            count: this.getPropertyFromMyConfig(ns.trm.count) || 0,
            payload: this.getPropertyFromMyConfig(ns.trm.payload) || 'ping',
            killSignal: this.getPropertyFromMyConfig(ns.trm.killSignal) || 'STOP',
            retryAttempts: this.getPropertyFromMyConfig(ns.trm.retryAttempts) || 3,
            retryDelay: this.getPropertyFromMyConfig(ns.trm.retryDelay) || 1000
        };
    }

    async process(message) {
        try {
            // Check for kill signal in incoming message
            if (message.kill === this.pingConfig.killSignal) {
                await this.shutdown();
                return this.emit('message', { 
                    ...message, 
                    pingStatus: 'stopped',
                    timestamp: Date.now()
                });
            }

            if (this.worker) {
                logger.warn('Ping worker already running, ignoring start request');
                return;
            }

            let retryCount = 0;
            const startWorker = async () => {
                try {
                    this.worker = new Worker(
                        path.join(process.cwd(), 'src/processors/flow/PingWorker.js')
                    );

                    this.worker.on('message', (msg) => {
                        switch (msg.type) {
                            case 'ping':
                                this.emit('message', {
                                    ...message,
                                    ping: {
                                        count: msg.count,
                                        timestamp: msg.timestamp,
                                        payload: msg.payload,
                                        status: 'running'
                                    }
                                });
                                break;
                            case 'complete':
                                this.emit('message', { 
                                    ...message, 
                                    pingComplete: true,
                                    timestamp: Date.now()
                                });
                                break;
                            case 'error':
                                this.handleWorkerError(msg.error, startWorker, retryCount);
                                break;
                        }
                    });

                    this.worker.on('error', (error) => {
                        this.handleWorkerError(error, startWorker, retryCount);
                    });

                    this.worker.on('exit', (code) => {
                        if (code !== 0) {
                            this.handleWorkerError(
                                new Error(`Worker stopped with exit code ${code}`),
                                startWorker,
                                retryCount
                            );
                        }
                        this.worker = null;
                    });

                    this.worker.postMessage({
                        type: 'start',
                        config: this.pingConfig
                    });

                } catch (error) {
                    this.handleWorkerError(error, startWorker, retryCount);
                }
            };

            await startWorker();

            return new Promise((resolve) => {
                this.worker.on('exit', () => {
                    resolve(message);
                });
            });

        } catch (error) {
            logger.error(`Failed to start ping processor: ${error}`);
            throw error;
        }
    }

    async handleWorkerError(error, retryFn, retryCount) {
        logger.error(`Ping worker error: ${error}`);
        
        if (retryCount < this.pingConfig.retryAttempts) {
            retryCount++;
            logger.info(`Retrying ping worker (attempt ${retryCount}/${this.pingConfig.retryAttempts})`);
            setTimeout(retryFn, this.pingConfig.retryDelay);
        } else {
            logger.error('Max retry attempts reached, stopping ping worker');
            this.emit('error', error);
            await this.shutdown();
        }
    }

    async shutdown() {
        if (this.worker) {
            this.worker.postMessage({ type: 'stop' });
            this.worker = null;
        }
    }
}

export default Ping;
