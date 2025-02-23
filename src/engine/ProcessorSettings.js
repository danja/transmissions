// import Dataset from '@rdfjs/dataset/DatasetCore.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'
import DatasetExt from 'rdf-ext/lib/Dataset.js'

class ProcessorSettings {
    constructor(config) {
        this.config = config
    }

    valuesFromDataset(dataset, property) {
        const ptr = grapoi({ dataset, term: this.settingsNode })
        logger.log(`valuesFromDataset, this.settingsNode = ${this.settingsNode.value}`)
        logger.log(`valuesFromDataset, property = ${property}`)
        //     logger.reveal(ptr)

        var values
        //   try {
        values = ptr.out(property).distinct()
        // } catch (e) {
        //   return undefined
        // }

        logger.trace(`Values found: ${values.terms.length}`)

        if (values.terms.length > 0) {
            const all = values.terms.map(term => term.value)
            logger.trace(`All values: ${all}`)
            return all
        }

        // logger.log(dataset)
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

        if (!this.settingsNode || !this.config) {
            return fallback ? [fallback] : []
        }

        logger.log(`settingsNode = ${this.settingsNode.value}`)

        var dataset = this.app.datas

        // var dataset = rdf.dataset(this.app.datas)

        logger.trace(`ProcessorSettings.getValues, looking for ${property} in APP dataset`)
        // logger.log('------------------------------------')
        // logger.reveal(dataset)
        // logger.log('------------------------------------')
        var values = this.valuesFromDataset(dataset, property)
        if (values) {
            return values
        }
        // logger.trace(`ProcessorSettings.getValues, looking for ${property} in CONFIG dataset`)
        dataset = this.config
        // logger.log('------------------------------------')
        // logger.reveal(this.app)
        // logger.reveal(dataset)
        // logger.log('------------------------------------')
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