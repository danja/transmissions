import { parentPort } from 'worker_threads';
import express from 'express';
import path from 'path';
import logger from '../../utils/Logger.js';

class ServerWorker {
    constructor(config) {
        this.app = express();
        this.server = null;
        this.config = config;
        this.setupMessageHandling();
    }

    setupMessageHandling() {
        parentPort.on('message', (message) => {
            switch (message.type) {
                case 'start':
                    this.start(message.config);
                    break;
                case 'stop':
                    this.stop();
                    break;
                default:
                    logger.warn(`Unknown message type: ${message.type}`);
            }
        });
    }

    async start(config) {
        try {
            const { port = 4000, basePath = '/transmissions/test/', staticPath } = config;

            if (staticPath) {
                this.app.use(basePath, express.static(staticPath));
            }

            this.app.post('/shutdown', (req, res) => {
                res.send('Server shutting down...');
                this.stop();
            });

            this.server = this.app.listen(port, () => {
                parentPort.postMessage({
                    type: 'status',
                    status: 'running',
                    port: port
                });
            });

        } catch (error) {
            parentPort.postMessage({
                type: 'error',
                error: error.message
            });
        }
    }

    async stop() {
        if (this.server) {
            try {
                await new Promise((resolve, reject) => {
                    this.server.close((err) => {
                        if (err) reject(err);
                        resolve();
                    });
                });

                parentPort.postMessage({
                    type: 'status',
                    status: 'stopped'
                });

                process.exit(0);
            } catch (error) {
                parentPort.postMessage({
                    type: 'error',
                    error: error.message
                });
                process.exit(1);
            }
        }
    }
}

const worker = new ServerWorker();