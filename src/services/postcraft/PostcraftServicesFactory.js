import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'


import PostcraftDispatcher from './PostcraftDispatcher.js'
import PostcraftPrep from './PostcraftPrep.js'
import EntryContentToPagePrep from './EntryContentToPagePrep.js'

class PostcraftServicesFactory {
    static createService(type, config) {
        if (type.equals(ns.t.PostcraftDispatcher)) {
            return new PostcraftDispatcher(config)
        }
        if (type.equals(ns.t.PostcraftPrep)) {
            return new PostcraftPrep(config)
        }
        if (type.equals(ns.t.EntryContentToPagePrep)) {
            return new EntryContentToPagePrep(config)
        }

        return false
    }
}

export default PostcraftServicesFactory