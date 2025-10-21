import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import MetadataExtractor from './MetadataExtractor.js'
import LinkFinder from './LinkFinder.js'
import MarkdownToHTML from './MarkdownToHTML.js'
import MarkdownToLinks from './MarkdownToLinks.js'
import HTMLToMarkdown from './HTMLToMarkdown.js'
import FeedParser from './FeedParser.js'
import HTMLFeedExtractor from './HTMLFeedExtractor.js'

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
        if (type.equals(ns.trn.MarkdownToLinks)) {
            return new MarkdownToLinks(config)
        }
        if (type.equals(ns.trn.HTMLToMarkdown)) {
            return new HTMLToMarkdown(config)
        }
        if (type.equals(ns.trn.FeedParser)) {
            return new FeedParser(config)
        }
        if (type.equals(ns.trn.HTMLFeedExtractor)) {
            return new HTMLFeedExtractor(config)
        }
        return false
    }
}

export default MarkupProcessorsFactory