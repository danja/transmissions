// src/processors/system/EndpointsGenerator.js

import fs from 'fs/promises'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import PathResolver from '../../utils/PathResolver.js'
import Config from '../../Config.js'

/**
 * @class EndpointsGenerator
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Generates an endpoints.json file from Config for a dataset.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.dataset`** - Dataset name (default: 'newsmonitor')
 * * **`ns.trn.destinationFile`** - Output path for endpoints.json (default: 'data/endpoints.json')
 */
class EndpointsGenerator extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug('EndpointsGenerator.process')

        if (message.done) {
            return this.emit('message', message)
        }

        const dataset = super.getProperty(ns.trn.dataset, 'newsmonitor')
        const endpoint = Config.getSparqlEndpoint(dataset)

        const endpoints = [
            {
                type: 'query',
                url: endpoint.queryEndpoint,
                credentials: {
                    user: endpoint.username,
                    password: endpoint.password
                }
            },
            {
                type: 'update',
                url: endpoint.updateEndpoint,
                credentials: {
                    user: endpoint.username,
                    password: endpoint.password
                }
            }
        ]

        const filePath = await PathResolver.resolveFilePath({
            message,
            app: this.app,
            getProperty: (prop, def) => this.getProperty(prop, def),
            defaultFilePath: 'data/endpoints.json',
            sourceOrDest: ns.trn.destinationFile,
            isWriter: true
        })

        await fs.mkdir(path.dirname(filePath), { recursive: true })
        await fs.writeFile(filePath, JSON.stringify(endpoints, null, 2), 'utf8')
        logger.log(`EndpointsGenerator: Wrote ${filePath}`)

        return this.emit('message', message)
    }
}

export default EndpointsGenerator
