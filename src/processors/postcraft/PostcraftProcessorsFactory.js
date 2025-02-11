import ns from '../../utils/ns.js'

import MakeEntry from './MakeEntry.js'

class PostcraftProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.MakeEntry)) {
            return new MakeEntry(config)
        }
        return false
    }
}

export default PostcraftProcessorsFactory