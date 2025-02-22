import path from 'path'
import { access, constants } from 'node:fs'
import ns from '../../utils/ns.js'
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { mkdir, mkdirSync } from 'node:fs'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'
/**
 * FileWriter class that extends Processor
 * Write data to a file.
 *
 * First checks `message.targetFilepath` and if not set, uses the value from `processors.ttl` using `settings` for this processor instance.
 *
 * #### __*Input*__
 * * message.filepath
 * * message.content
 * #### __*Output*__
 * * as Input
 *
 * if message.loadContext is set, that is used as a name in the message for the file content
 */
class FileWriter extends Processor {

    /**
     * Constructs a new FileWriter object.
     * @param {Object} config - The configuration object for the FileWriter.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Executes the write operation.
     * @param {Object} message - The execution message.
     */
    async process(message) {
        //   logger.setLogLevel('debug')
        logger.debug(`\n\nFileWriter.process, message.done = ${message.done}`)
        logger.debug(`FileWriter.process, count = ${message.eachCount}`)
        if (message.done) { // TODO fix this bloody thing
            //   message.done = false
            logger.debug(`\n\nFileWriter.process, message.done = ${message.done} SKIPPING!!`)
            return
            // this.emit('message', message)
        }

        if (message.dump) {
            // TODO make optional (on done?) - is a pain for multi
            //    const filename = `message_${new Date().toISOString()}.json`
            const filename = 'message.json'
            const f = path.join(message.dataDir, filename)
            const content = JSON.stringify(message)
            // Check if the file is readable.
            access(f, constants.W_OK, (err) => {
                if (err) {
                    logger.error(`FileWriter error : ${f} is not writable.`)
                    logger.reveal(message)
                }
            })
            return this.doWrite(f, content, message)
        }

        // logger.debug("Filewriter, message.filepath = " + message.filepath)

        var filePath = await this.getProperty(ns.trn.destinationFile)
        if (!filePath) {
            filePath = await this.getProperty(ns.trn.dataDir)
        }

        logger.debug(`filePath = ${filePath}`)
        // Resolve relative to targetPath or rootDir

        if (!path.isAbsolute(filePath)) {
            //     filePath = path.join(message.targetPath || message.rootDir, filePath)
            filePath = path.join(message.targetPath || message.dataDir, filePath)
        }

        logger.debug(`Filewriter, filepath = ${filePath}`)
        const dirName = dirname(filePath)
        logger.debug("Filewriter, dirName = " + dirName)

        /*
                var contentPath = this.getPropertyFromMyConfig(ns.trn.contentPath)

                if (typeof contentPath === 'undefined' || contentPath === 'undefined' || contentPath.value === 'undefined') {
                    contentPath = 'content'
                }

                // logger.debug("Filewriter, contentPath = " + contentPath)
                var content = message[contentPath.toString()] // TODO generalise.it
                if (typeof content === 'object') {
                    content = JSON.stringify(content)
                }
        */
        var content = message.content // TODO generalise, see above
        //   logger.debug("Filewriter, content = " + content)
        // logger.debug("Filewriter, typeof content = " + typeof content)
        logger.debug(`CCCCCCCC`)
        this.mkdirs(dirName) // sync - see below
        logger.debug(`DDDDDDDDDDD`)
        return await this.doWrite(filePath, content, message)
    }

    async doWrite(f, content, message) {
        logger.debug(`FileWriter.doWrite, file = ${f}`)
        logger.debug(`typeof content = ${typeof content}`)
        if (typeof content != 'string') {
            content = JSON.stringify(content)
        }
        logger.log(' - FileWriter writing : ' + f)
        await writeFile(f, content)
        logger.debug(' - FileWriter written : ' + f)
        return this.emit('message', message)
    }

    mkdirs(dir) {
        logger.debug(`FileWriter.mkdirs, dir = ${dir}`)
        try {
            logger.debug(`AAAAAAAA`)
            mkdirSync(dir, { recursive: true })
            logger.debug(`BBBBBBBBBBBBB`)
        }
        catch (e) {
            logger.warn(`Warn: FileWriter.mkdirs, maybe dir exists : ${dir} ?`)
        }


        /*
        mkdirSync(dir, { recursive: true }, (error) => {
            logger.warn(`Warn: FileWriter.mkdirs, maybe dir exists : ${dir} ?`)
        })
*/
    }
}

export default FileWriter
