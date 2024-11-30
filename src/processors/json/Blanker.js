import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'
import ns from '../../utils/ns.js'

class Blanker extends Processor {
    constructor(config) {
        super(config)
        this.blankValue = config.blankValue || ''
    }

    shouldPreserve(path, preservePath) {
        if (!preservePath) return false
        const pathParts = path.split('.')
        const preserveParts = preservePath.split('.')

        if (pathParts.length < preserveParts.length) return false

        for (let i = 0; i < preserveParts.length; i++) {
            if (pathParts[i] !== preserveParts[i]) return false
        }
        return true
    }

    blankValues(obj, currentPath = '', preservePath = '') {
        if (Array.isArray(obj)) {
            return obj.map((item, index) =>
                this.blankValues(item, `${currentPath}[${index}]`, preservePath)
            )
        } else if (typeof obj === 'object' && obj !== null) {
            const result = {}
            for (const [key, value] of Object.entries(obj)) {
                const newPath = currentPath ? `${currentPath}.${key}` : key
                if (this.shouldPreserve(newPath, preservePath)) {
                    result[key] = value
                } else {
                    result[key] = this.blankValues(value, newPath, preservePath)
                }
            }
            return result
        } else if (typeof obj === 'string') {
            return this.shouldPreserve(currentPath, preservePath) ? obj : ''
        }
        return obj
    }

    async process(message) {
        try {
            const pointer = this.getPropertyFromMyConfig(ns.trm.pointer)
            const preservePath = this.getPropertyFromMyConfig(ns.trm.preserve)

            if (!pointer) {
                message = this.blankValues(message, '', preservePath)
            } else {
                const parts = pointer.toString().split('.')
                let target = message

                for (let i = 0; i < parts.length - 1; i++) {
                    target = target[parts[i]]
                    if (!target) break
                }

                if (target && target[parts[parts.length - 1]]) {
                    target[parts[parts.length - 1]] =
                        this.blankValues(target[parts[parts.length - 1]], parts.join('.'), preservePath)
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