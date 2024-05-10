import { readFile } from 'node:fs/promises'
import logger from '../../utils/Logger.js'
import SourceService from '../base/SourceService.js'

/**
 * FileReader class that extends SourceService.
 * Reads the content of a file and emits a 'message' event with the content and context.
 * #### __*Input*__
 * **context.filepath** 
 * #### __*Output*__
 * **context.content**
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
     * @param {string} filepath - The name of the file to read.
     * @param {Object} context - The context object.
     */
    async execute(data, context) {

        var filepath = context.filepath

        if (!filepath) {
            filepath = this.getMyConfig().value // services.ttl
        }
        logger.log(' - FileReader reading filepath : ' + filepath)
        const f = context.rootDir + '/' + filepath
        //logger.log('####in Filereader f = ' + f)
        try {
            //   logger.log('####in Filereader ' + context.sourceFile)
            context.content = (await readFile(f)).toString()
            //  logger.log('####in Filereader context.content = ' + context.content)
            /*
            if (context.loadContext) { // get rid?
                context[context.loadContext] = content
            }
            */
            this.emit('message', false, context)
        } catch (err) {
            logger.error("FileReader.execute error : " + err.message)
        }
    }
}

export default FileReader