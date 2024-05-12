import ProcessService from '../base/ProcessService.js'
import nunjucks from 'nunjucks'
import logger from '../../utils/Logger.js'

class Templater extends ProcessService {
    constructor(config) {
        super(config)

    }

    // https://mozilla.github.io/nunjucks/getting-started.html

    async execute(data, context) {

        if (context.templateFilename) {
            nunjucks.configure('views', { autoescape: true });
            nunjucks.render(context.templateFilename, context.contentBlocks);
        } else {
            nunjucks.configure({ autoescape: false });
            context.content = nunjucks.renderString(context.template, context.contentBlocks); //// IT CAN READ TEMPLATE FILES
        }
        //   logger.log('RESULT = \n' + context.content)
        // new Function(`with(this) { return \`${context.template}\`; }`).call(data);

        this.emit('message', false, context)
    }
}

export default Templater