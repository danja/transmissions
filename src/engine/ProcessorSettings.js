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
        logger.trace(`ProcessorSettings.valuesFromDataset,  typeof this.settingsNode = ${typeof this.settingsNode}`)
        //   logger.trace(`valuesFromDataset, this.settingsNode = ${this.settingsNode.value}`)
        logger.trace(`valuesFromDataset, property = ${property}`)
        //     logger.reveal(ptr)

        /*
        var values
        try {
            values = ptr.out(property).distinct()
        } catch (e) {

            return undefined
        }
*/
        const values = GrapoiHelpers.listToArray(dataset, this.settingsNode, property)

        logger.trace(`property ${property}`)
        logger.trace(`${values.length} values found`)
        if (values.length == 1) {
            return ptr.out(property).distinct().value
        }

        //    logger.trace(`Values found: ${values.terms.length}`)

        /*
            if (values.terms.length > 0) {
                const all = values.terms.map(term => term.value)
                logger.trace(`All values: ${all}`)
                return all
            }
    */

        return values
    }

    getValues(settingsNode, property, fallback) {
        this.settingsNode = settingsNode
        logger.trace(`\n\nProcessorSettings.getValues, property = ${property.value}`)

        //    if (!this.settingsNode || !this.config) {
        //      return fallback ? [fallback] : []
        // }

        /////////////////////////////////////////////////////////////////////////////////////////////////
        // logger.trace(`settingsNode = ${this.settingsNode.value}`)

        logger.trace(`\n\n   *** ProcessorSettings.getValues, looking for ${property} in APP dataset`)
        var dataset = this.app.dataset


        // logger.trace('------------------------------------')
        //logger.log(dataset)
        // logger.trace('------------------------------------')


        var values = this.valuesFromDataset(dataset, property)
        if (values) {
            logger.trace(`   ProcessorSettings.getValues, found in APP dataset (manifest.ttl): ${values}`)
            return values
        }

        logger.trace(`*** ProcessorSettings.getValues, looking for ${property} in CONFIG dataset (config.ttl)`)
        dataset = this.config

        /*
        logger.trace('------------------------------------')
        logger.reveal(dataset)
        logger.trace('------------------------------------')
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

        logger.trace(`All values2: ${values}`)
        if (values.length == 0) {
            return undefined
        }
        return values.length == 1 ? values[0] : values // TODO DEPRECATED
    }
        */
}

export default ProcessorSettings