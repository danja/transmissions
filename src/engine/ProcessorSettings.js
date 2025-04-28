// import Dataset from '@rdfjs/dataset/DatasetCore.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'
import GrapoiHelpers from '../utils/GrapoiHelpers.js'

class ProcessorSettings {
    constructor(parent) {
        this.parent = parent
        logger.debug(`   parent.app = ${parent.app}`)
        this.targetDataset = parent.app?.dataset
        logger.debug(`   this.targetDataset = ${this.targetDataset}`)
        this.transmissionConfig = parent.app?.transmissionConfig
        //   logger.debug(`this.transmissionConfig = ${this.transmissionConfig}`)
        this.configDataset = parent.configDataset
        logger.debug(`   this.config = ${this.config}`)
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

        this.targetDataset = this.parent.app?.dataset
        //  const targetDataset = this.config.app.dataset; // TODO can we see app?

        var dataset = this.targetDataset
        logger.debug(`    * looking in target dataset (app.ttl)`)
        logger.log(`${logger.shorter(dataset)}`)
        var values = this.valuesFromDataset(dataset, property)
        if (values) return values

        // Check the transmission config (transmissions.ttl)
        dataset = this.transmissionConfig
        logger.debug(`    * looking in TRANSMISSIONS dataset (transmissions.ttl)`)
        logger.trace(`${logger.shorter(dataset)}`)
        var values = this.valuesFromDataset(dataset, property)
        if (values) return values

        // check the general config (config.ttl)
        dataset = this.configDataset
        logger.debug(`    * looking in CONFIG dataset (config.ttl)`)
        logger.trace(`${logger.shorter(dataset)}`)
        var values = this.valuesFromDataset(dataset, property)
        if (values) return values

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
        try {

            const value1 = ptr.out(property)
            logger.debug(`   value1 = ${value1.value}`)

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

            // Process value based on type
            if (value1.terms.length === 1) {
                return [value1.value]
            } else {
                var values = value1.terms.map(term => term.value)
                //   logger.reveal(values)
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