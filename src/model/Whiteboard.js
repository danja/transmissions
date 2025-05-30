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
        if (value === undefined || value === null) {
            return this.accumulators[label];
        }
        
        const acc = this.accumulators[label];
        
        // Handle array/object accumulation
        if (Array.isArray(acc)) {
            acc.push(value);
        } 
        // Handle string accumulation
        else if (typeof acc === 'string' || acc === undefined) {
            // Initialize if undefined
            if (acc === undefined) {
                this.accumulators[label] = '';
            }
            // Convert value to string and append
            this.accumulators[label] += String(value);
        } 
        // Handle other object types
        else if (acc !== null && typeof acc === 'object') {
            if (Array.isArray(acc)) {
                acc.push(value);
            } else if (acc.push) {
                acc.push(value);
            } else {
                // For plain objects, merge properties
                Object.assign(acc, value);
            }
        }
        
        return this.accumulators[label];
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