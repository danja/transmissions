import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'
import GrapoiHelpers from '../utils/GrapoiHelpers.js'

class ProcessorSettings {
    constructor(app) {
        logger.debug(`ProcessorSettings constructor`)
        this.app = app
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

        //   logger.log(`    this.app = ${this.app}`)
        // logger.log(`    this.app.datasets = ${this.app.datasets}`)
        //  process.exit()


        var dataset = this.app.datasets.dataset('target')
        if (dataset) {
            logger.debug(`    * looking in TARGET dataset (tt.ttl)`)
            logger.debug(`DS = ${logger.shorter(dataset.toString())}`)
            var values = this.getValuesFromDataset(dataset, property)
            if (values && values.length > 0) return values
        } else {
            logger.debug(`    * TARGET dataset not available`)
        }


        // Check the transmission config (transmissions.ttl)
        dataset = this.app.datasets.dataset('transmissions')
        if (dataset) {
            logger.debug(`    * looking in TRANSMISSIONS dataset (transmissions.ttl)`)
            //logger.log(`${logger.reveal(dataset)}`)
            var values = this.getValuesFromDataset(dataset, property)
            if (values && values.length > 0) return values
        } else {
            logger.debug(`    * TRANSMISSIONS dataset not available`)
        }

        // check the general config (config.ttl)
        dataset = this.app.datasets.dataset('config')
        if (dataset) {
            logger.debug(`    * looking in CONFIG dataset (config.ttl)`)
            //  logger.rv(dataset)
            var values = this.getValuesFromDataset(dataset, property)
            if (values && values.length > 0) return values
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