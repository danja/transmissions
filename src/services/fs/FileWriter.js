import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { mkdir, mkdirSync } from 'node:fs'
import logger from '../../utils/Logger.js'
import SinkService from '../base/SinkService.js'
/**
 * FileWriter class that extends SinkService
 * Write data to a file.
 * 
 * First checks `context.targetFilename` and if not set, uses the value from `services.ttl` using `configKey` for this service instance.
 * 
 * #### __*Input*__
 * * context.filename 
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
        var filename = context.filename


        const content = context.content

        if (!filename) {
            filename = this.locateConfig().value
        }
        logger.debug("Filewriter.targetFile = " + filename)

        const dirName = dirname(filename)
        try {
            await this.mkdirs(dirName) // is this OK when the dirs ???
            await writeFile(filename, content)

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
