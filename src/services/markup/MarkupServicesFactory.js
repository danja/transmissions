import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import MetadataExtractor from './MetadataExtractor.js'
import LinkFinder from './LinkFinder.js'
import MarkdownToHTML from './MarkdownToHTML.js'

class MarkupServicesFactory {
    static createService(type, config) {
        logger.debug("MarkupServicesFactory.createService : " + type.value)

        if (type.equals(ns.t.MetadataExtractor)) {
            return new MetadataExtractor(config)
        }
        if (type.equals(ns.t.MarkdownToHTML)) {
            return new MarkdownToHTML(config)
        }
        if (type.equals(ns.t.LinkFinder)) {
            return new LinkFinder(config)
        }

        return false
    }
}

export default MarkupServicesFactory