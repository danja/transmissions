import logger from '../../utils/Logger.js'
import rdf from 'rdf-ext'

import ns from '../../utils/ns.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import Service from '../base/Service.js'

/**
 * Changes the shape of the context object by renaming keys.
 * 
 * #### __*Input*__
 * **context** : ?
 * #### __*Output*__
 * **context** : ?
 * 
 * @extends Service
 */
class RemapContext extends Service {
    /**
     * Creates an instance of RemapContext.
     * @param {Object} config - The configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Executes the remapping of the context object.
     * @param {Object} context - The context object to be remapped.
     */
    async execute(context) {
        if (this.preProcess(context)) {
            return
        }

        logger.debug('RemapContext this.configKey = ' + this.configKey.value)

        const renames = GrapoiHelpers.listToArray(this.config, this.configKey, ns.trm.rename)
        const dataset = this.config

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
                logger.debug('pre- split = ' + spre)
                value = context[spre[0]][spre[1]]
            } else {
                value = context[pre]
            }

            // not properly tested, I didn't end up needing it
            value = value.toString()  // otherwise passes a Buffer
            // for copying value of eg. context.content to context.contentBlocks.content 
            if (post.includes('.')) {
                const s = post.split('.')
                logger.debug('post split = ' + s)
                context[s[0]][s[1]] = value
            } else {
                context[post] = value
            }
            logger.log(' - Rename : ' + pre + ' to ' + post)
        }
        this.emit('message', context)
    }
}

export default RemapContext
