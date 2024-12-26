import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'


import PostcraftDispatcher from './PostcraftDispatcher.js'
import PostcraftPrep from './PostcraftPrep.js'
import EntryContentToPagePrep from './EntryContentToPagePrep.js'
import FrontPagePrep from './FrontPagePrep.js'
import AtomFeedPrep from './AtomFeedPrep.js'

class PostcraftProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.t.PostcraftDispatcher)) {
            return new PostcraftDispatcher(config)
        }
        if (type.equals(ns.t.PostcraftPrep)) {
            return new PostcraftPrep(config)
        }
        if (type.equals(ns.t.EntryContentToPagePrep)) {
            return new EntryContentToPagePrep(config)
        }
        if (type.equals(ns.t.FrontPagePrep)) {
            return new FrontPagePrep(config)
        }
        if (type.equals(ns.t.AtomFeedPrep)) {
            return new AtomFeedPrep(config)
        }
        return false
    }
}

export default PostcraftProcessorsFactory