// import Dataset from '@rdfjs/dataset/DatasetCore.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'

class ProcessorSettings {
    constructor(config) {
        this.config = config
    }

    // rename...to what?
    getProperty(settingsNode, property, fallback = undefined) {
        logger.debug(`\nProcessorSettings.getProperty looking for ${property}`)

        this.settingsNode = settingsNode
        //    if (this.settingsNode) logger.debug(`this.settingsNode = ${this.settingsNode.value}`)
        //   this.settee.settingsNode = settingsNode

        const values = this.getValues(settingsNode, property)
        if (values.length == 0) {
            return fallback
        }
        return values.length == 1 ? values[0] : values

        /*
        const value = this.getValue(property, fallback)

        logger.debug(`Processor.getProperty, value = ${value}`)
        return value
        */
    }

    /*
    getValues(property, fallback) {
        logger.debug(`ProcessorSettings.getValues,
                looking for ${property}`)

        var value = this.propertyInMessage(property)
        if (value) {
            return [value]
        }

        this.settee.settingsNode = this.settingsNode
        var values = this.settee.valuesFromDataset(this.app.dataset, property)
        if (!values) {
            values = this.settee.getValues(property, fallback)
        }
        logger.debug(`Processor.getValues values = ${values}`)
        return values
    }
        */

    valuesFromDataset(dataset, property) {
        if (!dataset) return undefined
        const ptr = grapoi({ dataset, term: this.settingsNode })
        logger.debug(`ProcessorSettings.valuesFromDataset,  typeof this.settingsNode = ${typeof this.settingsNode}`)
        //   logger.debug(`valuesFromDataset, this.settingsNode = ${this.settingsNode.value}`)
        logger.debug(`valuesFromDataset, property = ${property}`)
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

        // logger.debug(dataset)
        // Check settings reference
        /*
        const settingsPtr = ptr.out([ns.trn.settings]).distinct()
        if (settingsPtr.term) {
            const refPtr = grapoi({ dataset, term: settingsPtr.term })
            const refValues = refPtr.out([property]).distinct()
            logger.debug(`RefValues found: ${refValues.terms.length}`)
            if (refValues.terms.length > 0) {
                return refValues.terms.map(term => term.value)
            }
        }
            */
        return undefined
    }

    getValues(settingsNode, property, fallback) {
        this.settingsNode = settingsNode
        logger.debug(`\n\nProcessorSettings.getValues, property = ${property.value}`)

        //    if (!this.settingsNode || !this.config) {
        //      return fallback ? [fallback] : []
        // }

        /////////////////////////////////////////////////////////////////////////////////////////////////
        // logger.debug(`settingsNode = ${this.settingsNode.value}`)

        logger.debug(`************ ProcessorSettings.getValues, looking for ${property} in APP dataset`)
        var dataset = this.app.dataset

        /*
        logger.debug('------------------------------------')
         logger.reveal(dataset)
        logger.debug('------------------------------------')
        */

        var values = this.valuesFromDataset(dataset, property)
        if (values) {
            logger.debug(`ProcessorSettings.getValues, found in APP dataset (manifest.ttl): ${values}`)
            return values
        }

        logger.debug(`*** ProcessorSettings.getValues, looking for ${property} in CONFIG dataset (config.ttl)`)
        dataset = this.config

        /*
        logger.debug('------------------------------------')
        logger.reveal(dataset)
        logger.debug('------------------------------------')
        */

        values = this.valuesFromDataset(dataset, property)
        if (values) {
            return values
        }
        return fallback ? [fallback] : []
    }

    /*
    getValue(property, fallback) {
        const values = this.getValues(property, fallback)

        logger.debug(`All values2: ${values}`)
        if (values.length == 0) {
            return undefined
        }
        return values.length == 1 ? values[0] : values // TODO DEPRECATED
    }
        */
}

export default ProcessorSettings