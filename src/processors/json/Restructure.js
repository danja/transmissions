// src/processors/json/Restructure.js
// TODO extract reusable bits to 'src/utils'
import JsonRestructurer from './JsonRestructurer.js'
import JSONUtils from '../../utils/JSONUtils.js'

import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'


/**
 * @class Restructure
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Performs restructuring of JSON messages by renaming and removing fields according to configuration or RDF-based mappings.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.rename`** - Array of rename mapping objects or RDF terms
 * * **`ns.trn.remove`** - Array of paths to remove from the message
 *
 * #### __*Input*__
 * * **`message`** - The JSON object to be restructured
 *
 * #### __*Output*__
 * * **`message`** - The restructured JSON object with fields renamed and/or removed
 *
 * #### __*Behavior*__
 * * Renames fields in the message according to mappings (from config or RDF)
 * * Removes specified fields/paths from the message
 * * Logs detailed information about restructuring actions
 *
 * #### __*Side Effects*__
 * * None
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Extract reusable bits to 'src/utils'
 * * Add more robust error handling and test coverage
 */

class Restructure extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug(`\nRestructure.process`)
        if (message.done) {
            return this.emit('message', message) // 2025-06-10
        }
        /*
        try {
            if (!message.done) { // TODO refactor
                message = await this.doRenames(message)
                message = await this.doRemoves(message)
            }
            
        } catch (err) {
            logger.error("Restructure processor error: " + err.message)
            logger.error(err.stack)
            throw err
        }
        */
        message = await this.doRenames(message)
        message = await this.doRemoves(message)
        return this.emit('message', message)
    }

    async getRenames() {
        logger.debug(`\nRestructure.getRenames`)
        //      logger.debug(`this.settingsNode.value = ${this.settingsNode.value}`)

        // Get renamesRDF as an array of NamedNode terms

        const renamesRDF = super.getValues(ns.trn.rename) // HERE
        //    const renamesRDF = super.getProperty(ns.trn.rename)

        logger.debug(`   renamesRDF = ${JSON.stringify(renamesRDF)}`)


        if (!renamesRDF || !Array.isArray(renamesRDF) || renamesRDF.length === 0) {
            logger.debug('No rename values found')
            return []
        }

        logger.debug(`Found ${renamesRDF.length} rename values`)
        logger.debug(JSON.stringify(renamesRDF))

        // TODO IF THERE IS ONLY ONE RENAME IT DOESN'T GET APPLIED

        // Determine which dataset to use based on targetPath
        /*
        var dataset = this.config
        if (this.message && this.message.targetPath) {
            dataset = this.app.dataset || this.config
        }
*/
        var renames = []
        for (let i = 0; i < renamesRDF.length; i++) {
            logger.debug(`renamesRDF[i] = ${JSON.stringify(renamesRDF[i])}`)
            logger.debug(`typeof renamesRDF[i] = ${typeof renamesRDF[i]}`)
            try {
                //let rename = typeof renamesRDF[i] === 'string' ?
                //rdf.namedNode(renamesRDF[i]) : renamesRDF[i]
                // let rename = renamesRDF[i]
                let pre = super.getPropertyObject(renamesRDF[i], ns.trn.pre)
                let post = super.getPropertyObject(renamesRDF[i], ns.trn.post)
                /*
           let poi = rdf.grapoi({ dataset: dataset, term: rename })
           let pre = poi.out(ns.trn.pre).value
           let post = poi.out(ns.trn.post).value
*/

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



    async doRemoves(message) {
        logger.debug('\n\nRestructure.doRemoves')
        const removes = super.getValues(ns.trn.remove)

        if (!removes || removes.length === 0) {
            logger.debug('No remove directives found')
            return message
        }

        logger.debug(`Found ${removes.length} remove directives`)
        // logger.reveal(removes)

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
        if (this.config?.simples) {
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
        logger.trace(`Restructuring output type: ${type}`)
        logger.trace('Restructuring result:')
        logger.trace(JSON.stringify(restructured))

        // Safely merge restructured properties back to message
        const visited = new WeakSet()

        function safeMerge(target, source, depth = 0) {
            if (depth > 100) { // Prevent excessive recursion
                logger.warn('Maximum merge depth reached, stopping merge')
                return target
            }

            if (visited.has(source)) {
                logger.warn('Circular reference detected during merge, skipping')
                return target
            }

            if (source && typeof source === 'object') {
                visited.add(source)
            }

            for (const key of Object.keys(source)) {
                if (typeof source[key] === 'object' && source[key] !== null) {
                    target[key] = safeMerge(target[key] || {}, source[key], depth + 1)
                } else {
                    target[key] = source[key]
                }
            }

            return target
        }

        safeMerge(message, restructured)
        return message
    }
}

export default Restructure