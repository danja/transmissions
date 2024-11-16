import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'
import ns from '../../utils/ns.js'

class Blanker extends Processor {
    constructor(config) {
        super(config)
        this.blankValue = config.blankValue || ''
    }

    blankValues(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.blankValues(item))
        } else if (typeof obj === 'object' && obj !== null) {
            const result = {}
            for (const [key, value] of Object.entries(obj)) {
                result[key] = this.blankValues(value)
            }
            return result
        } else if (typeof obj === 'string') {
            return ''
        }
        return obj
    }

    async process(message) {
        try {
            const pointer = this.getPropertyFromMyConfig(ns.trm.pointer)

            if (!pointer) {
                // Blank entire message if no pointer specified
                message = this.blankValues(message)
            } else {
                // Get the nested object using the pointer
                const parts = pointer.toString().split('.')
                let target = message

                // Navigate to the target object
                for (let i = 0; i < parts.length - 1; i++) {
                    target = target[parts[i]]
                    if (!target) break
                }

                // Blank values in the target object
                if (target && target[parts[parts.length - 1]]) {
                    target[parts[parts.length - 1]] =
                        this.blankValues(target[parts[parts.length - 1]])
                }
            }

            return this.emit('message', message)
        } catch (err) {
            logger.error("Blanker processor error: " + err.message)
            throw err
        }
    }
}

export default Blanker