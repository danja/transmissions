import logger from '../utils/Logger.js'

class Whiteboard {
    constructor() {
        this.cache = {}
        this.accumulators = {}
        if (Whiteboard.singleInstance) {
            return Whiteboard.singleInstance
        }
        Whiteboard.singleInstance = this
    }

    put(key, value) {
        this.cache[key] = value
    }

    get(key) {
        return this.cache[key]
    }


    accumulate(label, value) {
        var acc = this.accumulators[label]
        switch (typeof acc) {
            case 'object':
                this.accumulators[label].push(value)
                break
            case 'array':
                this.accumulators[label].push(value)
                break
            default:
                this.accumulators[label] = `${acc}${value}`
        }
        return this.accumulators[label]
    }

    getAccumulator(label, type) {
        if (!this.accumulators[label]) {
            switch (type) {
                case 'object': // is needed?
                    this.accumulators[label] = []
                    break
                case 'array':
                    this.accumulators[label] = []
                    break
                default:
                    this.accumulators[label] = ''
            }
        }
        return this.accumulators[label]
    }

    toString() {
        var string = '--- Whiteboard ---'
        for (key in accumulators.keys()) {
            string = `${string}\n${key} = ${accumulators[key]}`
        }
        return `${string}\n------------------`
    }
}

export default Whiteboard