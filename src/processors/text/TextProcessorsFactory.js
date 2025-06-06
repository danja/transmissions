import ns from '../../utils/ns.js'

import LineReader from './LineReader.js'
import StringFilter from './StringFilter.js'
import StringReplace from './StringReplace.js'
import Templater from './Templater.js'
import Escaper from './Escaper.js'
import Concat from './Concat.js'
import Reverse from './Reverse.js'
import SetText from './SetText.js'

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
        if (type.equals(ns.trn.StringReplace)) {
            return new StringReplace(config)
        }
        if (type.equals(ns.trn.Escaper)) {
            return new Escaper(config)
        }
        if (type.equals(ns.trn.Concat)) {
            return new Concat(config)
        }
        if (type.equals(ns.trn.Reverse)) {
            return new Reverse(config)
        }
        if (type.equals(ns.trn.SetText)) {
            return new SetText(config)
        }
        return false
    }
}

export default TextProcessorsFactory