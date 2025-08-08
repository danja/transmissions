// src/api/watch/Watch.js
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import WatchConfig from './WatchConfig.js'
import logger from '../../utils/Logger.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

class Watch {
    constructor(configPath = null, options = {}) {
        this.configPath = configPath
        this.watchConfig = new WatchConfig(configPath)
        this.watchers = new Map()
        this.debounceMs = options.debounceMs || 1000
        this.debounceTimers = new Map()
        this.excludePatterns = options.excludePatterns || [
            /node_modules/,
            /\.git/,
            /\.DS_Store/,
            /\.swp$/,
            /~$/,
            /\.tmp$/,
            /\.log$/
        ]
        this.transPath = options.transPath || this.findTransExecutable()
        this.setupSignalHandlers()
    }

    findTransExecutable() {
        const possiblePaths = [
            path.join(__dirname, '../../../trans'),
            path.join(process.cwd(), 'trans'),
            './trans'
        ]
        
        for (const transPath of possiblePaths) {
            try {
                fs.accessSync(transPath, fs.constants.X_OK)
                return transPath
            } catch (error) {
                continue
            }
        }
        
        logger.warn('Trans executable not found, using "./trans" as fallback')
        return './trans'
    }

    async start() {
        logger.info('Starting Transmissions file watcher...')
        
        try {
            await this.watchConfig.load()
            const watchSets = this.watchConfig.getWatchSets()
            
            if (watchSets.length === 0) {
                logger.warn('No valid watch sets found in configuration')
                return
            }
            
            for (const watchSet of watchSets) {
                await this.startWatchSet(watchSet)
            }
            
            logger.info(`File watcher started successfully with ${watchSets.length} watch sets`)
        } catch (error) {
            logger.error('Failed to start file watcher:', error.message)
            process.exit(1)
        }
    }

    async startWatchSet(watchSet) {
        logger.info(`Setting up watch set: ${watchSet.name}`)
        
        for (const dir of watchSet.dirs) {
            try {
                await this.watchRecursively(dir, watchSet)
                logger.debug(`Watching directory: ${dir}`)
            } catch (error) {
                logger.error(`Failed to watch directory ${dir}:`, error.message)
            }
        }
    }

    async watchRecursively(dir, watchSet) {
        if (this.shouldExclude(dir)) {
            return
        }

        try {
            const watcher = fs.watch(dir, { persistent: true }, (eventType, filename) => {
                this.handleFileChange(dir, eventType, filename, watchSet)
            })

            const watcherKey = `${watchSet.name}:${dir}`
            this.watchers.set(watcherKey, watcher)

            // Watch existing subdirectories
            const entries = await fs.promises.readdir(dir, { withFileTypes: true })
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const subDir = path.join(dir, entry.name)
                    await this.watchRecursively(subDir, watchSet)
                }
            }
        } catch (error) {
            logger.warn(`Failed to watch directory ${dir}:`, error.message)
        }
    }

    handleFileChange(dir, eventType, filename, watchSet) {
        if (!filename) return

        const fullPath = path.join(dir, filename)
        
        if (this.shouldExclude(fullPath)) {
            return
        }

        // Create a debounce key for this watch set
        const debounceKey = `${watchSet.name}:${fullPath}`
        clearTimeout(this.debounceTimers.get(debounceKey))

        this.debounceTimers.set(debounceKey, setTimeout(async () => {
            this.debounceTimers.delete(debounceKey)

            try {
                // Check if it's a new directory to watch
                if (eventType === 'rename') {
                    try {
                        const stats = await fs.promises.stat(fullPath)
                        if (stats.isDirectory()) {
                            const watcherKey = `${watchSet.name}:${fullPath}`
                            if (!this.watchers.has(watcherKey)) {
                                await this.watchRecursively(fullPath, watchSet)
                            }
                        }
                    } catch (error) {
                        // File might have been deleted, clean up watchers if needed
                        this.cleanupWatchers(watchSet.name, fullPath)
                    }
                }

                await this.executeAppsForWatchSet(watchSet, dir, {
                    eventType,
                    path: path.relative(dir, fullPath),
                    fullPath,
                    watchDir: dir,
                    timestamp: new Date().toISOString()
                })
            } catch (error) {
                logger.error(`Error handling change for ${fullPath}:`, error.message)
            }
        }, this.debounceMs))
    }

    async executeAppsForWatchSet(watchSet, changedDir, changeInfo) {
        logger.info(`File changed in watch set "${watchSet.name}": ${changeInfo.path}`)
        
        // Execute apps for each directory in the watch set
        for (const watchDir of watchSet.dirs) {
            for (const app of watchSet.apps) {
                try {
                    await this.executeTransApp(app, watchDir)
                } catch (error) {
                    logger.error(`Failed to execute ${app} on ${watchDir}:`, error.message)
                }
            }
        }
    }

    async executeTransApp(appName, targetDir) {
        return new Promise((resolve, reject) => {
            logger.info(`Executing: ${this.transPath} ${appName} ${targetDir}`)
            
            const child = spawn(this.transPath, [appName, targetDir], {
                stdio: 'pipe',
                cwd: path.dirname(this.transPath)
            })
            
            let stdout = ''
            let stderr = ''
            
            child.stdout.on('data', (data) => {
                stdout += data.toString()
            })
            
            child.stderr.on('data', (data) => {
                stderr += data.toString()
            })
            
            child.on('close', (code) => {
                if (code === 0) {
                    logger.info(`✓ ${appName} completed successfully for ${targetDir}`)
                    if (stdout.trim()) {
                        logger.debug(`${appName} output:`, stdout.trim())
                    }
                    resolve(stdout)
                } else {
                    const error = `${appName} failed with exit code ${code}`
                    if (stderr.trim()) {
                        logger.error(`${appName} stderr:`, stderr.trim())
                    }
                    reject(new Error(error))
                }
            })
            
            child.on('error', (error) => {
                logger.error(`Failed to start ${appName}:`, error.message)
                reject(error)
            })
        })
    }

    shouldExclude(filePath) {
        return this.excludePatterns.some(pattern => {
            if (pattern instanceof RegExp) {
                return pattern.test(filePath)
            }
            return filePath.includes(pattern)
        })
    }

    cleanupWatchers(watchSetName, pathPattern) {
        const toDelete = []
        for (const [key, watcher] of this.watchers) {
            if (key.startsWith(`${watchSetName}:`) && key.includes(pathPattern)) {
                try {
                    watcher.close()
                    toDelete.push(key)
                } catch (error) {
                    logger.warn(`Error closing watcher ${key}:`, error.message)
                }
            }
        }
        toDelete.forEach(key => this.watchers.delete(key))
    }

    setupSignalHandlers() {
        const cleanup = () => {
            logger.info('\nShutting down file watcher...')
            this.stop()
            process.exit(0)
        }

        process.on('SIGINT', cleanup)
        process.on('SIGTERM', cleanup)
    }

    stop() {
        logger.info('Closing file watchers...')
        
        for (const [key, watcher] of this.watchers) {
            try {
                watcher.close()
            } catch (error) {
                logger.warn(`Error closing watcher ${key}:`, error.message)
            }
        }
        this.watchers.clear()

        // Clear pending debounce timers
        for (const timer of this.debounceTimers.values()) {
            clearTimeout(timer)
        }
        this.debounceTimers.clear()
    }
}

// CLI interface - only used when running Watch.js directly
function parseArgs() {
    const args = process.argv.slice(2)
    const config = { excludePatterns: [] }
    let configPath = null

    for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        if (arg.startsWith('--config=')) {
            configPath = arg.split('=')[1]
        } else if (arg.startsWith('--debounce=')) {
            config.debounceMs = parseInt(arg.split('=')[1], 10)
        } else if (arg.startsWith('--exclude=')) {
            config.excludePatterns.push(new RegExp(arg.split('=')[1]))
        } else if (arg.startsWith('--trans-path=')) {
            config.transPath = arg.split('=')[1]
        } else if (arg === '--help' || arg === '-h') {
            showHelp()
            process.exit(0)
        }
    }

    return { configPath, config }
}

function showHelp() {
    console.log('Usage: node Watch.js [options]')
    console.log('Options:')
    console.log('  --config=<path>      Path to watch configuration file')
    console.log('  --debounce=<ms>      Debounce delay in milliseconds (default: 1000)')
    console.log('  --exclude=<pattern>  Additional exclude patterns (can be used multiple times)')
    console.log('  --trans-path=<path>  Path to trans executable')
    console.log('  --help, -h           Show this help')
}

// Main execution - only when file is executed directly
async function main() {
    try {
        const { configPath, config } = parseArgs()
        const watcher = new Watch(configPath, config)
        await watcher.start()

        // Keep the process running
        process.stdin.resume()
    } catch (error) {
        logger.error('Fatal error:', error.message)
        process.exit(1)
    }
}

// Only run if this file is executed directly (not when imported)
if (import.meta.url === `file://${fileURLToPath(import.meta.url)}`) {
    main()
}

export default Watch