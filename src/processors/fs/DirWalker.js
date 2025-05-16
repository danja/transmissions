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

        // typically relative
        var walkDir = this.getProperty(ns.trn.sourceDir, this.app.path)
        logger.debug(`    walkDir = ${walkDir}`)

        logger.debug(`    message.targetDir = ${message.targetDir}`)
        // Prefer message.targetDir if present, else use config
        if (message.targetDir) {
            walkDir = path.join(message.targetDir, walkDir)
        } else {
            if (!path.isAbsolute(walkDir)) {
                walkDir = path.join(this.app.path, walkDir)
            }
        }

        logger.debug(`DirWalker resolved walkDir = ${walkDir}`)

        this.includePatterns =
            this.getProperty(ns.trn.includePattern, ['*.md', '*.js', '*.json', '*.ttl'])
        this.excludePatterns =
            this.getProperty(ns.trn.excludePattern, ['*.', '.git', 'node_modules'])

        await this.walkDirectory(walkDir, message)

        const finalMessage = SysUtils.copyMessage(message)
        finalMessage.done = true
        finalMessage.count = this.count
        logger.trace("DirWalker emitting final done=true message")
        return this.emit('message', finalMessage)
    }

    matchPatterns(str, patterns) {
        return StringUtils.matchPatterns(str, patterns)
    }

    async walkDirectory(dir, baseMessage) {
        logger.trace(`DirWalker.walkDirectory, dir = ${dir}`)
        const entries = await readdir(dir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)

            //   logger.log(`APP = ${this.app}`)
            const targetPath = super.getProperty(ns.trn.targetPath, this.app.path)

            if (entry.isDirectory() && !this.matchPatterns(fullPath, this.excludePatterns)) {
                await this.walkDirectory(fullPath, baseMessage)
            } else if (entry.isFile()) {
                if (!this.matchPatterns(fullPath, this.excludePatterns) &&
                    this.matchPatterns(fullPath, this.includePatterns)) {

                    const message = SysUtils.copyMessage(baseMessage)
                    message.filename = entry.name
                    let relTargetPath = Array.isArray(targetPath) ? targetPath[0] : targetPath
                    if (typeof relTargetPath !== 'string' || !relTargetPath) relTargetPath = ''
                    message.subdir = path.dirname(path.relative(relTargetPath, fullPath)).split(path.sep)[1]
                    message.fullPath = fullPath
                    message.filepath = path.relative(relTargetPath, fullPath)
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

                    logger.trace(` - DirWalker emit ${this.count++} : ${message.fullPath}`)
                    this.emit('message', message)
                }
            }
        }
    }
}

export default DirWalker