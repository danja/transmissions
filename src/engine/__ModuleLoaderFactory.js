// src/engine/ModuleLoaderFactory.js

import path from 'path'
import { fileURLToPath } from 'url'
import logger from '../utils/Logger.js'
import ModuleLoader from './_ModuleLoader.js'

class ModuleLoaderFactory {
    static instance = null;

    static createModuleLoader(classpath) { // dditionalPaths = []
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)


        /*
        // Core processors path relative to factory location
        const corePath = path.resolve(__dirname, '../processors')

        // Combine and normalize paths
        const classpath = [corePath, ...additionalPaths].map(p => path.normalize(p.toString()))

        logger.debug(`Creating ModuleLoader with paths:\n${classpath}`)
*/
        // Create new instance if none exists or paths have changed
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
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)

        const normalizedPath = path.resolve(process.cwd(), appPath)
        //    const appProcessorsPath = path.join(normalizedPath, 'processors')
        const appProcessorsPath = normalizedPath
        const corePath = path.resolve(__dirname, '../processors')

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
