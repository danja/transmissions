import { writeFile } from 'node:fs/promises'
import logger from '../../utils/Logger.js'
import SinkService from '../base/SinkService.js'
/**
 * FileWriter class that extends SinkService
 * Write data to a file.
 * 
 * First checks `context.targetFilename` and if not set, uses the value from `services.ttl` using `configKey` for this service instance.
 * 
 * #### __*Input*__
 * * **data** : string content to be written to the file 
 * * **context** : may contain `targetFilename`
 * #### __*Output*__
 * * **data** : as Input
 * * **context** : as Input
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
     * @param {string} data - The data to be written to the file.
     * @param {Object} context - The execution context.
     */
    async execute(data, context) {
        var filename = context.targetFilename

        if (!filename) {
            filename = this.locateConfig().value
        }
        logger.debug("Filewriter.targetFile = " + filename)

        const f = filename

        try {
            await writeFile(f, data)

        } catch (err) {
            logger.error("FileWriter.execute error : " + err.message)
        }

        this.emit('message', data, context)
    }
}

export default FileWriter
