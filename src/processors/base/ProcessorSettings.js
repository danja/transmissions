import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'

class ProcessorSettings {
    constructor(config) {
        this.config = config

    }

    getValues(property, fallback) {
        logger.debug(`\n\nProcessorSettings.getValues, property = ${property.value}`)

        if (!this.settingsNode || !this.config) {
            return fallback ? [fallback] : []
        }

        const dataset = this.config
        const ptr = grapoi({ dataset, term: this.settingsNode })

        // Get all values and make them unique using distinct()
        logger.debug(`get all matches to ${this.settingsNode.value} ${property} ?value`)
        const values = ptr.out([property]).distinct()
        logger.debug(`Values found: ${values.terms.length}`)

        if (values.terms.length > 0) {
            const all = values.terms.map(term => term.value)
            logger.debug(`All values: ${all}`)
            return all
        }

        // logger.log(dataset)
        // Check settings reference
        const settingsPtr = ptr.out([ns.trn.settings]).distinct()
        if (settingsPtr.term) {
            const refPtr = grapoi({ dataset, term: settingsPtr.term })
            const refValues = refPtr.out([property]).distinct()
            logger.debug(`RefValues found: ${refValues.terms.length}`)
            if (refValues.terms.length > 0) {
                return refValues.terms.map(term => term.value)
            }
        }

        return fallback ? [fallback] : []
    }

    getValue(property, fallback) {
        const values = this.getValues(property, fallback)
        logger.debug(`All values2: ${values}`)
        return values.length == 1 ? values[0] : values // TODO DEPRECATED
    }
}

export default ProcessorSettings