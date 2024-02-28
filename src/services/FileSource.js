import rdf from 'rdf-ext'
import ns from '../utils/ns.js'

import logger from '../utils/Logger.js'
import SourceService from '../mill/SourceService.js';

class FileSource extends SourceService {

    execute(config) {
        //  const subject = rdf.namedNode(':inputPath');
        // const predicate = rdf.namedNode('fs:relativePath');

        // Call `match` with subject and predicate, leaving object and graph as null to match any.
        // const matches = dataset.match(subject, predicate, null, null);

        const matches = config.match(ns.t.inputPath, ns.fs.relativePath, null, null)


        logger.log(matches)

    }
}

export default FileSource




