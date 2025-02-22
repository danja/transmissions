// TODO extract reusable bits to 'src/utils'
import JsonRestructurer from './JsonRestructurer.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import JSONUtils from '../../utils/JSONUtils.js'

import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'
import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'

class Restructure extends Processor {
    constructor(config) {
        super(config)
    }

    async getRenames(config, term) {
        // logger.log(`***** config = ${config}`)
        //logger.log(`***** settings = ${settings}`)
        //logger.log(`***** term = ${term}`)

        const renamesRDF = GrapoiHelpers.listToArray(config, this.settingsNode, term)
        const dataset = this.config

        var renames = []
        for (let i = 0; i < renamesRDF.length; i++) {
            let rename = renamesRDF[i]
            let poi = rdf.grapoi({ dataset: dataset, term: rename })
            let pre = poi.out(ns.trn.pre).value
            let post = poi.out(ns.trn.post).value
            logger.trace(`PRE: ${pre}, POST: ${post}`)
            renames.push({ "pre": pre, "post": post })
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
            logger.reveal(message)
            throw err
        }
    }

    async doRemoves(message) {
        logger.debug('Restructure.doRemoves')
        const removes = super.getValues(ns.trn.remove)
        logger.reveal(removes)
        var path
        for (let i = 0; i < removes.length; i++) {
            //  path = JSON.parse(removes[i])
            const path = removes[i]
            logger.debug(`remove path = ${path}`)
            message = JSONUtils.remove(message, path)
        }
        //  logger.reveal(message)
        // process.exit()
        return message
    }

    async doRenames(message) {
        logger.debug('Restructure.doRenames')
        // Extract mappings array from config
        var renames
        if (this.config.simples) {
            renames = this.config.rename
        } else {
            renames = await this.getRenames(this.config, ns.trn.rename)
        }

        //  logger.log('Renames :')
        // logger.reveal(renames)

        // Initialize JsonRestructurer with mappings
        this.restructurer = new JsonRestructurer({
            mappings: renames
        })

        // Get input data from message
        // const input = message.payload?.item || message.payload
        const input = structuredClone(message)

        // Perform restructuring
        const restructured = this.restructurer.restructure(input)

        const type = typeof restructured
        // logger.debug(`typeof restructured = ${type}`) // is object... TODO need different handling for returned arrays?
        // logger.debug(`restructured = ${restructured}`)
        // logger.reveal(restructured)

        for (const key of Object.keys(restructured)) {
            message[key] = restructured[key]
        }
        return message
    }
}

export default Restructure