import ProcessService from '../base/ProcessService.js'
import nunjucks from 'nunjucks'
import logger from '../../utils/Logger.js'

/**
 * A class that provides templating functionality using Nunjucks.
 * @extends ProcessService
 * #### __*Input*__
 * * message.templateFilename or if not present,
 * * message.template
 * * message.contentBlocks - {title, body...} or whatever
 * #### __*Output*__
 * * message.content - the templated content
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
     * @param {object} message - The message object containing template information.
     */
    async execute(message) {

        if (message.templateFilename) { // if there's a filename, use it
            //    logger.log('*************************************************************')
            //    logger.log('message.templateFilename = ' + message.templateFilename)
            //    logger.log('message.contentBlocks = ')
            //    logger.reveal(message.contentBlocks)
            //    logger.log('*************************************************************')

            /* workaround for nunjucks odd/buggy/ugly handling of '' path 
              at createTemplate (/home/danny/HKMS/transmissions/node_modules/nunjucks/src/environment.js:234:15)

                   if (!info && !err && !ignoreMissing) {

                    TODO read about nunjucks.configure, especially ignoreMissing
            */
            const path = message.templateFilename.substr(0, message.templateFilename.lastIndexOf("/"))
            const filename = message.templateFilename.substr(message.templateFilename.lastIndexOf("/") + 1)

            //    logger.log('path  = ' + path)
            //  logger.log(' filename = ' + filename)
            nunjucks.configure(path, { autoescape: false })

            message.content = nunjucks.render(filename, message.contentBlocks)
            //    logger.log('*************************************************************')
            //    logger.log('message.content = ' + message.content)
            //    logger.log('*************************************************************')
        } else {
            nunjucks.configure({ autoescape: false }); // otherwise use a string
            message.content = nunjucks.renderString(message.template, message.contentBlocks)
        }
        this.emit('message', message)
    }
}

export default Templater