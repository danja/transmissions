class TransmissionsClient {
    constructor(baseUrl) {
        if (!baseUrl) {
            throw new Error('Base URL is required')
        }
        this.baseUrl = baseUrl
        this.metrics = {
            requests: 0,
            errors: 0,
            startTime: Date.now()
        }
    }

    async runApplication(application, message = {}) {
        if (!application) {
            throw new Error('Application name is required')
        }

        try {
            this.metrics.requests++
            console.log('Sending request:', {
                url: `${this.baseUrl}/${application}`,
                body: message
            })

            const response = await fetch(`${this.baseUrl}/${application}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message)
            })

            if (!response.ok) {
                this.metrics.errors++
                const error = await response.json()
                throw new Error(error.message || 'Request failed')
            }

            return await response.json()
        } catch (err) {
            this.metrics.errors++
            throw err
        }
    }

    getMetrics() {
        return {
            requests: this.metrics.requests,
            errors: this.metrics.errors,
            uptime: Math.floor((Date.now() - this.metrics.startTime) / 1000)
        }
    }

    setBaseUrl(url) {
        if (!url) {
            throw new Error('Base URL is required')
        }
        this.baseUrl = url
    }
}

export default TransmissionsClient