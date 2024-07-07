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

    async execute(context) {
        if (this.preProcess(context)) {
            return
        }

        //    logger.log('SERVICE this.configKey = ' + this.configKey.value)

        const renames = GrapoiHelpers.listToArray(this.config, this.configKey, ns.trm.rename)
        const dataset = this.config
        //  logger.log('renames  = ' + renames)
        // for (const rename in renames) {
        for (let i = 0; i < renames.length; i++) {
            let rename = renames[i]

            let poi = rdf.grapoi({ dataset: dataset, term: rename })

            let pre = poi.out(ns.trm.pre).value
            let post = poi.out(ns.trm.post).value
            var value

            // TODO unhackify
            // for copying value of eg. x.y.z to context.b
            if (pre.includes('.')) {
                const spre = pre.split('.')
                logger.log('spre ' + spre)
                value = context[spre[0]][spre[1]]
            } else {
                value = context[pre]
            }
            // not properly tested, I didn't end up needing it
            value = value.toString()  // otherwise passes a Buffer
            // for copying value of eg. context.content to context.contentBlocks.content 
            if (post.includes('.')) {
                const s = post.split('.')
                //logger.log('sss ' + s)
                context[s[0]][s[1]] = value
            } else {
                context[post] = value
            }
            logger.log(' - Rename : ' + pre + ' to ' + post)
        }
        // process.exit()
        this.emit('message', context)
    }
}
// new name test
export default RemapContext
