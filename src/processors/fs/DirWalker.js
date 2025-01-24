import { readdir } from 'fs/promises'
import path from 'path'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'
import StringUtils from '../../utils/StringUtils.js'

class DirWalker extends Processor {
    constructor(config) {
        super(config)
        //    this.includePatterns = ['.md']
        //  this.excludePrefixes = ['_', '.']
        this.fileCount = 0
    }

    async process(message) {
        //   logger.setLogLevel('debug')
        logger.debug('\nDirWalker.process')
        logger.debug(`\nDirWalker.process, this = ${this}`)
        message.counter = 0
        message.slugs = []
        message.done = false

        var sourceDir = this.getProperty(ns.trn.sourceDir)
        logger.debug(`DirWalker sourceDir from config = ${sourceDir}`)
        if (!message.sourceDir) {
            message.sourceDir = sourceDir
        }

        if (!sourceDir) {
            sourceDir = message.dataDir
        }


        this.includePatterns = this.getProperty(ns.trn.includePattern, ['*.md', '*.js', '*.json', '*.ttl'])
        this.excludePatterns = this.getProperty(ns.trn.excludePattern, ['*.', '.git', 'node_modules'])



        logger.debug('\n\nDirWalker, message.targetPath = ' + message.targetPath)
        logger.debug('DirWalker, message.rootDir = ' + message.rootDir)
        logger.debug('DirWalker, message.sourceDir = ' + message.sourceDir)

        //    logger.log(`DirWalker.sourceDir = ${sourceDir}`)
        //  logger.reveal(sourceDir)
        let dirPath
        if (path.isAbsolute(sourceDir)) {
            dirPath = sourceDir
        } else {
            if (message.targetPath) {
                dirPath = path.join(message.targetPath, sourceDir)
            } else {
                dirPath = path.join(message.rootDir, sourceDir)
            }
        }
        logger.debug(`DirWalker resolved dirPath = ${dirPath}`)

        await this.walkDirectory(dirPath, message)

        const finalMessage = structuredClone(message)
        finalMessage.done = true
        logger.debug("DirWalker emitting final done=true message")
        return this.emit('message', finalMessage)
    }

    // move to util.js ?
    // const markdownFiles = files.filter(file => matchesPattern(file, '*.md'));

    matchPatterns(str, patterns) {
        return StringUtils.matchPatterns(str, patterns)

        const matches = patterns.filter(pattern => this.matchesPattern(str, pattern))
        if (matches.length > 0) {
            return matches
        }
        return false
    }

    matchesPattern(str, pattern) {
        return StringUtils.matchesPattern(str, pattern)

        // Convert glob pattern to regex
        const regexPattern = pattern
            .replace(/\./g, '\\.')   // Escape dots
            .replace(/\*/g, '.*')   // Convert * to .*
        const regex = new RegExp(`^${regexPattern}$`)
        return regex.test(str)
    }

    async walkDirectory(dir, baseMessage) {
        logger.debug(`DirWalker.walkDirectory, dir = ${dir}`)
        //   logger.reveal(this.message)
        const entries = await readdir(dir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)

            //   if (entry.isDirectory() && !this.excludePatterns.includes(entry.name[0])) {

            // should be dir? what about added includes?
            if (entry.isDirectory() && !this.matchPatterns(fullPath, this.excludePatterns)) {
                await this.walkDirectory(fullPath, baseMessage)
            } else if (entry.isFile()) {
                //   const extension = path.extname(entry.name)
                // const prefix = entry.name[0]

                if (!this.matchPatterns(fullPath, this.excludePatterns) &&
                    this.matchPatterns(fullPath, this.includePatterns)) {

                    //   if (!this.excludePatterns.includes(prefix) &&
                    //     this.includePatterns.includes(extension)) {
                    const message = structuredClone(baseMessage)
                    message.filename = entry.name
                    message.subdir = path.dirname(path.relative(message.targetPath, fullPath)).split(path.sep)[1]
                    message.fullPath = fullPath
                    message.filepath = path.relative(baseMessage.targetPath || baseMessage.rootDir, fullPath)
                    message.done = false
                    message.counter++

                    const slug = message.filename.split('.')[0]
                    message.slugs.push(slug)

                    logger.debug(`DirWalker emitting :
                        message.targetPath: ${message.targetPath}
                        message.filename: ${message.filename}
                        message.fullPath: ${message.fullPath}
                        message.subdir: ${message.subdir}
                        message.filepath: ${message.filepath}
                        message.slugs: ${message.slugs}`)
                    //        process.exit()
                    message.fileCount++
                    this.emit('message', message)
                }
            }
        }
    }
}

export default DirWalker