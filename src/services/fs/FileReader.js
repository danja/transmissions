import { readFile } from 'node:fs/promises'
import logger from '../../utils/Logger.js'
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
            filepath = this.getMyConfig().value // services.ttl
        }
        logger.log(' - FileReader reading filepath : ' + filepath)
        const f = message.rootDir + '/' + filepath
        //logger.log('####in Filereader f = ' + f)
        try {
            //   logger.log('####in Filereader ' + message.sourceFile)
            message.content = (await readFile(f)).toString()
            //  logger.log('####in Filereader message.content = ' + message.content)
            /*
            if (message.loadContext) { // get rid?
                message[message.loadContext] = content
            }
            */
            this.emit('message', message)
        } catch (err) {
            logger.error("FileReader.execute error : " + err.message)
        }
    }
}

export default FileReader