import TransmissionsClient from './TransmissionsClient.js'

class TestClientUI {
    constructor() {
        this.client = null
        this.elements = {
            baseUrl: document.getElementById('baseUrl'),
            application: document.getElementById('application'),
            message: document.getElementById('message'),
            sendButton: document.getElementById('sendButton'),
            status: document.getElementById('status'),
            response: document.getElementById('response'),
            metrics: document.getElementById('metrics')
        }

        this.initialize()
        this.bindEvents()
    }

    initialize() {
        this.client = new TransmissionsClient(this.elements.baseUrl.value)
        this.client.setStatusCallback(this.updateStatus.bind(this))
        this.client.setErrorCallback(this.handleError.bind(this))
        this.client.startServerCheck()

        setInterval(() => this.updateMetrics(), 1000)
    }

    bindEvents() {
        this.elements.sendButton.addEventListener('click', () => this.sendRequest())
        this.elements.baseUrl.addEventListener('change', () => {
            this.client.setBaseUrl(this.elements.baseUrl.value)
            this.client.checkServer()
        })
    }

    updateStatus(status) {
        const { status: statusEl, sendButton } = this.elements

        if (status.available) {
            statusEl.className = 'status success'
            statusEl.textContent = `Server online - ${status.serverInfo.version}`
            sendButton.disabled = false
        } else {
            statusEl.className = 'status error'
            statusEl.textContent = 'Server offline or unreachable'
            sendButton.disabled = true
        }
    }

    handleError(error) {
        const { status: statusEl } = this.elements
        statusEl.className = 'status error'
        statusEl.textContent = `Error: ${error.message}`

        console.error('Client error:', error)
    }

    updateMetrics() {
        const metrics = this.client.getMetrics()
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
            const messageData = JSON.parse(message.value)

            statusEl.className = 'status info'
            statusEl.textContent = 'Sending request...'
            sendButton.disabled = true

            const result = await this.client.runApplication(application.value, messageData)

            if (result.success) {
                statusEl.className = 'status success'
                statusEl.textContent = `Request successful (${result.duration}ms)`
                responseEl.textContent = JSON.stringify(result.data, null, 2)
            } else {
                throw new Error(result.error.message)
            }
        } catch (err) {
            statusEl.className = 'status error'
            statusEl.textContent = `Error: ${err.message}`
            responseEl.textContent = ''
        } finally {
            sendButton.disabled = false
        }
    }
}

// Initialize the UI
// Handle global errors
window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason)
    const ui = window.ui
    if (ui) {
        ui.handleError({
            message: 'Unhandled error: ' + event.reason.message,
            context: 'Global error handler',
            timestamp: new Date().toISOString()
        })
    }
})

const ui = new TestClientUI()