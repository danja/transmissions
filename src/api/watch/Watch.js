// src/api/watch/Watch.js
import fs from 'fs'
import os from 'os'
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
        this.setupWatchLogger()
        this.setupSignalHandlers()
    }

    setupWatchLogger() {
        // Set up dedicated watch logger that logs to logs/watch.log
        const logsDir = path.resolve('logs')
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true })
        }
        
        this.watchLogFile = path.join(logsDir, 'watch.log')
        
        // Create a custom logger method for watch-specific logging
        this.logWatch = (message, level = 'info') => {
            const timestamp = new Date().toISOString()
            const logMessage = `[${timestamp}] [WATCH] [${level.toUpperCase()}] ${message}`
            
            // Log to console via standard logger
            logger[level](message)
            
            // Also log to dedicated watch log file
            try {
                fs.appendFileSync(this.watchLogFile, logMessage + '\n', 'utf8')
            } catch (error) {
                logger.error(`Failed to write to watch log file: ${error.message}`)
            }
        }
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
        
        this.logWatch('Trans executable not found, using "./trans" as fallback', 'warn')
        return './trans'
    }

    async start() {
        this.logWatch('Starting Transmissions file watcher...')
        
        try {
            await this.watchConfig.load()
            const watchSets = this.watchConfig.getWatchSets()
            
            if (watchSets.length === 0) {
                this.logWatch('No valid watch sets found in configuration', 'warn')
                return
            }
            
            for (const watchSet of watchSets) {
                await this.startWatchSet(watchSet)
            }
            
            this.logWatch(`File watcher started successfully with ${watchSets.length} watch sets`)
        } catch (error) {
            this.logWatch(`Failed to start file watcher: ${error.message}`, 'error')
            process.exit(1)
        }
    }

    async startWatchSet(watchSet) {
        this.logWatch(`Setting up watch set: ${watchSet.name}`)
        
        for (const dir of watchSet.dirs) {
            try {
                await this.watchRecursively(dir, watchSet)
                this.logWatch(`Watching directory: ${dir}`, 'debug')
            } catch (error) {
                this.logWatch(`Failed to watch directory ${dir}: ${error.message}`, 'error')
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
            this.logWatch(`Failed to watch directory ${dir}: ${error.message}`, 'warn')
        }
    }

    handleFileChange(dir, eventType, filename, watchSet) {
        if (!filename) return

        const fullPath = path.join(dir, filename)
        
        if (this.shouldExclude(fullPath)) {
            return
        }

        // Check if this event type should be watched for this watch set
        if (watchSet.watchEvents && !watchSet.watchEvents.includes(eventType)) {
            this.logWatch(`Skipping event type "${eventType}" for watch set "${watchSet.name}" (not in watchEvents: ${watchSet.watchEvents.join(', ')})`)
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
                    filename: path.relative(dir, fullPath),
                    sourcePath: fullPath,  // Renamed from fullPath to avoid PathResolver conflict
                    watchDir: dir,
                    timestamp: new Date().toISOString()
                })
            } catch (error) {
                this.logWatch(`Error handling change for ${fullPath}: ${error.message}`, 'error')
            }
        }, this.debounceMs))
    }

    async executeAppsForWatchSet(watchSet, changedDir, changeInfo) {
        this.logWatch(`File changed in watch set "${watchSet.name}": ${changeInfo.path}`)
        
        // Execute apps for each directory in the watch set
        for (const watchDir of watchSet.dirs) {
            for (const app of watchSet.apps) {
                try {
                    await this.executeTransApp(app, watchDir, changeInfo)
                } catch (error) {
                    const appName = app.trim().split(/\s+/)[0]
                    this.logWatch(`Failed to execute ${appName} on ${watchDir}: ${error.message}`, 'error')
                }
            }
        }
    }

    async executeTransApp(appEntry, targetDir, changeInfo = null) {
        return new Promise((resolve, reject) => {
            // Parse app entry to extract app name and any arguments
            const appParts = appEntry.trim().split(/\s+/)
            const appName = appParts[0]
            const configArgs = appParts.slice(1) // Arguments from config
            
            // Prepare command arguments
            const args = [appName]
            
            if (configArgs.length > 0) {
                // Config provides arguments - for these, add change info first, then config args
                if (changeInfo) {
                    args.push('-m', JSON.stringify(changeInfo))
                }
                // Expand tilde paths in arguments
                const expandedArgs = configArgs.map(arg => {
                    if (arg.startsWith('~/')) {
                        return path.join(os.homedir(), arg.slice(2))
                    }
                    return arg
                })
                args.push(...expandedArgs)
                this.logWatch(`Executing with message and config args: ${this.transPath} ${args.join(' ')}`)
            } else {
                // Use default behavior: add change info and target directory
                if (changeInfo) {
                    args.push('-m', JSON.stringify(changeInfo))
                }
                args.push(targetDir)
                this.logWatch(`Executing: ${this.transPath} ${args.join(' ')}`)
            }
            
            const child = spawn(this.transPath, args, {
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
                    const targetInfo = configArgs.length > 0 ? `with args [${configArgs.join(' ')}]` : `for ${targetDir}`
                    this.logWatch(`✓ ${appName} completed successfully ${targetInfo}`)
                    if (stdout.trim()) {
                        this.logWatch(`${appName} output: ${stdout.trim()}`, 'debug')
                    }
                    resolve(stdout)
                } else {
                    const error = `${appName} failed with exit code ${code}`
                    if (stderr.trim()) {
                        this.logWatch(`${appName} stderr: ${stderr.trim()}`, 'error')
                    }
                    reject(new Error(error))
                }
            })
            
            child.on('error', (error) => {
                this.logWatch(`Failed to start ${appName}: ${error.message}`, 'error')
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
                    this.logWatch(`Error closing watcher ${key}: ${error.message}`, 'warn')
                }
            }
        }
        toDelete.forEach(key => this.watchers.delete(key))
    }

    setupSignalHandlers() {
        const cleanup = () => {
            this.logWatch('\nShutting down file watcher...')
            this.stop()
            process.exit(0)
        }

        process.on('SIGINT', cleanup)
        process.on('SIGTERM', cleanup)
    }

    stop() {
        this.logWatch('Closing file watchers...')
        
        for (const [key, watcher] of this.watchers) {
            try {
                watcher.close()
            } catch (error) {
                this.logWatch(`Error closing watcher ${key}: ${error.message}`, 'warn')
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
        console.error('Fatal error:', error.message)
        process.exit(1)
    }
}

// Only run if this file is executed directly (not when imported or during tests)
if (import.meta.url === `file://${process.argv[1]}` && process.env.NODE_ENV !== 'test') {
    main()
}

export default Watch