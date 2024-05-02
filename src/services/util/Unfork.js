import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'
import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
/*
only accept the first call
*/

class Unfork extends Service {

    constructor(config) {
        super(config)
        this.called = false
    }

    async execute(data, context) {
        logger.log('SERVICE this.configKey = ' + this.configKey.value) /// DUPLICATING???
        // logger.log(this.config.toString())
        //   const renames = GrapoiHelpers.listToArray(this.config, this.configKey, ns.trm.rename)

        //        const dataset = this.config
        //      const configNode = grapoi({ dataset, term: this.configKey }).in()
        // const configDataset = this.config
        // const myConfigNode = this.getMyConfigNode()
        // logger.log('\n\nthis.getMyConfigNode() = ' + this.getMyConfigNode().term.value)

        const poi = this.getMyPoi()

        const flags = poi.out(ns.trm.flag)

        var flag
        for (flag of flags) {

            if (flag.value === 'true') {
                called = true
                // break
                logger.log('SKIPPING')
                return
            }
        }
        //  console.dir(flag)

        // poi.deleteOut(ns.trm.flag)
        // poi.addOut(ns.trm.flag, 'true')
        await this.showFlags()
        await this.deletePropertyFromMyConfig(rdf.namedNode(ns.trm.flag), rdf.literal('false'))
        await this.showFlags()
        await this.addPropertyToMyConfig(rdf.namedNode(ns.trm.flag), rdf.literal('true'))
        await this.showFlags()
        logger.log(this.config.toString())
        //   logger.poi(poi)
        //logger.log('flag = ' + flag.value)
        logger.log('CALLING')
        //     this.emit('message', data, context)


    }

    async showFlags() { // for debugging
        logger.log('--- FLAGS ---')
        const poi = this.getMyPoi()
        const flags = poi.out(ns.trm.flag)
        for (const flag of flags) {
            logger.log('FLAG : ' + flag.value)
        }
    }
}

export default Unfork
