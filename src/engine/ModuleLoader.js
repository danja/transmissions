import path from 'path'
import { fileURLToPath } from 'url'
import logger from '../utils/Logger.js'

class ModuleLoader {
    constructor(classpath) {
        if (!Array.isArray(classpath)) {
            throw new Error('Classpath must be an array of paths')
        }
        this.classpath = classpath.map(p => path.normalize(p))
        this.moduleCache = new Map()
        logger.debug(`ModuleLoader initialized with paths:\n${this.classpath.join('\n')}`)
    }

    async loadModule(moduleName) {
        logger.debug(`ModuleLoader.loadModule attempting to load: ${moduleName}`)

        if (this.moduleCache.has(moduleName)) {
            logger.debug(`Retrieved ${moduleName} from cache`)
            return this.moduleCache.get(moduleName)
        }

        const errors = []
        for (const basePath of this.classpath) {
            try {
                const fullPath = path.join(basePath, `${moduleName}.js`)
                logger.debug(`Trying path: ${fullPath}`)
                const module = await import(fullPath)
                this.moduleCache.set(moduleName, module)
                logger.debug(`Successfully loaded ${moduleName} from ${fullPath}`)
                return module
            } catch (error) {
                errors.push(`${basePath}: ${error.message}`)
                continue
            }
        }

        const errorMsg = `Failed to load module '${moduleName}' from paths:\n${errors.join('\n')}`
        throw new Error(errorMsg)
    }

    clearCache() {
        this.moduleCache.clear()
    }

    addPath(newPath) {
        if (typeof newPath !== 'string') {
            throw new TypeError('Path must be a string')
        }
        const normalizedPath = path.normalize(newPath)
        if (!this.classpath.includes(normalizedPath)) {
            this.classpath.push(normalizedPath)
            logger.debug(`Added path to classpath: ${normalizedPath}`)
        }
    }
}

export default ModuleLoader