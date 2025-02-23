import grapoi from 'grapoi'
import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'

class ProcessorSettings {
    constructor(config) {
        this.config = config

    }

    getValues(property, fallback) {
        logger.trace(`\n\nProcessorSettings.getValues,
            property = ${property.value}`)
        if (this.settingsNode) {
            logger.trace(`    settingsNode = ${this.settingsNode.value}`)
        }
        if (!this.settingsNode || !this.config) {
            return fallback ? [fallback] : []
        }

        const dataset = this.config
        //  logger.log(dataset)
        const ptr = grapoi({ dataset, term: this.settingsNode })

        // Get all values and make them unique using distinct()
        logger.trace(`get all match to \n<${this.settingsNode.value}> <${property}> ?value`)
        // const values = ptr.out([property]).distinct()
        const values = ptr.out(property).distinct()
        // logger.debug(`Values found: ${values}`)
        // logger.reveal(values)
        // logger.debug(`Values found: ${values.terms.length}`)

        if (values.terms.length > 0) {
            const all = values.terms.map(term => term.value)
            logger.trace(`All values: ${all}`)
            return all
        }

        // logger.log(dataset)
        // Check settings reference
        const settingsPtr = ptr.out([ns.trn.settings]).distinct()
        if (settingsPtr.term) {
            const refPtr = grapoi({ dataset, term: settingsPtr.term })
            const refValues = refPtr.out([property]).distinct()
            logger.trace(`RefValues found: ${refValues.terms.length}`)
            if (refValues.terms.length > 0) {
                return refValues.terms.map(term => term.value)
            }
        }

        return fallback ? [fallback] : []
    }

    getValue(property, fallback) {
        const values = this.getValues(property, fallback)
        logger.trace(`All values2: ${values}`)
        if (values.length == 0) {
            return undefined
        }
        return values.length == 1 ? values[0] : values // TODO DEPRECATED
    }
}

export default ProcessorSettings