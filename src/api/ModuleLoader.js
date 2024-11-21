// src/engine/ModuleLoader.js
import path from 'path'
import { fileURLToPath } from 'url'
import logger from '../utils/Logger.js'

class ModuleLoader {
    constructor(classpath) {
        if (!Array.isArray(classpath)) {
            throw new TypeError('Classpath must be an array')
        }

        // Ensure all paths are strings and normalize them
        this.classpath = classpath.map(p => {
            if (typeof p !== 'string') {
                throw new TypeError('All classpath entries must be strings')
            }
            return path.normalize(p)
        })

        this.moduleCache = new Map()
        logger.debug('ModuleLoader initialized with paths:', this.classpath)
    }

    async loadModule(moduleName) {
        logger.setLogLevel('debug')
        logger.debug(`ModuleLoader.loadModule looking for module in classpath ${this.classpath} `)
        if (typeof moduleName !== 'string') {
            throw new TypeError('Module name must be a string')
        }

        logger.debug(`Attempting to load module: ${moduleName}`)

        // Check cache first
        if (this.moduleCache.has(moduleName)) {
            logger.debug(`Retrieved ${moduleName} from cache`)
            return this.moduleCache.get(moduleName)
        }

        // Try each path in classpath
        for (const basePath of this.classpath) {
            try {
                const fullPath = path.join(basePath, `${moduleName}.js`)
                logger.debug(`Trying path: ${fullPath}`)

                const module = await import(fullPath)
                this.moduleCache.set(moduleName, module)
                logger.debug(`Successfully loaded ${moduleName} from ${fullPath}`)
                return module
            } catch (error) {
                logger.debug(`Failed to load from ${basePath}: ${error.message}`)
                continue
            }
        }

        throw new Error(`Module ${moduleName} not found in paths: ${this.classpath.join(', ')}`)
    }

    clearCache() {
        this.moduleCache.clear()
    }

    addPath(newPath) {
        if (typeof newPath !== 'string') {
            throw new TypeError('Path must be a string')
        }
        this.classpath.push(path.normalize(newPath))
    }
}
export default ModuleLoader