import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'

class SetMessage extends Processor {

    constructor(config) {
        super(config)
        logger.log('SetMessage constructor')
    }

    async process(message) {
        const setters = await this.getSetters(this.config, this.settings, ns.trn.setValue)
        for (let i = 0; i < setters.length; i++) {
            message[setters[i].key] = setters[i].value
        }
        return this.emit('message', message)
    }

    async getSetters(config, configKey, term) { // TODO refactor - is same in RestructureJSON
        //    logger.log(`***** config = ${config}`)
        //  logger.log(`***** configKey = ${configKey}`)
        // logger.log(`***** term = ${term}`)
        const settersRDF = GrapoiHelpers.listToArray(config, configKey, term)
        const dataset = this.config
        var setters = []
        for (let i = 0; i < settersRDF.length; i++) {
            let setter = settersRDF[i]
            let poi = rdf.grapoi({ dataset: dataset, term: setter })
            let key = poi.out(ns.trn.key).value
            let value = poi.out(ns.trn.value).value
            setters.push({ "key": key, "value": value })
        }
        return setters
    }
}

export default SetMessage
