import path from 'path';
import { Worker } from 'worker_threads';
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';
import ns from '../../utils/ns.js';

class HttpServer extends Processor {
    constructor(config) {
        super(config);
        this.worker = null;
        this.serverConfig = {
            port: this.getPropertyFromMyConfig(ns.trn.port) || 4000,
            basePath: this.getPropertyFromMyConfig(ns.trn.basePath) || '/transmissions/test/',
            staticPath: this.getPropertyFromMyConfig(ns.trn.staticPath),
            cors: this.getPropertyFromMyConfig(ns.trn.cors) || false,
            timeout: this.getPropertyFromMyConfig(ns.trn.timeout) || 30000,
            maxRequestSize: this.getPropertyFromMyConfig(ns.trn.maxRequestSize) || '1mb',
            rateLimit: {
                windowMs: 15 * 60 * 1000,
                max: 100
            }
        };
    }

    async process(message) {
        try {
            this.worker = new Worker(
                path.join(process.cwd(), 'src/processors/http/HttpServerWorker.js')
            );

            this.worker.on('message', (msg) => {
                switch (msg.type) {
                    case 'status':
                        if (msg.status === 'running') {
                            logger.info(`Server running on port ${msg.port}`);
                        } else if (msg.status === 'stopped') {
                            this.emit('message', { ...message, serverStopped: true });
                        }
                        break;
                    case 'error':
                        logger.error(`Server error: ${msg.error}`);
                        this.emit('error', new Error(msg.error));
                        break;
                }
            });

            this.worker.on('error', (error) => {
                logger.error(`Worker error: ${error}`);
                this.emit('error', error);
            });

            this.worker.postMessage({
                type: 'start',
                config: this.serverConfig
            });

            return new Promise((resolve) => {
                this.worker.on('exit', () => {
                    resolve(message);
                });
            });

        } catch (error) {
            logger.error(`Failed to start server: ${error}`);
            throw error;
        }
    }

    async shutdown() {
        if (this.worker) {
            this.worker.postMessage({ type: 'stop' });
        }
    }
}

export default HttpServer;