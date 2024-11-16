import path from 'path'
import ns from '../../utils/ns.js'
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { mkdir, mkdirSync } from 'node:fs'
import logger from '../../utils/Logger.js'
import SinkProcessor from '../base/SinkProcessor.js'
/**
 * FileWriter class that extends SinkProcessor
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
class FileWriter extends SinkProcessor {

    /**
     * Constructs a new FileWriter object.
     * @param {Object} config - The configuration object for the FileWriter.
     */
    constructor(config) {
        super(config)
    }

    getInputKeys() { // TODO move out of here
        return ['filepath, content']
    }
    /**
     * Executes the write operation.
     * @param {Object} message - The execution message.
     */
    async process(message) {
        logger.setLogLevel('info')
        this.preProcess()

        if (message.dump) {
            // TODO make optional (on done?) - is a pain for multi
            //    const filename = `message_${new Date().toISOString()}.json`

            const filename = 'message.json'
            const f = path.join(message.dataDir, filename)
            const content = JSON.stringify(message)
            return this.doWrite(f, content, message)
        }

        logger.debug("Filewriter, message.filepath = " + message.filepath)

        var filepath = message.filepath


        if (!filepath) {
            filepath = this.getPropertyFromMyConfig(ns.trm.destinationFile)
            logger.log(' - filepath from config : ' + filepath)
        }

        var f
        if (filepath.startsWith('/')) { // TODO unhackify
            f = filepath
        } else {
            f = path.join(message.dataDir, filepath)
        }
        const dirName = dirname(f)
        logger.debug("Filewriter, dirName = " + dirName)

        var contentPath = this.getPropertyFromMyConfig(ns.trm.contentPath)

        if (typeof contentPath === 'undefined' || contentPath === 'undefined' || contentPath.value === 'undefined') {
            contentPath = 'content'
        }

        // logger.debug("Filewriter, contentPath = " + contentPath)
        var content = message[contentPath.toString()] // TODO generalise.it
        if (typeof content === 'object') {
            content = JSON.stringify(content)
        }

        logger.debug("Filewriter, content = " + content)
        logger.debug("Filewriter, typeof content = " + typeof content)


        this.mkdirs(dirName) // sync - see below

        return await this.doWrite(f, content, message)
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
