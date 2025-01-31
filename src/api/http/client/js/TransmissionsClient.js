class TransmissionsClient {
    constructor(baseUrl = 'http://localhost:4000/api') {
        this.baseUrl = baseUrl;
        this.metrics = {
            requests: 0,
            errors: 0,
            startTime: Date.now()
        };
        this.onStatusChange = null;
        this.onError = null;
        this.checkServerInterval = null;
    }

    setStatusCallback(callback) {
        this.onStatusChange = callback;
    }

    setErrorCallback(callback) {
        this.onError = callback;
    }

    handleError(error, context = '') {
        this.metrics.errors++;
        const errorDetails = {
            message: error.message,
            context: context,
            timestamp: new Date().toISOString(),
            requestCount: this.metrics.requests
        };
        
        console.error('API Error:', errorDetails);
        
        if (this.onError) {
            this.onError(errorDetails);
        }
        
        return errorDetails;
    }

    async fetchWithMetrics(url, options = {}) {
        this.metrics.requests++;
        const startTime = Date.now();
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data,
                duration: Date.now() - startTime
            };
        } catch (error) {
            const errorDetails = this.handleError(error, `Fetch to ${url}`);
            return {
                success: false,
                error: errorDetails,
                duration: Date.now() - startTime
            };
        }
    }

    async checkServer() {
        try {
            const response = await this.fetchWithMetrics(`${this.baseUrl}/`);
            const isAvailable = response.success && response.data.status === 'running';
            
            if (this.onStatusChange) {
                this.onStatusChange({
                    available: isAvailable,
                    metrics: this.metrics,
                    serverInfo: response.success ? response.data : null
                });
            }
            
            return isAvailable;
        } catch (error) {
            this.handleError(error, 'Server check');
            return false;
        }
    }

    async listApplications() {
        return await this.fetchWithMetrics(`${this.baseUrl}/applications`);
    }

    async runApplication(application, message = {}) {
        if (!application) {
            throw new Error('Application name is required');
        }

        return await this.fetchWithMetrics(`${this.baseUrl}/${application}`, {
            method: 'POST',
            body: JSON.stringify(message)
        });
    }

    startServerCheck(interval = 10000) {
        this.stopServerCheck();
        this.checkServerInterval = setInterval(() => this.checkServer(), interval);
    }

    stopServerCheck() {
        if (this.checkServerInterval) {
            clearInterval(this.checkServerInterval);
            this.checkServerInterval = null;
        }
    }

    getMetrics() {
        return {
            ...this.metrics,
            uptime: Math.floor((Date.now() - this.metrics.startTime) / 1000)
        };
    }
}

export default TransmissionsClient;