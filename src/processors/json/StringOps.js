import path from 'path'
import logger from '../../utils/Logger.js'
import rdf from 'rdf-ext'
import ns from '../../utils/ns.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import JSONUtils from '../../utils/JSONUtils.js'
import Processor from '../../model/Processor.js'

// test :
//  ./trans -v stringops -m '{"fields": {"fieldB" : "TEST","fieldC":"_PASSED"}}'

// TODO FOR FUCKS SAKE REFACTOR
class StringOps extends Processor {

    constructor(config) {
        super(config)
        this.config = undefined
        this.settingsNode = undefined
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
        logger.debug(`StringOps.process`)
        logger.warn('TODO StringOps.process, message not checked')
        // @ts-ignore
        const targetField = await this.getProperty(ns.trn.targetField, 'concat')
        logger.debug(`     targetField = ${targetField}`)

        // logger.debug(this)
        if (message.done) return
        //  let poi = rdf.grapoi({ dataset: dataset, term: this.settingsNode })

        // TODO refactor
        // TODO fix all or nothing reading
        var dataset
        var segments
        if (this.app?.dataset) { // manifest
            dataset = this.app?.dataset
            segments = GrapoiHelpers.listToArray(dataset, this.settingsNode, ns.trn.values)
        }

        if (!segments && this.transmissionConfig) {
            dataset = this.app?.dataset
            segments = GrapoiHelpers.listToArray(dataset, this.settingsNode, ns.trn.values)
        }
        if (!segments && this.config) {
            dataset = this.config
            segments = GrapoiHelpers.listToArray(dataset, this.settingsNode, ns.trn.values)
        }

        //  logger.log('SEGEMNTS')
        //    logger.reveal(segments)
        // process.exit()

        const asPath = super.getProperty(ns.trn.asPath) === 'true'

        var combined = this.combineSegments(dataset, message, segments, asPath)
        logger.debug(`combined = ${combined}`)

        JSONUtils.set(message, targetField, combined)
        logger.reveal(message)

        return this.emit('message', message)
    }

    combineSegments(dataset, message, segments, asPath) {
        var combined = ''
        var segment
        for (var i = 0; i < segments.length; i++) {
            segment = segments[i]
            logger.log(`    property = ${segment}`)
            //  logger.reveal(segment)

            let stringSegment = rdf.grapoi({ dataset: dataset, term: segment })
            let stringProperty = stringSegment.out(ns.trn.string)
            //  logger.log(`stringProperty = ${stringProperty.value}`)
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
            //     logger.log(`ààààààààààààààààààààààààààààààààààààààà`)

            logger.debug(`fieldProperty = ${fieldProperty.value}`)
            //  logger.reveal(message)

            if (fieldProperty && fieldProperty.value) {
                let fieldValue = JSONUtils.get(message, fieldProperty.value)

                if (asPath) {
                    try {
                        combined = path.join(combined, fieldValue)
                    } catch (e) {
                        logger.error(`fieldProperty = ${fieldProperty.value}`)
                        logger.error(`fieldValue = ${fieldValue}`)
                        logger.error(`combined = ${combined}`)
                        process.exit(1)
                    }
                    continue
                }
                if ('string' != typeof fieldValue) {
                    fieldValue = JSON.stringify(fieldValue)
                }
                combined = combined + fieldValue
                continue
            }
        }
        return combined
    }
}
export default StringOps