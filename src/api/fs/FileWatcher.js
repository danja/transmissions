// src/api/fs/FileWatcher.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

class FileWatcher {
    constructor(watchDir, notifyUrl, options = {}) {
        this.watchDir = path.resolve(watchDir)
        this.notifyUrl = notifyUrl
        this.watchers = new Map()
        this.debounceMs = options.debounceMs || 100
        this.debounceTimers = new Map()
        this.excludePatterns = options.excludePatterns || [
            /node_modules/,
            /\.git/,
            /\.DS_Store/,
            /\.swp$/,
            /~$/
        ]

        this.setupSignalHandlers()
    }

    async start() {
        console.log(`Starting file watcher on: ${this.watchDir}`)
        console.log(`Notifications will be sent to: ${this.notifyUrl}`)

        try {
            await this.validateDirectory()
            await this.validateUrl()
            await this.watchRecursively(this.watchDir)
            console.log('File watcher started successfully')
        } catch (error) {
            console.error('Failed to start file watcher:', error.message)
            process.exit(1)
        }
    }

    async validateDirectory() {
        try {
            const stats = await fs.promises.stat(this.watchDir)
            if (!stats.isDirectory()) {
                throw new Error(`Path is not a directory: ${this.watchDir}`)
            }
        } catch (error) {
            throw new Error(`Cannot access directory: ${this.watchDir} - ${error.message}`)
        }
    }

    async validateUrl() {
        try {
            new URL(this.notifyUrl)
        } catch (error) {
            throw new Error(`Invalid URL: ${this.notifyUrl}`)
        }
    }

    async watchRecursively(dir) {
        if (this.shouldExclude(dir)) {
            return
        }

        try {
            const watcher = fs.watch(dir, { persistent: true }, (eventType, filename) => {
                this.handleFileChange(dir, eventType, filename)
            })

            this.watchers.set(dir, watcher)

            // Watch existing subdirectories
            const entries = await fs.promises.readdir(dir, { withFileTypes: true })
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const subDir = path.join(dir, entry.name)
                    await this.watchRecursively(subDir)
                }
            }
        } catch (error) {
            console.warn(`Failed to watch directory ${dir}:`, error.message)
        }
    }

    handleFileChange(dir, eventType, filename) {
        if (!filename) return

        const fullPath = path.join(dir, filename)
        const relativePath = path.relative(this.watchDir, fullPath)

        if (this.shouldExclude(fullPath)) {
            return
        }

        // Debounce rapid changes
        const debounceKey = fullPath
        clearTimeout(this.debounceTimers.get(debounceKey))

        this.debounceTimers.set(debounceKey, setTimeout(async () => {
            this.debounceTimers.delete(debounceKey)

            try {
                // Check if it's a new directory to watch
                if (eventType === 'rename') {
                    try {
                        const stats = await fs.promises.stat(fullPath)
                        if (stats.isDirectory() && !this.watchers.has(fullPath)) {
                            await this.watchRecursively(fullPath)
                        }
                    } catch (error) {
                        // File might have been deleted, clean up watcher if it exists
                        const watcher = this.watchers.get(fullPath)
                        if (watcher) {
                            watcher.close()
                            this.watchers.delete(fullPath)
                        }
                    }
                }

                await this.notifyChange({
                    eventType,
                    path: relativePath,
                    fullPath,
                    timestamp: new Date().toISOString(),
                    watchDir: this.watchDir
                })
            } catch (error) {
                console.error(`Error handling change for ${relativePath}:`, error.message)
            }
        }, this.debounceMs))
    }

    async notifyChange(changeData) {
        const maxRetries = 3
        let retries = 0

        while (retries < maxRetries) {
            try {
                const response = await fetch(this.notifyUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(changeData)
                })

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
                }

                console.log(`✓ Notified change: ${changeData.eventType} ${changeData.path}`)
                return
            } catch (error) {
                retries++
                console.error(`✗ Failed to notify change (attempt ${retries}/${maxRetries}):`, error.message)

                if (retries < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * retries))
                }
            }
        }
    }

    shouldExclude(filePath) {
        return this.excludePatterns.some(pattern => {
            if (pattern instanceof RegExp) {
                return pattern.test(filePath)
            }
            return filePath.includes(pattern)
        })
    }

    setupSignalHandlers() {
        const cleanup = () => {
            console.log('\nShutting down file watcher...')
            this.stop()
            process.exit(0)
        }

        process.on('SIGINT', cleanup)
        process.on('SIGTERM', cleanup)
    }

    stop() {
        console.log('Closing file watchers...')
        for (const [dir, watcher] of this.watchers) {
            try {
                watcher.close()
            } catch (error) {
                console.warn(`Error closing watcher for ${dir}:`, error.message)
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

// CLI interface
function parseArgs() {
    const args = process.argv.slice(2)

    if (args.length < 2) {
        console.error('Usage: node Watch.js <directory> <notification-url> [options]')
        console.error('Example: node Watch.js ./src http://localhost:3000/api/file-changes')
        console.error('\nOptions:')
        console.error('  --debounce=<ms>  Debounce delay in milliseconds (default: 100)')
        console.error('  --exclude=<pattern>  Additional exclude patterns (can be used multiple times)')
        process.exit(1)
    }

    const [directory, url, ...options] = args
    const config = { excludePatterns: [] }

    for (const option of options) {
        if (option.startsWith('--debounce=')) {
            config.debounceMs = parseInt(option.split('=')[1], 10)
        } else if (option.startsWith('--exclude=')) {
            config.excludePatterns.push(new RegExp(option.split('=')[1]))
        }
    }

    return { directory, url, config }
}

// Main execution
async function main() {
    try {
        const { directory, url, config } = parseArgs()
        const watcher = new FileWatcher(directory, url, config)
        await watcher.start()

        // Keep the process running
        process.stdin.resume()
    } catch (error) {
        console.error('Fatal error:', error.message)
        process.exit(1)
    }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${fileURLToPath(import.meta.url)}`) {
    main()
}

export default FileWatcher