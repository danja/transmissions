import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'

class ProcessorSettings {
    constructor(config) {
        this.config = config
        //  this.settingsNode = null
    }

    getValues(property, fallback) {
        logger.debug(`ProcessorSettings.getValues, property = ${property}`)

        if (!this.settingsNode || !this.config) {
            return fallback ? [fallback] : []
        }

        logger.debug(`ProcessorSettings.getValues, settingsNode = ${this.settingsNode.value}`)

        const dataset = this.config
        const ptr = grapoi({ dataset, term: this.settingsNode })

        // Check direct property values
        const values = ptr.out(property)
        logger.debug(`\n\nProcessorSettings.getValues values.length = ${values.terms.length}`)

        for (let i = 0; i < values.length; i++) {
            logger.debug(`ProcessorSettings.getValues values[${i}] = ${values.terms[i].value}`)
        }

        if (values.terms.length > 0) {
            return values.terms.map(term => term.value)
        }


        // Check settings reference
        const settingsPtr = ptr.out(ns.trn.settings)
        if (settingsPtr.term) {
            const refPtr = grapoi({ dataset, term: settingsPtr.term })
            const refValues = refPtr.out(property)
            if (refValues.terms.length > 0) {
                return refValues.terms.map(term => term.value)
            }
        }

        return fallback ? [fallback] : []
    }

    getValue(property, fallback) {
        const values = this.getValues(property, fallback)
        return values.length > 0 ? values[0] : fallback
    }
}

export default ProcessorSettings