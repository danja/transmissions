import path from 'path'
import { fileURLToPath } from 'url'
import logger from '../utils/Logger.js'
import ModuleLoader from './ModuleLoader.js'

class ModuleLoaderFactory {
    static instance = null;

    static createModuleLoader(classpath) {
        logger.debug(`\nModuleLoaderFactory.createModuleLoader, classpath =\n ${classpath}`)

        // In browser environment, we don't have __filename or __dirname
        const isBrowser = typeof window !== 'undefined'

        if (!ModuleLoaderFactory.instance) {
            ModuleLoaderFactory.instance = new ModuleLoader(classpath)
        }

        return ModuleLoaderFactory.instance
    }

    static createApplicationLoader(appPath) {
        logger.debug(`ModuleLoaderFactory.createApplicationLoader
    appPath = ${appPath}`)
        if (!appPath) {
            throw new Error('Application path is required')
        }

        const appProcessorsPath = appPath

        // Handle different environments (browser vs node)
        let corePath
        if (typeof window !== 'undefined') {
            // Browser environment
            corePath = '/src/processors'
        } else {
            // Node.js environment
            corePath = path.resolve(process.cwd(), 'src/processors')
        }

        logger.debug(`ModuleLoaderFactory creating loader with paths:
      App: ${appProcessorsPath}
      Core: ${corePath}`)

        return this.createModuleLoader([appProcessorsPath, corePath])
    }

    static clearInstance() {
        ModuleLoaderFactory.instance = null
    }
}
export default ModuleLoaderFactory