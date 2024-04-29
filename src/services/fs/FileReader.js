import { readFile } from 'node:fs/promises'
import logger from '../../utils/Logger.js'
import SourceService from '../base/SourceService.js'

/**
 * FileReader class that extends SourceService.
 * Reads the content of a file and emits a 'message' event with the content and context.
 * #### __*Input*__
 * * **data** : filename
 * * **context** : sourceFile (if data is not provided)
 * #### __*Output*__
 * * **data** : file content
 * * **context** : as Input
 * 
 * if context.loadContext is set, that is used as a name in the context for the file content
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
     * Reads the content of a file and emits a 'message' event with the content and context.
     * @param {string} filename - The name of the file to read.
     * @param {Object} context - The context object.
     */
    async execute(filename, context) {
        if (!filename) {
            filename = context.filename
        }
        if (!filename) {
            filename = this.locateConfig().value
        }
        logger.log('\nFileReader reading : ' + filename)
        const f = filename
        try {
            //   logger.log('####in Filereader ' + context.sourceFile)
            const content = await readFile(f)

            if (context.loadContext) { // get rid?
                context[context.loadContext] = content
            }
            this.emit('message', content, context)
        } catch (err) {
            logger.error("FileReader.execute error : " + err.message)
        }
    }
}

export default FileReader