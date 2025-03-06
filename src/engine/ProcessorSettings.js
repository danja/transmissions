// import Dataset from '@rdfjs/dataset/DatasetCore.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'


class ProcessorSettings {
    constructor(config) {
        this.config = config
    }

    valuesFromDataset(dataset, property) {
        if (!dataset) return undefined
        const ptr = grapoi({ dataset, term: this.settingsNode })
        logger.trace(`valuesFromDataset, this.settingsNode = ${this.settingsNode.value}`)
        logger.trace(`valuesFromDataset, property = ${property}`)
        //     logger.reveal(ptr)

        var values
        try {
            values = ptr.out(property).distinct()
        } catch (e) {
            return undefined
        }

        logger.trace(`Values found: ${values.terms.length}`)

        if (values.terms.length > 0) {
            const all = values.terms.map(term => term.value)
            logger.trace(`All values: ${all}`)
            return all
        }

        // logger.trace(dataset)
        // Check settings reference
        /*
        const settingsPtr = ptr.out([ns.trn.settings]).distinct()
        if (settingsPtr.term) {
            const refPtr = grapoi({ dataset, term: settingsPtr.term })
            const refValues = refPtr.out([property]).distinct()
            logger.trace(`RefValues found: ${refValues.terms.length}`)
            if (refValues.terms.length > 0) {
                return refValues.terms.map(term => term.value)
            }
        }
            */
        return undefined
    }

    getValues(property, fallback) {
        logger.trace(`\n\nProcessorSettings.getValues, property = ${property.value}`)
        // needs settingsNode when

        if (!this.settingsNode || !this.config) {
            return fallback ? [fallback] : []
        }

        logger.trace(`settingsNode = ${this.settingsNode.value}`)

        var dataset = this.app.dataset

        logger.trace(`************ ProcessorSettings.getValues, looking for ${property} in APP dataset`)
        logger.trace('------------------------------------')
        // logger.reveal(dataset)
        logger.trace('------------------------------------')
        var values = this.valuesFromDataset(dataset, property)
        if (values) {
            logger.trace(`ProcessorSettings.getValues, found in APP dataset: ${values}`)
            return values
        }
        logger.trace(`*** ProcessorSettings.getValues, looking for ${property} in CONFIG dataset`)
        dataset = this.config
        logger.trace('------------------------------------')
        // logger.reveal(this.app)
        //  logger.reveal(dataset)
        logger.trace('------------------------------------')
        values = this.valuesFromDataset(dataset, property)
        if (values) {
            return values
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