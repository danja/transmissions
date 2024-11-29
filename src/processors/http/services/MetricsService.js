import WebSocket from 'ws';
import os from 'os';

class MetricsService {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.metrics = {
            startTime: Date.now(),
            requests: 0,
            connections: 0,
            memory: {},
            cpu: {}
        };
        this.setupWebSocket();
        this.startMetricsCollection();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            this.metrics.connections++;
            ws.on('close', () => this.metrics.connections--);
        });
    }

    startMetricsCollection() {
        setInterval(() => {
            this.updateMetrics();
            this.broadcastMetrics();
        }, 1000);
    }

    updateMetrics() {
        this.metrics.uptime = (Date.now() - this.metrics.startTime) / 1000;
        this.metrics.memory = {
            used: process.memoryUsage().heapUsed,
            total: os.totalmem(),
            free: os.freemem()
        };
        this.metrics.cpu = {
            load: os.loadavg(),
            cores: os.cpus().length
        };
    }

    broadcastMetrics() {
        const data = JSON.stringify(this.metrics);
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }

    incrementRequests() {
        this.metrics.requests++;
    }
}

export default MetricsService;