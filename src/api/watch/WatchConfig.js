// src/api/watch/WatchConfig.js
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import os from 'os'
import logger from '../../utils/Logger.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

class WatchConfig {
    constructor(configPath = null) {
        this.configPath = configPath || path.join(__dirname, 'watch-config.json')
        this.config = null
    }

    async load() {
        try {
            const configContent = await fs.readFile(this.configPath, 'utf8')
            const rawConfig = JSON.parse(configContent)
            
            this.config = await this.processConfig(rawConfig)
            logger.debug(`Loaded watch configuration with ${this.config.length} watch sets`)
            return this.config
        } catch (error) {
            throw new Error(`Failed to load watch configuration from ${this.configPath}: ${error.message}`)
        }
    }

    async processConfig(rawConfig) {
        if (!Array.isArray(rawConfig)) {
            throw new Error('Watch configuration must be an array of watch sets')
        }

        const processedConfig = []
        
        for (const watchSet of rawConfig) {
            if (!this.validateWatchSet(watchSet)) {
                continue
            }

            const processedSet = {
                name: watchSet.name,
                dirs: await this.expandPaths(watchSet.dirs),
                apps: watchSet.apps,
                watchEvents: watchSet.watchEvents || ['change', 'rename'] // Default to both if not specified
            }
            
            processedConfig.push(processedSet)
        }
        
        return processedConfig
    }

    validateWatchSet(watchSet) {
        if (!watchSet.name || typeof watchSet.name !== 'string') {
            logger.warn('Watch set missing valid name, skipping')
            return false
        }
        
        if (!Array.isArray(watchSet.dirs) || watchSet.dirs.length === 0) {
            logger.warn(`Watch set "${watchSet.name}" has no directories, skipping`)
            return false
        }
        
        if (!Array.isArray(watchSet.apps) || watchSet.apps.length === 0) {
            logger.warn(`Watch set "${watchSet.name}" has no apps, skipping`)
            return false
        }
        
        // Validate watchEvents if provided
        if (watchSet.watchEvents && !Array.isArray(watchSet.watchEvents)) {
            logger.warn(`Watch set "${watchSet.name}" has invalid watchEvents (must be array), skipping`)
            return false
        }
        
        if (watchSet.watchEvents && watchSet.watchEvents.length === 0) {
            logger.warn(`Watch set "${watchSet.name}" has empty watchEvents array, skipping`)
            return false
        }
        
        // Validate that watchEvents contains only supported events
        const supportedEvents = ['change', 'rename']
        if (watchSet.watchEvents) {
            for (const event of watchSet.watchEvents) {
                if (!supportedEvents.includes(event)) {
                    logger.warn(`Watch set "${watchSet.name}" contains unsupported event "${event}", supported: ${supportedEvents.join(', ')}`)
                    return false
                }
            }
        }
        
        return true
    }

    async expandPaths(dirs) {
        const expandedPaths = []
        
        for (const dir of dirs) {
            const expandedPath = this.expandTildePath(dir)
            const resolvedPath = path.resolve(expandedPath)
            
            try {
                const stats = await fs.stat(resolvedPath)
                if (stats.isDirectory()) {
                    expandedPaths.push(resolvedPath)
                    logger.debug(`Added watch directory: ${resolvedPath}`)
                } else {
                    logger.warn(`Path is not a directory, skipping: ${resolvedPath}`)
                }
            } catch (error) {
                logger.warn(`Directory does not exist, skipping: ${resolvedPath}`)
            }
        }
        
        return expandedPaths
    }

    expandTildePath(filePath) {
        if (filePath.startsWith('~/')) {
            return path.join(os.homedir(), filePath.slice(2))
        }
        return filePath
    }

    getWatchSets() {
        if (!this.config) {
            throw new Error('Configuration not loaded. Call load() first.')
        }
        return this.config
    }

    getWatchSetByName(name) {
        if (!this.config) {
            throw new Error('Configuration not loaded. Call load() first.')
        }
        return this.config.find(set => set.name === name)
    }
}

export default WatchConfig