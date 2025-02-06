import path from 'path'
import { fileURLToPath } from 'url'
import logger from '../utils/Logger.js'
import ModuleLoader from './ModuleLoader.js'

class ModuleLoaderFactory {
    static instance = null;

    static createModuleLoader(classpath) {
        logger.debug(`\nModuleLoaderFactory.createModuleLoader, classpath =\n ${classpath}`)
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)

        if (!ModuleLoaderFactory.instance) {
            ModuleLoaderFactory.instance = new ModuleLoader(classpath)
        }

        return ModuleLoaderFactory.instance
    }

    static createApplicationLoader(appPath) {
        logger.debug(`\nModuleLoaderFactory.createApplicationLoader called with ${appPath}`)
        if (!appPath) {
            throw new Error('Application path is required')
        }

        // TODO revisit
        const appProcessorsPath = appPath
        // const appProcessorsPath = path.join(appPath, 'processors')

        const corePath = path.resolve(process.cwd(), 'src/processors')

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