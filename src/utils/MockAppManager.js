import logger from './Logger.js'

class MockAppManager {
    constructor() {
        this.appsDir = 'src/apps'
        logger.debug('MockAppManager: Created new instance')
    }

    async initialize(appName, appPath, subtask, targetBaseDir, flags) {
        logger.debug(`MockAppManager.initialize(${appName}, ${appPath}, ${subtask}, ${targetBaseDir})`)

        if (!appName) {
            throw new Error('Application name is required')
        }

        this.app = {
            appName,
            appPath: appPath || appName,
            subtask,
            targetPath: targetBaseDir,
            dataset: {},
            appFilename: targetBaseDir ? `${targetBaseDir}/tt.ttl` : null
        }

        return Promise.resolve()
    }

    async start(message = {}) {
        logger.debug('MockAppManager.start()')
        logger.debug('Message:', message)

        if (!this.app) {
            throw new Error('Application not initialized')
        }

        // Simulate successful processing
        return {
            success: true,
            whiteboard: [
                { type: 'processingComplete', timestamp: new Date().toISOString() }
            ]
        }
    }

    async listapps() {
        logger.debug('MockAppManager.listapps()')

        // Return mock list of apps
        return [
            'test_app1',
            'test_app2',
            'example_app'
        ]
    }

    resolveApplicationPath(appName) {
        if (!appName) {
            throw new Error('Application name is required')
        }

        logger.debug(`MockAppManager.resolveApplicationPath(${appName})`)

        if (appName.startsWith('/')) {
            return appName
        }

        if (appName.startsWith('..')) {
            return path.resolve(process.cwd(), appName)
        }

        return path.join(process.cwd(), this.appsDir, appName)
    }
}

export default MockAppManager