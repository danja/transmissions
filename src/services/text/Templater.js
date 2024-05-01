import ProcessService from '../base/ProcessService.js'
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
        const template = context.template
        context.content = template
            .replace(/\${header}/g, blocks.header)
            .replace(/\${content}/g, blocks.content)
            .replace(/\${footer}/g, blocks.footer);
        // const keys = Object.keys(driversCounter);


        //   logger.log('RESULT = \n' + context.content)
        // new Function(`with(this) { return \`${context.template}\`; }`).call(data);

        this.emit('message', false, context)
    }
}

export default Templater