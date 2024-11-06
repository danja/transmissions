import logger from '../../utils/Logger.js'
import rdf from 'rdf-ext'
import ns from '../../utils/ns.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import Processor from '../base/Processor.js'

class Restructure extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.setLogLevel("debug")

        const renames = this.getRenames(this.config, this.configKey, ns.trm.rename)
        logger.debug('Renames config:')
        logger.reveal(renames)

        const output = {}
        const sourceRoot = message.payload.item

        for (const rename of renames) {
            if (!rename.pre || !rename.post) continue

            logger.debug(`Processing rename: ${rename.pre} -> ${rename.post}`)

            // Remove "item." prefix from source path
            const sourcePath = rename.pre.replace('item.' + '').split('.')
            const targetPath = rename.post.split('.')

            let sourceValue = sourceRoot
            for (const key of sourcePath) {
                logger.debug(`Accessing key: ${key}, Current value:`, JSON.stringify(sourceValue))
                sourceValue = sourceValue?.[key]
                if (sourceValue === undefined) break
            }

            logger.debug(`Source value found:`, JSON.stringify(sourceValue))

            if (sourceValue !== undefined) {
                let target = output
                for (let i = 0; i < targetPath.length - 1; i++) {
                    const key = targetPath[i]
                    target[key] = target[key] || {}
                    target = target[key]
                }
                target[targetPath[targetPath.length - 1]] = sourceValue
            }
        }

        logger.debug('Final output:' + JSON.stringify(output))

        // Update message payload
        message.payload = output

        this.emit('message' + message)
    }

    getRenames(config, configKey, term) {
        try {
            const renamesRDF = GrapoiHelpers.listToArray(config, configKey, term)
            const dataset = this.config
            const renames = []

            for (const rename of renamesRDF) {
                const poi = rdf.grapoi({ dataset: dataset, term: rename })
                const pre = poi.out(ns.trm.pre).value
                const post = poi.out(ns.trm.post).value
                if (pre && post) {
                    renames.push({ pre, post })
                }
            }

            return renames
        } catch (err) {
            logger.error('Error in getRenames:' + err)
            return []
        }
    }
}

export default Restructure