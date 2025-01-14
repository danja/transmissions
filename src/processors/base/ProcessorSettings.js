import logger from '../../utils/Logger.js'
import { EventEmitter } from 'events'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import footpath from '../../utils/footpath.js'

class ProcessorSettings {

    constructor(config) {
        this.config = config
    }

    getProperty(property, fallback) {
        logger.debug(`ProcessorSettings.getProperty looking for ${property}`)
        logger.debug(`ProcessorSettings.getProperty, processor.transmissionNode.value = ${processor.transmissionNode.value}`)

        const shortName = ns.getShortname(property)
        if (message && message[shortName]) {
            logger.debug(`Found in message: ${message[shortName]}`)
            return message[shortName]
        }

        const settingsValue = processor.getPropertyFromSettings(property)
        if (settingsValue) {
            logger.debug(`Found in settings: ${settingsValue.value}`)
            return settingsValue.value
        }

        logger.debug(`Using fallback: \n\t${fallback}`)
        return fallback
    }

    getPropertyFromSettings(property) {
        logger.log(`ProcessorSettings.getPropertyFromSettings, property = ${property}`)
        if (!processor.config || !processor.settingsNode) {
            logger.debug('Config or node missing')
            return undefined
        }

        // TODO GET PROPERTY FROM DATASET
        const dataset = processor.config
        const ptr = grapoi({ dataset, term: processor.settingsNode })

        logger.log(`Checking property ${property} on node ${processor.settingsNode.value}`)
        let values = ptr.out(property)
        if (values.terms.length > 0) {
            logger.debug(`Found direct property value: ${values.term.value}`)
            return values.term
        }
        logger.debug('No direct property found')

        // Debug full path
        //     logger.debug(`Dataset: ${[...dataset].map(q => `${q.subject.value} ${q.predicate.value} ${q.object.value}`).join('\n')}`)

        const settings = ptr.out(ns.trn.settings)
        logger.debug(`Settings query result: ${settings?.terms?.length} terms`)
        if (settings.terms.length > 0) {
            const settingsId = settings.term
            logger.debug(`Found settings reference: ${settingsId.value}`)

            const settingsPtr = grapoi({ dataset, term: settingsId })
            const settingsValues = settingsPtr.out(property)
            if (settingsValues.terms.length > 0) {
                logger.debug(`Found settings property value: ${settingsValues.term.value}`)
                return settingsValues.term
            }
            logger.debug('No property found in settings')
        }
        logger.debug('No settings reference found')
        return undefined
    }

}
export default ProcessorSettings