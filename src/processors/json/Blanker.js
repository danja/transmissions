import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'
import ns from '../../utils/ns.js'

class Blanker extends Processor {
    constructor(config) {
        super(config)
        //    logger.setLogLevel('debug')
        logger.debug(config.blankValue)
        this.blankValue = config.blankValue || ''
    }

    async process(message) {
        const pointer = this.getPropertyFromMyConfig(ns.trm.pointer)
        const preserve = this.getPropertyFromMyConfig(ns.trm.preserve)

        var preservePath = preserve.value ? preserve.value : 'nonono'

        logger.debug(`Blanker.process,  typeof preservePath = ${typeof preservePath}, preservePath = ${preservePath}`)
        logger.reveal(preservePath)
        if (!pointer) {
            if (preservePath) {
                message = this.blankValues(message, '', preservePath)
            } else {
                message = this.blankAllValues(message)
            }
        } else {
            const parts = pointer.toString().split('.')
            let target = message

            for (let i = 0; i < parts.length - 1; i++) {
                target = target[parts[i]]
                if (!target) break
            }

            if (target && target[parts[parts.length - 1]]) {
                if (preservePath) {
                    target[parts[parts.length - 1]] =
                        this.blankValues(target[parts[parts.length - 1]], parts.join('.'), preservePath)
                } else {
                    target[parts[parts.length - 1]] =
                        this.blankAllValues(target[parts[parts.length - 1]])
                }
            }
        }

        return this.emit('message', message)
    }

    shouldPreserve(path, preservePath) {
        logger.debug(`Blanker.shouldPreserve path = ${path}, preservePath = ${preservePath}`)
        if (!preservePath) return false
        const pathParts = path.split('.')
        const preserveParts = preservePath.split('.')

        if (pathParts.length < preserveParts.length) return false

        for (let i = 0; i < preserveParts.length; i++) {
            if (pathParts[i] !== preserveParts[i]) return false
        }
        return true
    }

    // TODO refactor...can I be arsed?
    blankAllValues(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.blankAllValues(item))
        } else if (typeof obj === 'object' && obj !== null) {
            const result = {}
            for (const [key, value] of Object.entries(obj)) {
                result[key] = this.blankAllValues(value)
            }
            return result
        } else if (typeof obj === 'string') {
            return ''
        }
        return obj
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
                logger.debug(`Blanker.blankValues 1 newPath = ${newPath}, preservePath = ${preservePath}`)
                if (this.shouldPreserve(newPath, preservePath)) {
                    result[key] = value
                } else {
                    result[key] = this.blankValues(value, newPath, preservePath)
                }
            }
            return result
        } else if (typeof obj === 'string') {
            logger.debug(`Blanker.blankValues 2 currentPath = ${currentPath}, preservePath = ${preservePath}`)
            return this.shouldPreserve(currentPath, preservePath) ? obj : ''
        }
        return obj
    }
}

export default Blanker