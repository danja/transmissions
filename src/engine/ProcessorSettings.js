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
        logger.debug(`ProcessorSettings.valuesFromDataset,  this.settingsNode = ${this.settingsNode.value}`)
        //   logger.debug(`valuesFromDataset, this.settingsNode = ${this.settingsNode.value}`)
        logger.debug(`valuesFromDataset, property = ${property}`)
        //     logger.reveal(ptr)



        // try {
        const value1 = ptr.out(property)
        logger.log(`value1 = ${value1.value}`)
        logger.log(`TYPPE OF ${typeof value1}`)
        if (value1 != ns.trn.rename) {
            return value1.value
        }
        if (value1.terms.length == 1) {
            //   return [value1.value]
        }
        //  } catch (e) {

        //       return undefined
        //}
        const values = GrapoiHelpers.listToArray(dataset, this.settingsNode, property)

        logger.debug(`property ${property}`)
        logger.debug(`${values.length} values found`)
        // if (values.length == 1) {
        //   return ptr.out(property).distinct().value
        //}

        //    logger.debug(`Values found: ${values.terms.length}`)

        /*
            if (values.terms.length > 0) {
                const all = values.terms.map(term => term.value)
                logger.debug(`All values: ${all}`)
                return all
            }
    */
        if (values.length == 1) {
            return values[0]
        }
        return values
    }

    getValues(settingsNode, property, fallback) {
        this.settingsNode = settingsNode
        logger.debug(`\n\nProcessorSettings.getValues, property = ${property.value}`)

        //    if (!this.settingsNode || !this.config) {
        //      return fallback ? [fallback] : []
        // }

        /////////////////////////////////////////////////////////////////////////////////////////////////
        // logger.debug(`settingsNode = ${this.settingsNode.value}`)

        logger.debug(`\n\n   *** ProcessorSettings.getValues, looking for ${property} in APP dataset`)
        var dataset = this.app.dataset


        // logger.debug('------------------------------------')
        //logger.log(dataset)
        // logger.debug('------------------------------------')


        var values = this.valuesFromDataset(dataset, property)
        if (values) {
            logger.debug(`   ProcessorSettings.getValues, found in APP dataset (manifest.ttl): ${values}`)
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