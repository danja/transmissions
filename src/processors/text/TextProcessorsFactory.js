import ns from '../../utils/ns.js'

import LineReader from './LineReader.js'
import StringFilter from './StringFilter.js'
import StringMerger from './StringMerger.js'
import StringReplace from './StringReplace.js'
import Templater from './Templater.js'

class TextProcessorsFactory {
    static createProcessor(type, config) {

        if (type.equals(ns.t.Templater)) {
            return new Templater(config)
        }
        if (type.equals(ns.t.LineReader)) {
            return new LineReader(config)
        }

        if (type.equals(ns.t.StringFilter)) {
            return new StringFilter(config)
        }

        if (type.equals(ns.t.StringMerger)) {
            return new StringMerger(config)
        }

        if (type.equals(ns.t.StringReplace)) {
            return new StringReplace(config)
        }

        //     if (type.equals(ns.t.CommentStripper)) {
        //       return new CommentStripper(config)
        // }

        return false
    }
}

export default TextProcessorsFactory