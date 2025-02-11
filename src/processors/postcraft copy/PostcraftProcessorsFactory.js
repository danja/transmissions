import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'


import PostcraftDispatcher from './PostcraftDispatcher.js'
import PostcraftPrep from './PostcraftPrep.js'
import EntryContentToPagePrep from './EntryContentToPagePrep.js'
import FrontPagePrep from './FrontPagePrep.js'
import AtomFeedPrep from './AtomFeedPrep.js'

class PostcraftProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.PostcraftDispatcher)) {
            return new PostcraftDispatcher(config)
        }
        if (type.equals(ns.trn.PostcraftPrep)) {
            return new PostcraftPrep(config)
        }
        if (type.equals(ns.trn.EntryContentToPagePrep)) {
            return new EntryContentToPagePrep(config)
        }
        if (type.equals(ns.trn.FrontPagePrep)) {
            return new FrontPagePrep(config)
        }
        if (type.equals(ns.trn.AtomFeedPrep)) {
            return new AtomFeedPrep(config)
        }
        return false
    }
}

export default PostcraftProcessorsFactory