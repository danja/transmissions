import ns from '../../utils/ns.js'

import LineReader from './LineReader.js'
import StringFilter from './StringFilter.js'
import StringMerger from './StringMerger.js'
import StringReplace from './StringReplace.js'
import Templater from './Templater.js'

class TextProcessorsFactory {
    static createProcessor(type, config) {

        if (type.equals(ns.trn.Templater)) {
            return new Templater(config)
        }
        if (type.equals(ns.trn.LineReader)) {
            return new LineReader(config)
        }

        if (type.equals(ns.trn.StringFilter)) {
            return new StringFilter(config)
        }

        if (type.equals(ns.trn.StringMerger)) {
            return new StringMerger(config)
        }

        if (type.equals(ns.trn.StringReplace)) {
            return new StringReplace(config)
        }

        //     if (type.equals(ns.trn.CommentStripper)) {
        //       return new CommentStripper(config)
        // }

        return false
    }
}

export default TextProcessorsFactory