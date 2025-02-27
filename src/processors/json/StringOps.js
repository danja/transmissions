import logger from '../../utils/Logger.js'
import rdf from 'rdf-ext'
import ns from '../../utils/ns.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import Processor from '../../model/Processor.js'

class StringOps extends Processor {

    constructor(config) {
        super(config)
        logger.log('CREATING Sedlet')
    }

}
export default StringOps