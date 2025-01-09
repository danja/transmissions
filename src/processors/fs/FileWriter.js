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
 * First checks `message.targetFilepath` and if not set, uses the value from `processors.ttl` using `configKey` for this processor instance.
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

        logger.debug("Filewriter, message.filepath = " + message.filepath)

        var destinationFile = this.getProperty(ns.trm.destinationFile)
        var filepath = message.filepath
        if (message.subdir) {
            filepath = path.join(message.subdir, filepath)
        }
        //path.join(message.sourceDir, message.filepath)

        //   logger.reveal(filePath)

        if (!destinationFile) { // TODO fix, do other cases, refactor
            var targetDir = message.targetDir ?
                message.targetDir : this.getProperty(ns.trm.targetDir)
            targetDir = targetDir ? targetDir : '.'

            filepath = path.join(targetDir, filepath)
        }
        logger.debug(`Filewriter, 1 filepath = ${filepath}`)
        if (!path.isAbsolute(filepath)) {
            filepath = path.join(message.targetPath, filepath)
        }

        logger.debug(`Filewriter, filepath = ${filepath}`)
        const dirName = dirname(filepath)
        logger.debug("Filewriter, dirName = " + dirName)

        /*
                var contentPath = this.getPropertyFromMyConfig(ns.trm.contentPath)

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
        logger.debug("Filewriter, content = " + content)
        logger.debug("Filewriter, typeof content = " + typeof content)

        this.mkdirs(dirName) // sync - see below

        return await this.doWrite(filepath, content, message)
    }

    async doWrite(f, content, message) {
        logger.log(' - FileWriter writing : ' + f)
        await writeFile(f, content)
        return this.emit('message', message)
    }

    mkdirs(dir) {
        mkdirSync(dir, { recursive: true })
        /*
                mkdir(dir, { recursive: true }, (error) => {
                    logger.log('EEEEEEEEEEEEEEEEEK!' + error)
                })
           */
    }
}

export default FileWriter
