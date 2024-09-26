import logger from '../../utils/Logger.js'
import rdf from 'rdf-ext'

import ns from '../../utils/ns.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import Processor from '../base/Processor.js'

/**
 * Changes the shape of the message object by renaming keys.
 * 
 * #### __*Input*__
 * **message** : ?
 * #### __*Output*__
 * **message** : ?
 * 
 * @extends Processor
 */
class RemapContext extends Processor { // TODO rename RemapMessage
    /**
     * Creates an instance of RemapContext.
     * @param {Object} config - The configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Executes the remapping of the message object.
     * @param {Object} message - The message object to be remapped.
     */
    async execute(message) {
        if (this.preProcess(message)) {
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
            // for copying value of eg. x.y.z to message.b
            if (pre.includes('.')) {
                const spre = pre.split('.')
                logger.log('pre- split = ' + spre)
                value = message[spre[0]][spre[1]]
            } else {
                value = message[pre]
            }

            // not properly tested, I didn't end up needing it
            value = value.toString()  // otherwise passes a Buffer
            // for copying value of eg. message.content to message.contentBlocks.content 
            if (post.includes('.')) {
                const s = post.split('.')
                logger.log('post split = ' + s)
                message[s[0]][s[1]] = value
            } else {
                message[post] = value
            }
            logger.log(' - Rename : ' + pre + ' to ' + post)
        }
        this.emit('message', message)
    }
}

export default RemapContext
