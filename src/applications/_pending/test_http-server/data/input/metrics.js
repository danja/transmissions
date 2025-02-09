class MetricsUI {
    constructor() {
        this.ws = null;
        this.token = null;
        this.setupWebSocket();
        this.setupAuth();
    }

    setupWebSocket() {
        this.ws = new WebSocket(`ws://${window.location.host}/metrics`);
        this.ws.onmessage = (event) => {
            const metrics = JSON.parse(event.data);
            this.updateMetricsDisplay(metrics);
        };
    }

    async setupAuth() {
        const response = await fetch('/admin/token');
        const { token } = await response.json();
        this.token = token;
    }

    updateMetricsDisplay(metrics) {
        const display = document.getElementById('metrics');
        display.innerHTML = `
            <div>Uptime: ${Math.floor(metrics.uptime)}s</div>
            <div>Connections: ${metrics.connections}</div>
            <div>Requests: ${metrics.requests}</div>
            <div>Memory Used: ${Math.floor(metrics.memory.used / 1024 / 1024)}MB</div>
            <div>CPU Load: ${metrics.cpu.load[0].toFixed(2)}</div>
        `;
    }

    async shutdown() {
        try {
            await fetch('/admin/shutdown', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
        } catch (error) {
            console.error('Shutdown failed:', error);
        }
    }
}

export default new MetricsUI();