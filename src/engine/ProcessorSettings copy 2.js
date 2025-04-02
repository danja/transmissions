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
        logger.trace(`\nProcessorSettings.getProperty looking for ${property}`)
        logger.trace(`settingsNode = ${settingsNode}`)
        this.settingsNode = settingsNode
        //    if (this.settingsNode) logger.trace(`this.settingsNode = ${this.settingsNode.value}`)
        //   this.settee.settingsNode = settingsNode

        const values = this.getValues(settingsNode, property)
        if (values.length == 0) {
            return fallback
        }
        return values.length == 1 ? values[0] : values

        /*
        const value = this.getValue(property, fallback)

        logger.trace(`Processor.getProperty, value = ${value}`)
        return value
        */
    }

    /*
    getValues(property, fallback) {
        logger.trace(`ProcessorSettings.getValues,
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
        logger.trace(`Processor.getValues values = ${values}`)
        return values
    }
        */

    valuesFromDataset(dataset, property) {
        if (!dataset) return undefined
        const ptr = grapoi({ dataset, term: this.settingsNode })
        //      logger.trace(`ProcessorSettings.valuesFromDataset,  this.settingsNode = ${this.settingsNode.value}`)
        //   logger.trace(`valuesFromDataset, this.settingsNode = ${this.settingsNode.value}`)
        //    logger.trace(`valuesFromDataset, property = ${property}`)
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
            logger.trace(`\n\nvalue1 = ${value1.value}`)

            // Check if property exists but doesn't have value1
            if (value1.terms.length === 0) {
                return []
            }

            const first = this.tryFirst(dataset, value1)
            if (first) {
                const arr = GrapoiHelpers.listToArray(dataset, this.settingsNode, property)
                //      logger.log(`\narr = ${arr}`)
                for (var i = 0; i < arr.length; i++) {
                    //        logger.log(`\narr[i] = `)
             //       logger.reveal(arr[i])
                }
                //    return arr
            }
            //////////////////////

            // Process value based on type
            if (value1.terms.length === 1) {
                return [value1.value]
            } else {
                var values = value1.terms.map(term => term.value)
                logger.reveal(values)
                return values
            }
        } catch (e) {
            logger.error(`Error getting values for ${property}: ${e}`)
            return []
        }
    }

    /** looks to see if exists
        <value1> rdf:first ?o
    */
    tryFirst(dataset, maybeList) {
        try {
            const maybe = grapoi({ dataset, term: maybeList }).out(ns.rdf.first)
            //  logger.log(`OUT = ${maybe.value}`)
            return maybe
        } catch (e) {
            return false
        }
    }

    getValues(settingsNode, property, fallback) {
        this.settingsNode = settingsNode
        logger.trace(`\n\nProcessorSettings.getValues, property = ${property.value}`)

        if (!this.settingsNode) {
            return fallback ? [fallback] : []
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////
        // logger.trace(`settingsNode = ${this.settingsNode.value}`)

        logger.trace(`\n\n   *** ProcessorSettings.getValues, looking for ${property} in APP dataset`)
        var dataset = this.app?.dataset

        if (dataset) {
            // logger.trace('------------------------------------')
            //logger.log(dataset)
            // logger.trace('------------------------------------')
            var values = this.valuesFromDataset(dataset, property)
            if (values && values.length > 0) {
                logger.trace(`   ProcessorSettings.getValues, found in APP dataset (manifest.ttl): ${values}`)
                return values
            }
        }

        logger.trace(`*** ProcessorSettings.getValues, looking for ${property} in CONFIG dataset (config.ttl)`)
        dataset = this.config

        /*
        logger.trace('------------------------------------')
        logger.reveal(dataset)
        logger.trace('------------------------------------')
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

        logger.trace(`All values2: ${values}`)
        if (values.length == 0) {
            return undefined
        }
        return values.length == 1 ? values[0] : values // TODO DEPRECATED
    }
        */
}

export default ProcessorSettings