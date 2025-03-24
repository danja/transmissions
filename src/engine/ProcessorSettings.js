// import Dataset from '@rdfjs/dataset/DatasetCore.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'
import GrapoiHelpers from '../utils/GrapoiHelpers.js'

class ProcessorSettings {
    constructor(config) {
        this.config = config
    }

    // rename...to what?
    getProperty(settingsNode, property, fallback = undefined) {
        logger.debug(`\nProcessorSettings.getProperty looking for ${property}`)
        logger.debug(`settingsNode = ${settingsNode}`)
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
        //      logger.debug(`ProcessorSettings.valuesFromDataset,  this.settingsNode = ${this.settingsNode.value}`)
        //   logger.debug(`valuesFromDataset, this.settingsNode = ${this.settingsNode.value}`)
        //    logger.debug(`valuesFromDataset, property = ${property}`)
        //     logger.reveal(ptr)
        //  logger.sh(dataset)
        //
        // Special handling for rename lists
        if (property.equals(ns.trn.rename)) {
            try {
                return GrapoiHelpers.listToArray(dataset, this.settingsNode, property)
            } catch (err) {
                logger.error(`Error extracting list values for ${property}: ${err}`)
                return []
            }
        }

        // Regular property handling
        try {
            const value1 = ptr.out(property)
            //    logger.log(`value1 = ${value1.value}`)
            //  logger.log(`TYPE OF ${typeof value1}`)

            // Check if property exists but doesn't have value1
            if (value1.terms.length === 0) {
                return []
            }

            // Process value based on type
            if (value1.terms.length === 1) {
                return [value1.value]
            } else {
                return value1.terms.map(term => term.value)
            }
        } catch (e) {
            logger.error(`Error getting values for ${property}: ${e}`)
            return []
        }
    }

    getValues(settingsNode, property, fallback) {
        this.settingsNode = settingsNode
        logger.debug(`\n\nProcessorSettings.getValues, property = ${property.value}`)

        if (!this.settingsNode) {
            return fallback ? [fallback] : []
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////
        // logger.debug(`settingsNode = ${this.settingsNode.value}`)

        logger.debug(`\n\n   *** ProcessorSettings.getValues, looking for ${property} in APP dataset`)
        var dataset = this.app?.dataset

        if (dataset) {
            // logger.debug('------------------------------------')
            //logger.log(dataset)
            // logger.debug('------------------------------------')
            var values = this.valuesFromDataset(dataset, property)
            if (values && values.length > 0) {
                logger.debug(`   ProcessorSettings.getValues, found in APP dataset (manifest.ttl): ${values}`)
                return values
            }
        }

        logger.debug(`*** ProcessorSettings.getValues, looking for ${property} in CONFIG dataset (config.ttl)`)
        dataset = this.config

        /*
        logger.debug('------------------------------------')
        logger.reveal(dataset)
        logger.debug('------------------------------------')
        */

        values = this.valuesFromDataset(dataset, property)
        if (values && values.length > 0) {
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