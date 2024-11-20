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

    // THIS ISN'T GETTING CALLED
    /*
    static createApplicationLoader(appPath) {
        logger.setLogLevel('debug')
        logger.debug('££££££££££££££££££££££££££££££££££')
        if (!appPath) {
            throw new Error('Application path is required')
        }

        // Ensure we're working with a string path
        const basePath = typeof appPath === 'string' ? appPath : appPath.toString()

        // Normalize the application path
        const normalizedPath = path.resolve(process.cwd(), basePath)
        logger.debug(`Creating application loader for normalized path: ${normalizedPath}`)

        const appProcessorsPath = path.join(normalizedPath, 'processors')
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const corePath = path.resolve(__dirname, '../processors')

        logger.debug(`App processors path: ${appProcessorsPath}`)
        logger.debug(`Core processors path: ${corePath}`)

        return this.createModuleLoader([appProcessorsPath, corePath])
    }
*/
    // src/api/ModuleLoaderFactory.js
    static createApplicationLoader(appPath) {
        logger.debug(`ModuleLoaderFactory.createApplicationLoader called with ${appPath}`)
        if (!appPath) {
            throw new Error('Application path is required')
        }
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)

        const normalizedPath = path.resolve(process.cwd(), appPath)
        const appProcessorsPath = path.join(normalizedPath, 'processors')
        const corePath = path.resolve(__dirname, '../processors')

        logger.debug(`Creating loader with paths:
      App: ${appProcessorsPath}
      Core: ${corePath}`)

        return this.createModuleLoader([appProcessorsPath, corePath])
    }

    static clearInstance() {
        ModuleLoaderFactory.instance = null
    }
}
export default ModuleLoaderFactory
