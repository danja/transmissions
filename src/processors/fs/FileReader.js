import { readFile } from 'node:fs/promises'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import SourceProcessor from '../base/SourceProcessor.js'

/**
 * FileReader class that extends SourceProcessor.
 * Reads the content of a file and emits a 'message' event with the content and message.
 * #### __*Input*__
 * **message.filepath** 
 * #### __*Output*__
 * **message.content**
 * 
 * if message.loadContext is set, that is used as a name in the message for the file content
 */
class FileReader extends SourceProcessor {

    /**
     * Constructs a new FileReader instance.
     * @param {Object} config - The configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Reads the content of a file and emits a 'message' event with the content and message.
     * @param {string} filepath - The name of the file to read.
     * @param {Object} message - The message object.
     */
    async process(message) {
        var filepath = message.filepath

        if (!filepath) {
            filepath = this.getPropertyFromMyConfig(ns.trm.sourceFile)
            logger.debug(' - filepath from config : ' + filepath)
        }
        logger.debug(' - FileReader, process.cwd() : ' + process.cwd())

        var f = path.join(message.dataDir, filepath)

        logger.log(' - FileReader reading filepath : ' + f)

        const mediaType = this.getPropertyFromMyConfig(ns.trm.mediaType)


        logger.debug('FileReader, mediaType = ' + mediaType)

        const content = (await readFile(f)).toString()
        logger.debug('FileReader, content = ' + content)

        // TODO shift to a method/util
        if (mediaType === 'application/json') {
            message.content = JSON.parse(content)
        } else {
            message.content = content
        }
        return this.emit('message', message)
    }
}

export default FileReader