import formatsPretty from '@rdfjs/formats/pretty.js'
import rdf from 'rdf-ext'
import { fromFile, toFile } from 'rdf-utils-fs'
import { readFile } from 'node:fs/promises'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import SourceService from '../base/SourceService.js'

class ContextReader extends SourceService {

    constructor(config) {
        super(config)
    }

    //    const fileUrl = new URL('../../node_modules/housemd/dist/housemd.nt', import.meta.url)
    // const fileRelativeUrl = './node_modules/housemd/dist/housemd.nt'
    // const httpUrl = 'https://housemd.rdf-ext.org/person/gregory-house'

    async execute(source, context) {
        logger.debug("context file = " + source.toString())

        const stream = fromFile(source)

        // should append to incoming?
        context = await rdf.dataset().import(stream)

        console.log(`read ${context.size} triples from ${source}`)

        // logger.log('############### context = ' + context.toString())

        this.emit('message', source, context)
        //  } catch (err) {
        //    logger.error("ContextReader.execute error : " + err.message)
        //}
    }
}

export default ContextReader