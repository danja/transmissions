import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'
import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
/*
only accept the first call
*/

class Unfork extends Service {

    async execute(data, context) {
        logger.log('SERVICE this.configKey = ' + this.configKey.value) /// DUPLICATING???
        // logger.log(this.config.toString())
        //   const renames = GrapoiHelpers.listToArray(this.config, this.configKey, ns.trm.rename)

        //        const dataset = this.config
        //      const configNode = grapoi({ dataset, term: this.configKey }).in()
        const configDataset = this.config
        const myConfigNode = this.getMyConfigNode()
        logger.log('this.getMyConfigNode() = ' + this.getMyConfigNode().value)


        //   const configNode = grapoi({ dataset: myConfig, term: this.configKey }).in()
        const calledFlag = grapoi({ dataset: configDataset, term: myConfigNode }).out(ns.trm.flag)
        logger.poi(calledFlag)
        logger.log('calledFlag.out(ns.trm.flag).value) = ' + calledFlag.out(ns.trm.flag).value)

        logger.log('CALLED = ' + calledFlag.value)
        if (!calledFlag == 'false') {
            logger.log('CALLING')
            //  configDataset.addOut(ns.trm.flag, 'true')
            //    await this.setCalled(myConfig)
            myConfig.value = 'true'
            this.emit('message', data, context)
        } else {
            logger.log('SKIPPING')
        }
    }

    // async alreadyCalled() {
    //  if(calledNode )
    // }

    async setCalled() {

    }

    locateServiceNode() {

    }
}

export default Unfork
