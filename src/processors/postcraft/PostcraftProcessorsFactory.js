import ns from '../../utils/ns.js'

import MakeEntry from './MakeEntry.js'
import RenderArticle from './RenderArticle.js'

class PostcraftProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.MakeEntry)) {
            return new MakeEntry(config)
        }
        if (type.equals(ns.trn.RenderArticle)) {
            return new RenderArticle(config)
        }
        return false
    }
}

export default PostcraftProcessorsFactory