// src/engine/ModuleLoaderFactory.js

import path from 'path'
import { fileURLToPath } from 'url'
import logger from '../utils/Logger.js'
import ModuleLoader from './ModuleLoader.js'

class ModuleLoaderFactory {
    static instance = null;

    static createModuleLoader(additionalPaths = []) {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)

        // Core processors path relative to factory location
        const corePath = path.resolve(__dirname, '../processors')

        // Combine and normalize paths
        const classpath = [corePath, ...additionalPaths].map(p => path.normalize(p.toString()))

        logger.debug('Creating ModuleLoader with paths:', classpath)

        // Create new instance if none exists or paths have changed
        if (!ModuleLoaderFactory.instance) {
            ModuleLoaderFactory.instance = new ModuleLoader(classpath)
        }

        return ModuleLoaderFactory.instance
    }

    /*
    static createApplicationLoader(appPath) {
        if (typeof appPath !== 'string') {
            throw new TypeError('Application path must be a string')
        }

        const appProcessorsPath = path.resolve(appPath, 'processors')
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const corePath = path.resolve(__dirname, '../processors')

        return this.createModuleLoader([appProcessorsPath, corePath])
    }
        */


    static clearInstance() {
        ModuleLoaderFactory.instance = null
    }
}
export default ModuleLoaderFactory 