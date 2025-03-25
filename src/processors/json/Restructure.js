// TODO extract reusable bits to 'src/utils'
import JsonRestructurer from './JsonRestructurer.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import JSONUtils from '../../utils/JSONUtils.js'

import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'

class Restructure extends Processor {
    constructor(config) {
        super(config)
    }

    async getRenames() {
        logger.debug(`\nRestructure.getRenames`)
        logger.debug(`this.settingsNode.value = ${this.settingsNode.value}`)

        // Get renamesRDF as an array of NamedNode terms
        const renamesRDF = super.getValues(ns.trn.rename)

        if (!renamesRDF || !Array.isArray(renamesRDF) || renamesRDF.length === 0) {
            logger.debug('No rename values found')
            return []
        }

        logger.debug(`Found ${renamesRDF.length} rename values`)
        logger.debug(JSON.stringify(renamesRDF))

        // Determine which dataset to use based on targetPath
        var dataset = this.config
        if (this.message && this.message.targetPath) {
            dataset = this.app.dataset || this.config
        }

        var renames = []
        for (let i = 0; i < renamesRDF.length; i++) {
            try {
                let rename = typeof renamesRDF[i] === 'string'
                    ? rdf.namedNode(renamesRDF[i])
                    : renamesRDF[i]

                let poi = rdf.grapoi({ dataset: dataset, term: rename })
                let pre = poi.out(ns.trn.pre).value
                let post = poi.out(ns.trn.post).value

                logger.debug(`Found mapping: PRE: ${pre}, POST: ${post}`)

                if (pre && post) {
                    renames.push({ "pre": pre, "post": post })
                }
            } catch (err) {
                logger.error(`Error processing rename value at index ${i}: ${err.message}`)
            }
        }

        return renames
    }

    async process(message) {
        try {
            message = await this.doRenames(message)
            message = await this.doRemoves(message)
            return this.emit('message', message)
        } catch (err) {
            logger.error("Restructure processor error: " + err.message)
            logger.error(err.stack)
            throw err
        }
    }

    async doRemoves(message) {
        logger.debug('\n\nRestructure.doRemoves')
        const removes = super.getValues(ns.trn.remove)

        if (!removes || removes.length === 0) {
            logger.debug('No remove directives found')
            return message
        }

        logger.debug(`Found ${removes.length} remove directives`)
        logger.reveal(removes)

        for (let i = 0; i < removes.length; i++) {
            const path = removes[i]
            logger.debug(`Processing remove path = ${path}`)
            message = JSONUtils.remove(message, path)
        }

        return message
    }

    async doRenames(message) {
        logger.debug('\n\nRestructure.doRenames')
        // Extract mappings array from config
        var renames
        if (this.config.simples) {
            renames = this.config.rename
        } else {
            renames = await this.getRenames()
        }

        if (!renames || renames.length === 0) {
            logger.debug('No rename mappings found')
            return message
        }

        logger.debug(`Found ${renames.length} rename mappings:`)
        logger.debug(JSON.stringify(renames))

        // Initialize JsonRestructurer with mappings
        this.restructurer = new JsonRestructurer({
            mappings: renames
        })

        // Get input data from message
        const input = structuredClone(message)

        // Perform restructuring
        const restructured = this.restructurer.restructure(input, this)

        const type = typeof restructured
        logger.debug(`Restructuring output type: ${type}`)
        logger.debug('Restructuring result:')
        logger.debug(JSON.stringify(restructured))

        for (const key of Object.keys(restructured)) {
            message[key] = restructured[key]
        }
        return message
    }
}

export default Restructure