import path from 'path'
import logger from '../utils/Logger.js'

class ModuleLoader {
    constructor(classpath) {
        if (!Array.isArray(classpath)) {
            throw new Error('Classpath must be an array of paths')
        }

        // Store normalized paths based on environment
        this.isBrowser = typeof window !== 'undefined'
        this.classpath = classpath.map(p => this.isBrowser ? p : path.normalize(p))
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

        // In browser environment, we use a different loading strategy
        if (this.isBrowser) {
            try {
                // In browser, modules should be loaded via import maps or webpack
                const module = await this.loadBrowserModule(moduleName)
                this.moduleCache.set(moduleName, module)
                logger.debug(`Successfully loaded ${moduleName} in browser`)
                return module
            } catch (error) {
                errors.push(`Browser: ${error.message}`)
                throw new Error(`Failed to load module '${moduleName}' in browser: ${error.message}`)
            }
        } else {
            // Node.js environment - try each path in classpath
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
        }

        const errorMsg = `Failed to load module '${moduleName}' from paths:\n${errors.join('\n')}`
        throw new Error(errorMsg)
    }

    async loadBrowserModule(moduleName) {
        // In browser, we rely on webpack or importmaps to have made the module available
        try {
            const moduleUrl = `./processors/${moduleName}.js`
            const module = await import(moduleUrl)
            return module
        } catch (error) {
            logger.error(`Error loading module in browser: ${error.message}`)
            throw error
        }
    }

    clearCache() {
        this.moduleCache.clear()
    }

    addPath(newPath) {
        if (typeof newPath !== 'string') {
            throw new TypeError('Path must be a string')
        }
        const normalizedPath = this.isBrowser ? newPath : path.normalize(newPath)
        if (!this.classpath.includes(normalizedPath)) {
            this.classpath.push(normalizedPath)
            logger.debug(`Added path to classpath: ${normalizedPath}`)
        }
    }
}

export default ModuleLoader