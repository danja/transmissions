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

    async execute(rootDir, context) {
        // logger.debug("context file = " + source.toString())

        const manifestFilename = rootDir + '/manifest.ttl'
        const stream = fromFile(manifestFilename)

        // should append RDF to incoming?
        //   const config = await rdf.dataset().import(stream)
        // logger.log("§§§§§§§§§ContextReader 1 context : " + Object.keys(context))
        context.rootDir = rootDir
        context.dataset = await rdf.dataset().import(stream)
        //   logger.log("ContextReader 2 context : " + Object.keys(context))

        this.emit('message', rootDir, context)
        //  } catch (err) {
        //    logger.error("ContextReader.execute error : " + err.message)
        //}
    }
}

export default ContextReader