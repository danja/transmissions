import logger from '../../utils/Logger.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import { fromFile, toFile } from 'rdf-utils-fs'

import ns from '../../utils/ns.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import Service from '../base/Service.js'

class RemapContext extends Service {
    constructor(config) {
        super(config)
    }

    async execute(data, context) {
        if (this.preProcess(context)) {
            return
        }

        //    logger.log('SERVICE this.configKey = ' + this.configKey.value)
        // logger.log(this.config.toString())
        const renames = GrapoiHelpers.listToArray(this.config, this.configKey, ns.trm.rename)
        const dataset = this.config
        // for (const rename in renames) {
        for (let i = 0; i < renames.length; i++) {
            let rename = renames[i]
            let poi = rdf.grapoi({ dataset: dataset, term: rename })

            let pre = poi.out(ns.trm.pre).value
            let post = poi.out(ns.trm.post).value
            const stringValue = context[pre].toString()  // otherwise passes a Buffer

            // TODO unhackify
            // for copying value of eg. context.content to context.contentBlocks.content 
            if (post.includes('.')) {
                const s = post.split('.')
                //logger.log('sss ' + s)
                context[s[0]][s[1]] = stringValue
            } else {
                context[post] = stringValue
            }
            logger.log(' - Rename : ' + pre + ' to ' + post)
        }
        this.emit('message', data, context)
    }
}
// new name test
export default RemapContext
