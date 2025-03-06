import { readdir } from 'fs/promises'
import path from 'path'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import SysUtils from '../../utils/SysUtils.js'
import Processor from '../../model/Processor.js'
import StringUtils from '../../utils/StringUtils.js'

class DirWalker extends Processor {
    constructor(config) {
        super(config)
        this.count = 0
    }

    async process(message) {
        logger.trace('\nDirWalker.process')
        logger.trace(`\nDirWalker.process, this = ${this}`)
        message.done = false

        var sourceDir = this.getProperty(ns.trn.sourceDir)
        logger.trace(`--------------- DirWalker sourceDir from config = ${sourceDir}`)

        if (!message.sourceDir) {
            message.sourceDir = sourceDir
        }

        if (!sourceDir) {
            sourceDir = message.dataDir
        }

        this.includePatterns = this.getProperty(ns.trn.includePattern, ['*.md', '*.js', '*.json', '*.ttl'])
        this.excludePatterns = this.getProperty(ns.trn.excludePattern, ['*.', '.git', 'node_modules'])

        logger.trace('\n\nDirWalker, message.targetPath = ' + message.targetPath)
        logger.trace('DirWalker, message.rootDir = ' + message.rootDir)
        logger.trace('DirWalker, message.sourceDir = ' + message.sourceDir)

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
        logger.trace(`DirWalker resolved dirPath = ${dirPath}`)

        await this.walkDirectory(dirPath, message)

        //   const finalMessage = structuredClone(message)
        const finalMessage = SysUtils.copyMessage(message)
        finalMessage.done = true
        finalMessage.count = this.count
        logger.trace("DirWalker emitting final done=true message")
        return this.emit('message', finalMessage)
    }

    // move to util.js ?
    // const markdownFiles = files.filter(file => matchesPattern(file, '*.md'));

    matchPatterns(str, patterns) {
        return StringUtils.matchPatterns(str, patterns)

        /*
        const matches = patterns.filter(pattern => this.matchesPattern(str, pattern))
        if (matches.length > 0) {
            return matches
        }
        return false
   */
    }
    /*
        matchesPattern(str, pattern) {
            return StringUtils.matchesPattern(str, pattern)

            // Convert glob pattern to regex
            const regexPattern = pattern
                .replace(/\./g, '\\.')   // Escape dots
    */
    //       .replace(/\*/g, '.*')   // Convert * to .*
    //    const regex = new RegExp(`^${regexPattern}$`)
    //  return regex.test(str)
    //}


    async walkDirectory(dir, baseMessage) {
        logger.trace(`DirWalker.walkDirectory, dir = ${dir}`)
        //   logger.reveal(this.message)
        const entries = await readdir(dir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            const targetPath = super.getProperty(ns.trn.targetPath, this.message.dataDir)
            //   if (entry.isDirectory() && !this.excludePatterns.includes(entry.name[0])) {

            // should be dir? what about added includes?
            if (entry.isDirectory() && !this.matchPatterns(fullPath, this.excludePatterns)) {
                await this.walkDirectory(fullPath, baseMessage)
            } else if (entry.isFile()) {

                if (!this.matchPatterns(fullPath, this.excludePatterns) &&
                    this.matchPatterns(fullPath, this.includePatterns)) {

                    //     const message = structuredClone(baseMessage)
                    const message = SysUtils.copyMessage(baseMessage)
                    message.filename = entry.name
                    message.subdir = path.dirname(path.relative(targetPath, fullPath)).split(path.sep)[1]
                    //     message.subdir = path.dirname(path.relative(message.targetPath, fullPath)).split(path.sep)[1]
                    message.fullPath = fullPath
                    message.filepath = path.relative(baseMessage.targetPath || baseMessage.rootDir, fullPath)
                    message.done = false
                    message.count = this.count++

                    message.slug = message.filename.split('.')[0]

                    logger.trace(`DirWalker emitting :
                        message.targetPath: ${message.targetPath}
                        message.filename: ${message.filename}
                        message.fullPath: ${message.fullPath}
                        message.subdir: ${message.subdir}
                        message.filepath: ${message.filepath}
                        message.slugs: ${message.slugs}`)
                    //        process.exit()

                    logger.trace(` - DirWalker emit ${this.count++} : ${message.fullPath}`)
                    this.emit('message', message)
                }
            }
        }
    }
}

export default DirWalker