// import Dataset from '@rdfjs/dataset/DatasetCore.js'
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

        //   this.appDataset = this.parent.app?.dataset
        //  const appDataset = this.config.app.dataset; // TODO can we see app?

        var dataset = this.app.targetDataset
        if (dataset) {
            logger.debug(`    * looking in TARGET dataset (tt.ttl)`)
            logger.trace(`${logger.shorter(dataset.toString())}`)
            var values = this.valuesFromDataset(dataset, property)
            if (values) return values
        } else {
            logger.debug(`    * TARGET dataset not available`)
        }

        // Check the transmission config (transmissions.ttl)
        dataset = this.app.transmissionsDataset
        if (dataset) {
            logger.debug(`    * looking in TRANSMISSIONS dataset (transmissions.ttl)`)
            logger.trace(`${logger.shorter(dataset)}`)
            var values = this.valuesFromDataset(dataset, property)
            if (values) return values
        } else {
            logger.debug(`    * TRANSMISSIONS dataset not available`)
        }

        // check the general config (config.ttl)
        dataset = this.app.configDataset
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

    valuesFromDataset(dataset, property) { // TODO refactor
        logger.debug('   ProcessorSettings.valuesFromDataset')
        const values = this.valuesFromDatasetWrapped(dataset, property)
        if (values && values.length > 0) {
            logger.debug(`   values = 
    ${values}`)
            return values
        }
        logger.debug('    (not found)')
        return undefined
    }

    valuesFromDatasetWrapped(dataset, property) {
        if (!dataset) return undefined
        //  logger.vr(dataset)
        // logger.log(property)
        try {

            // Ensure dataset is a proper dataset with match method

            if (!dataset.match || typeof dataset.match !== 'function') {
                logger.warn(`Invalid dataset passed to valuesFromDatasetWrapped: ${typeof dataset}`)
                process.exit()
                return []
            }

            const ptr = grapoi({ dataset, term: this.settingsNode })

            if (property.equals(ns.trn.rename)) {
                try {
                    return GrapoiHelpers.listToArray(dataset, this.settingsNode, property)
                } catch (err) {
                    logger.error(`Error extracting list values for ${property}: ${err}`)
                    return []
                }
            }

            // Regular property handling
            const value1 = ptr.out(property)
            logger.debug(`   value1 = ${value1.value}`)

            // Check if property exists but doesn't have value1
            if (value1.terms.length === 0) {
                return []
            }

            const first = this.tryFirst(dataset, value1)
            if (first) {
                const arr = GrapoiHelpers.listToArray(dataset, this.settingsNode, property)
                // Process any array values if needed
            }

            // Process value based on type
            if (value1.terms.length === 1) {
                return [value1.value]
            } else {
                var values = value1.terms.map(term => term.value)
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
}
export default ProcessorSettings