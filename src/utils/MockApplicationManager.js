import logger from './Logger.js'

class MockApplicationManager {
    constructor() {
        this.appsDir = 'src/applications'
        logger.debug('MockApplicationManager: Created new instance')
    }

    async initialize(options) {
        //   async initialize(appName, appPath, subtask, targetBaseDir, flags) {
        logger.debug(`MockApplicationManager.initialize(${appName}, ${appPath}, ${subtask}, ${targetBaseDir})`)

        if (!appName) {
            throw new Error('Application name is required')
        }

        this.app = {
            appName,
            appPath: appPath || appName,
            subtask,
            targetPath: targetBaseDir,
            dataset: {},
            appFilename: targetBaseDir ? `${targetBaseDir}/app.ttl` : null
        }

        return Promise.resolve()
    }

    async start(message = {}) {
        logger.debug('MockApplicationManager.start()')
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

    async listApplications() {
        logger.debug('MockApplicationManager.listApplications()')

        // Return mock list of applications
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

        logger.debug(`MockApplicationManager.resolveApplicationPath(${appName})`)

        if (appName.startsWith('/')) {
            return appName
        }

        if (appName.startsWith('..')) {
            return path.resolve(process.cwd(), appName)
        }

        return path.join(process.cwd(), this.appsDir, appName)
    }
}

export default MockApplicationManager