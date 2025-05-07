import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'
import GrapoiHelpers from '../utils/GrapoiHelpers.js'

class ProcessorSettings {
    constructor(parent) {
        logger.debug(`ProcessorSettings constructor`)
        this.app = parent.app
        /*
        this.parent = parent

        // Get the app
        logger.debug(`   parent.app = ${parent.app}`)

        // Get the target dataset from the app
        this.appDataset = parent.app?.targetDataset
        logger.debug(`   this.appDataset (target dataset) = ${this.appDataset}`)

        // Get the transmissions dataset from the app
        this.transmissionsDataset = parent.app?.transmissionsDataset
        logger.debug(`   this.transmissionConfig = ${this.transmissionConfig}`)

        // Get the config dataset
        this.configDataset = parent.configDataset
        logger.debug(`   this.configDataset = ${this.configDataset}`)
        */
    }

    // rename...to what?
    getProperty(settingsNode, property, fallback = undefined) {
        logger.debug(`   ProcessorSettings.getProperty looking for ${property}`)
        logger.debug(`   settingsNode = ${settingsNode}`)
        this.settingsNode = settingsNode

        const values = this.getValues(settingsNode, property, fallback)
        if (values.length == 0) {
            return fallback
        }
        return values.length == 1 ? values[0] : values
    }

    getValues(settingsNode, property, fallback) {
        this.settingsNode = settingsNode
        logger.debug(`   ProcessorSettings.getValues
    property = ${property.value}`)

        if (!this.settingsNode) {
            return fallback ? [fallback] : []
        }

        var dataset = this.app.datasets['target']
        if (dataset) {
            logger.debug(`    * looking in TARGET dataset (tt.ttl)`)
            logger.trace(`${logger.shorter(dataset.toString())}`)
            var values = this.valuesFromDataset(dataset, property)
            if (values) return values
        } else {
            logger.debug(`    * TARGET dataset not available`)
        }

        // Check the transmission config (transmissions.ttl)
        dataset = this.app.datasets['transmissions']
        if (dataset) {
            logger.debug(`    * looking in TRANSMISSIONS dataset (transmissions.ttl)`)
            logger.log(`${logger.reveal(dataset)}`)
            var values = this.valuesFromDataset(dataset, property)
            if (values) return values
        } else {
            logger.debug(`    * TRANSMISSIONS dataset not available`)
        }

        // check the general config (config.ttl)
        dataset = this.app.datasets['config']
        if (dataset) {
            logger.debug(`    * looking in CONFIG dataset (config.ttl)`)
            // logger.log(`${logger.shorter(dataset)}`)
            var values = this.valuesFromDataset(dataset, property)
            if (values) return values
        } else {
            logger.debug(`    * CONFIG dataset not available`)
        }

        return fallback ? [fallback] : []
    }

    /**
     * Retrieves values for a given property from a dataset.
     * Handles both single values and RDF lists.
     * @param {Dataset} dataset - The RDF dataset to query
     * @param {Term} property - The property to retrieve values for
     * @returns {Array} - Array of values, empty array if none found
     */
    getValuesFromDataset(dataset, property) {
        if (!dataset) return []
        
        try {
            const ptr = grapoi({ dataset, term: this.settingsNode })
            if (!ptr.dataset.match) {
                logger.debug('No match found in dataset')
                return []
            }

            // Handle special case for rename property
            if (property.equals(ns.trn.rename)) {
                try {
                    return GrapoiHelpers.listToArray(dataset, this.settingsNode, property)
                } catch (err) {
                    logger.error(`Error extracting list values for ${property}: ${err}`)
                    return []
                }
            }

            // Get the property value(s)
            const value = ptr.out(property)
            if (value.terms.length === 0) {
                return []
            }

            // Check if this is an RDF list
            const first = this.tryFirst(dataset, value)
            if (first && first.terms.length > 0) {
                return GrapoiHelpers.listToArray(dataset, this.settingsNode, property)
            }

            // Handle single or multiple values
            if (value.terms.length === 1) {
                return [value.value]
            }
            return value.terms.map(term => term.value)

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
}
export default ProcessorSettings