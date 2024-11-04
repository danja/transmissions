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
class Restructure extends Processor {
    /**
     * Creates an instance of Restructure.
     * @param {Object} config - The configuration object. 
     */
    constructor(config) {
        super(config)
    }

    /**
     * Executes the remapping of the message object.
     * @param {Object} message - The message object to be remapped.
     */
    async process(message) {
        logger.setLogLevel("debug")
        if (this.preProcess(message)) { // TODO wtf, sort out!!
            return
        }

        logger.debug('Restructure this.configKey = ' + this.configKey.value)

        const renames = GrapoiHelpers.listToArray(this.config, this.configKey, ns.trm.rename)
        const dataset = this.config

        for (let i = 0; i < renames.length; i++) {
            let rename = renames[i]
            let poi = rdf.grapoi({ dataset: dataset, term: rename })
            let pre = poi.out(ns.trm.pre).value
            let post = poi.out(ns.trm.post).value

            logger.debug('Restructure, pre = ' + pre)
            logger.debug('Restructure, post = ' + post)

            var value

            // TODO unhackify
            // for copying value of eg. x.y.z to message.b
            if (pre.includes('.')) {
                const spre = pre.split('.')
                logger.debug('pre- split = ' + spre)
                //    value = structuredClone(message[spre[0]][spre[1]])
                value = message[spre[0]][spre[1]]
            } else {
                //  value = structuredClone(message[pre])
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

export default Restructure
