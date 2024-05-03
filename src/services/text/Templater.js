import ProcessService from '../base/ProcessService.js'
import nunjucks from 'nunjucks'
import logger from '../../utils/Logger.js'

class Templater extends ProcessService {
    constructor(config) {
        super(config)

    }

    async execute(data, context) {
        // logger.log('DATA = ' + data)

        // logger.log('^^^^^^^^^^^ìcontext.template = ' + context.template)
        // logger.log('----------------context.targetFilename = ' + context.targetFilename)
        const content = context.content
        const template = context.template
        // content = 'eqweqwe'
        /*
        const keys = Object.keys(driversCounter);
        is Object.values() and if
        Object.entries(driversCounter).forEach(([key, value]) => {
   console.log(key, value);
});
*/
        const blocks = {
            header: 'HEADER',
            content: content,
            footer: 'FOOTER'
        }
        logger.log(' context.template = ' + context.template)


        nunjucks.configure({ autoescape: false });
        context.content = nunjucks.renderString(template, blocks); //// IT CAN READ TEMPLATE FILES

        //   logger.log('RESULT = \n' + context.content)
        // new Function(`with(this) { return \`${context.template}\`; }`).call(data);

        this.emit('message', false, context)
    }
}

export default Templater