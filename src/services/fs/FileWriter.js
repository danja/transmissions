import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { mkdir, mkdirSync } from 'node:fs'
import logger from '../../utils/Logger.js'
import SinkService from '../base/SinkService.js'
/**
 * FileWriter class that extends SinkService
 * Write data to a file.
 * 
 * First checks `context.targetFilepath` and if not set, uses the value from `services.ttl` using `configKey` for this service instance.
 * 
 * #### __*Input*__
 * * context.filepath 
 * * context.content
 * #### __*Output*__
 * * as Input
 * 
 * if context.loadContext is set, that is used as a name in the context for the file content
 */
class FileWriter extends SinkService {

    /**
     * Constructs a new FileWriter object.
     * @param {Object} config - The configuration object for the FileWriter.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Executes the write operation.
     * @param {Object} context - The execution context.
     */
    async execute(data, context) {
        //  if (context.done) {
        //    return
        // }
        var filepath = context.filepath
        logger.log(' - 1FileWriter writing filepath : ' + filepath)

        const content = context.content

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

        this.emit('message', data, context)
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
