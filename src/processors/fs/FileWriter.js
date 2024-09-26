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
    async execute(message) {
        this.preProcess()
        var filepath = message.filepath

        const content = message.content

        //  if (!filepath) {
        //    filepath = this.getMyConfig().value
        // }
        logger.debug("Filewriter.targetFile = " + filepath)

        const dirName = dirname(filepath)
        try {
            await this.mkdirs(dirName) // is this OK when the dirs ???
            logger.log(' - FileWriter writing : ' + filepath)
            await writeFile(filepath, content)

        } catch (err) {
            logger.error("FileWriter.execute error : " + err.message)
        }

        this.emit('message', message)
    }

    async mkdirs(dir) {
        if (!dir) return;
        try {
            mkdir(dir, { recursive: true }, (error) => { })
        } catch (error) {
            console.error(error);
        }
    }
}

export default FileWriter
