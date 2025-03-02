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
        logger.debug(`\n\nStringOps.process`)
        if (message.done) return

        // TODO refactor
        const dataset = this.config
        let poi = rdf.grapoi({ dataset: dataset, term: this.settingsNode })
        const segments = GrapoiHelpers.listToArray(dataset, this.settingsNode, ns.trn.values)
        // logger.reveal(segments)
        const asPath = super.getProperty(ns.trn.asPath) === 'true'

        var combined = ''
        var segment
        for (var i = 0; i < segments.length; i++) {
            segment = segments[i]
            // logger.log(`property = ${segment}`)
            // logger.reveal(segment)

            let stringSegment = rdf.grapoi({ dataset: dataset, term: segment })
            let stringProperty = stringSegment.out(ns.trn.string)
            // logger.log(`stringProperty = ${stringProperty.value}`)
            if (stringProperty && stringProperty.value) {
                if (asPath) {
                    combined = path.join(combined, stringProperty.value)
                    continue
                }
                combined = combined + stringProperty.value
                continue
            }

            let fieldSegment = rdf.grapoi({ dataset: dataset, term: segment })
            let fieldProperty = fieldSegment.out(ns.trn.field)
            // logger.log(`fieldProperty = ${fieldProperty.value}`)

            if (fieldProperty && fieldProperty.value) {
                let fieldValue = JSONUtils.get(message, fieldProperty.value)
                if (asPath) {
                    combined = path.join(combined, fieldValue)
                    continue
                }
                if ('string' != typeof fieldValue) {
                    fieldValue = JSON.stringify(fieldValue)
                }
                combined = combined + fieldValue
                continue
            }
        }
        logger.debug(`combined = ${combined}`)

        const targetField = await this.getProperty(ns.trn.targetField)
        logger.debug(`targetField = ${targetField}`)
        JSONUtils.set(message, targetField, combined)

        return this.emit('message', message)
    }

}
export default StringOps