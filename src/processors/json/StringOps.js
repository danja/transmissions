import path from 'path'
import logger from '../../utils/Logger.js'
import rdf from 'rdf-ext'
import ns from '../../utils/ns.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import JSONUtils from '../../utils/JSONUtils.js'
import Processor from '../../model/Processor.js'

class StringOps extends Processor {

    constructor(config) {
        super(config)
    }

    /*
      :asPath true ;
  :values (:a :b :c :d) .
  :a :string "/home/danny/sites/strandz.it/postcraft/public" .
  :b :field "currentItem.relPath.value" .
  :c :field "currentItem.slug.value" .
  :d :string ".html" .
  */
    async process(message) {
        logger.debug(`\n\nExampleProcessor.process`)
        if (message.done) return
        // property values pulled from message | config settings | fallback
        const me = await this.getProperty(ns.trn.me)
        logger.log(`\nI am ${me}`)


        return this.emit('message', message)
    }

}
export default StringOps