import { readFile } from 'node:fs/promises'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import SourceService from '../base/SourceService.js'

/**
 * FileReader class that extends SourceService.
 * Reads the content of a file and emits a 'message' event with the content and message.
 * #### __*Input*__
 * **message.filepath** 
 * #### __*Output*__
 * **message.content**
 * 
 * if message.loadContext is set, that is used as a name in the message for the file content
 */
class FileReader extends SourceService {

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
    async execute(message) {
        this.preProcess(message)
        //    logger.reveal(message)
        var filepath = message.filepath

        if (!filepath) {
            logger.debug(`FileReader: using configKey ${this.configKey.value}`)
            filepath = this.getPropertyFromMyConfig(ns.trm.messageFile)

            //filepath = this.getMyConfig().value // services.ttl
            logger.log(' - filepath from config : ' + filepath)
        }
        logger.log(' - FileReader reading filepath : ' + filepath)

        // TODO move this into run.js
        var f = path.join(message.dataDir, filepath)
        if (message.rootDir) {
            f = path.join(message.rootDir, filepath)
        }

        const mediaType = this.getPropertyFromMyConfig(ns.trm.mediaType)
        logger.debug('in FileReader, mediaType = ' + mediaType)


        try {
            message.content = (await readFile(f)).toString()
            // TODO shift to a method/util
            if (mediaType === 'application/json') {
                message.fromfile = JSON.parse(message.content)
            }
            this.emit('message', message)
        } catch (err) {
            logger.error("FileReader.execute error : " + err.message)
        }
    }
}

export default FileReader