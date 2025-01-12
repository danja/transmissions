import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import MetadataExtractor from './MetadataExtractor.js'
import LinkFinder from './LinkFinder.js'
import MarkdownToHTML from './MarkdownToHTML.js'

class MarkupProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.MetadataExtractor)) {
            return new MetadataExtractor(config)
        }
        if (type.equals(ns.trn.MarkdownToHTML)) {
            return new MarkdownToHTML(config)
        }
        if (type.equals(ns.trn.LinkFinder)) {
            return new LinkFinder(config)
        }
        return false
    }
}

export default MarkupProcessorsFactory