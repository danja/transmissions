// src/api/ApplicationManager.js
import path from 'path'
import fs from 'fs/promises'
import logger from '../utils/Logger.js'

class ApplicationManager {
    constructor(appsDir) {
        this.appsDir = appsDir
    }

    async listApplications() {
        try {
            const entries = await fs.readdir(this.appsDir, { withFileTypes: true })
            const subdirChecks = entries
                .filter(dirent => dirent.isDirectory())
                .map(async (dirent) => {
                    const subdirPath = path.join(this.appsDir, dirent.name)
                    const files = await fs.readdir(subdirPath)
                    return files.includes('about.md') ? dirent.name : null
                })

            const validApps = (await Promise.all(subdirChecks)).filter(Boolean)
            return validApps
        } catch (err) {
            logger.error('Error listing applications:', err)
            return []
        }
    }


    resolveApplicationPath(appName) {
        logger.debug(`\nApplicationManager.resolveApplicationPath, appName = ${appName}`)

        if (appName.startsWith('/')) { // it's an absolute path
            return appName
        }
        /* const isRemote = appName.includes('/')
        if (!isRemote) {
            return appName
        }
            */

        if (appName.startsWith('..')) {
            // For external paths, use absolute path resolution
            const resolved = path.resolve(process.cwd(), appName)
            logger.debug(`ApplicationManager.resolveApplicationPath, resolved = ${resolved}`)
            return resolved
        }
        logger.debug(`ApplicationManager.resolveApplicationPath, this.appsDir = ${this.appsDir}`)

        // Default local (core) path resolution
        return path.join(process.cwd(), this.appsDir, appName)
    }

    async getApplicationConfig(appPath) {
        logger.debug('appPath = ' + appPath)
        //    const appPath = this.resolveApplicationPath(appName)
        return {
            transmissionsFile: path.join(appPath, 'transmissions.ttl'),
            processorsConfigFile: path.join(appPath, 'processors-config.ttl'),
            modulePath: path.join(appPath, 'processors')
        }
    }
}

export default ApplicationManager