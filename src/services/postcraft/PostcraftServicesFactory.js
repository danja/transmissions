import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import DirWalker from './DirWalker.js'
import PostcraftDispatcher from './PostcraftDispatcher.js'
import FileWriter from './FileWriter.js'


class PostcraftServicesFactory {
    static createService(type, config) {
        logger.debug("PostcraftServicesFactory.createService : " + type.value)

        if (type.equals(ns.t.PostcraftDispatcher)) {
            return new PostcraftDispatcher(config)
        }

        return false
    }
}

export default PostcraftServicesFactory