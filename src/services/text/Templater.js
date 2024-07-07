import ProcessService from '../base/ProcessService.js'
import nunjucks from 'nunjucks'
import logger from '../../utils/Logger.js'

/**
 * A class that provides templating functionality using Nunjucks.
 * @extends ProcessService
 * #### __*Input*__
 * * context.templateFilename or if not present,
 * * context.template
 * * context.contentBlocks - {title, body...} or whatever
 * #### __*Output*__
 * * context.content - the templated content
 * 
 */
class Templater extends ProcessService {
    /**
     * Create a new instance of the Templater class.
     * @param {object} config - The configuration object for the Templater.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Executes the templating process.
     * @param {object} data - The data object to be used for templating.
     * @param {object} context - The context object containing template information.
     */
    async execute(context) {

        if (context.templateFilename) { // if there's a filename, use it
            //    logger.log('*************************************************************')
            //    logger.log('context.templateFilename = ' + context.templateFilename)
            //    logger.log('context.contentBlocks = ')
            //    logger.reveal(context.contentBlocks)
            //    logger.log('*************************************************************')

            /* workaround for nunjucks odd/buggy/ugly handling of '' path 
              at createTemplate (/home/danny/HKMS/transmissions/node_modules/nunjucks/src/environment.js:234:15)

                   if (!info && !err && !ignoreMissing) {

                    TODO read about nunjucks.configure, especially ignoreMissing
            */
            const path = context.templateFilename.substr(0, context.templateFilename.lastIndexOf("/"))
            const filename = context.templateFilename.substr(context.templateFilename.lastIndexOf("/") + 1)

            //    logger.log('path  = ' + path)
            //  logger.log(' filename = ' + filename)
            nunjucks.configure(path, { autoescape: false })

            context.content = nunjucks.render(filename, context.contentBlocks)
            //    logger.log('*************************************************************')
            //    logger.log('context.content = ' + context.content)
            //    logger.log('*************************************************************')
        } else {
            nunjucks.configure({ autoescape: false }); // otherwise use a string
            context.content = nunjucks.renderString(context.template, context.contentBlocks)
        }
        this.emit('message', context)
    }
}

export default Templater