import ProcessService from '../base/ProcessService.js'
import logger from '../../utils/Logger.js'

class Templater extends ProcessService {
    constructor(config) {
        super(config)

    }

    async execute(data, context) {
        // logger.log('DATA = ' + data)

        // logger.log('^^^^^^^^^^^ìcontext.template = ' + context.template)
        logger.log('----------------context.targetFilename = ' + context.targetFilename)
        // logger.reveal(context)
        // process.exit()
        //  let output = new Function(`with(this) { return \`${context.template}\`; }`).call(data)
        let output = 'DUMMY'
        // new Function(`with(this) { return \`${context.template}\`; }`).call(data);

        this.emit('message', output, context)
    }
}

export default Templater