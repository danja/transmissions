import TransmissionsClient from './TransmissionsClient.js'

class TestClientUI {
    constructor() {
        this.elements = {
            baseUrl: document.getElementById('baseUrl'),
            application: document.getElementById('application'),
            message: document.getElementById('message'),
            sendButton: document.getElementById('sendButton'),
            status: document.getElementById('status'),
            response: document.getElementById('response'),
            metrics: document.getElementById('metrics')
        }

        // Ensure baseUrl has a value
        if (!this.elements.baseUrl.value) {
            this.elements.baseUrl.value = 'http://localhost:4200/api'
        }

        this.initialize()
        this.bindEvents()
    }

    initialize() {
        try {
            this.client = new TransmissionsClient(this.elements.baseUrl.value)
            this.updateStatus(true)
            this.startMetricsUpdate()
        } catch (err) {
            console.error('Initialization error:', err)
            this.handleError(err)
        }
    }

    bindEvents() {
        this.elements.sendButton.addEventListener('click', () => this.sendRequest())
        this.elements.baseUrl.addEventListener('change', () => {
            try {
                this.client.setBaseUrl(this.elements.baseUrl.value)
                this.updateStatus(true)
            } catch (err) {
                this.handleError(err)
            }
        })
    }

    updateStatus(isOnline) {
        const { status: statusEl, sendButton } = this.elements
        if (isOnline) {
            statusEl.className = 'status success'
            statusEl.textContent = 'Server online'
            sendButton.disabled = false
        } else {
            statusEl.className = 'status error'
            statusEl.textContent = 'Server offline'
            sendButton.disabled = true
        }
    }

    handleError(error) {
        const { status: statusEl } = this.elements
        statusEl.className = 'status error'
        statusEl.textContent = `Error: ${error.message}`
        console.error('Client error:', error)
    }

    startMetricsUpdate() {
        setInterval(() => {
            if (this.client) {
                const metrics = this.client.getMetrics()
                this.updateMetricsDisplay(metrics)
            }
        }, 1000)
    }

    updateMetricsDisplay(metrics) {
        if (!metrics) return

        this.elements.metrics.innerHTML = `
            <div class="metric-card">
                <div>Requests</div>
                <div class="metric-value">${metrics.requests}</div>
            </div>
            <div class="metric-card">
                <div>Errors</div>
                <div class="metric-value">${metrics.errors}</div>
            </div>
            <div class="metric-card">
                <div>Uptime</div>
                <div class="metric-value">${metrics.uptime}s</div>
            </div>
        `
    }

    async sendRequest() {
        const { application, message, response: responseEl, status: statusEl, sendButton } = this.elements

        try {
            let messageData
            try {
                messageData = JSON.parse(message.value)
            } catch (err) {
                throw new Error('Invalid JSON in message field')
            }

            statusEl.className = 'status info'
            statusEl.textContent = 'Sending request...'
            sendButton.disabled = true

            const result = await this.client.runApplication(application.value, messageData)

            if (result.success) {
                statusEl.className = 'status success'
                statusEl.textContent = 'Request successful'
                responseEl.textContent = JSON.stringify(result.data, null, 2)
            } else {
                throw new Error(result.error || 'Request failed')
            }
        } catch (err) {
            statusEl.className = 'status error'
            statusEl.textContent = `Error: ${err.message}`
            responseEl.textContent = ''
            console.error('Request error:', err)
        } finally {
            sendButton.disabled = false
        }
    }
}

// Initialize the UI when the page loads
const ui = new TestClientUI()

// Handle global errors
window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason)
    if (ui) {
        ui.handleError({
            message: 'Unhandled error: ' + event.reason.message
        })
    }
})