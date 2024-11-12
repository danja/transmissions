// JsonRestructurer.js

import logger from '../../utils/Logger.js'

class JsonRestructurer {
    constructor(mappings) {
        logger.setLogLevel('info')
        if (!mappings?.mappings || !Array.isArray(mappings.mappings)) {
            throw new Error('Invalid mapping structure')
        }
        this.mappings = mappings.mappings
        logger.debug('JsonRestructurer,  this.mappings = ' + this.mappings)
        logger.reveal(this.mappings)
    }

    getValueByPath(obj, path) {
        logger.debug('JsonRestructurer, path = ' + path)
        //   logger.reveal(obj)
        try {

            return path.split('.').reduce((acc, part) => acc[part], obj)
        } catch (e) {
            logger.warn(`Warning: Path ${path} not found`)
            return undefined
        }
    }

    setValueByPath(obj, path, value) {
        const parts = path.split('.')
        const last = parts.pop()
        const target = parts.reduce((acc, part) => {
            acc[part] = acc[part] || {}
            return acc[part]
        }, obj)
        target[last] = value
    }

    restructure(inputData) {
        if (typeof inputData === 'string') {
            try {
                inputData = JSON.parse(inputData)
            } catch (e) {
                throw new Error('Invalid JSON string provided')
            }
        }

        const result = {}
        this.mappings.forEach(({ pre, post }) => {
            const value = this.getValueByPath(inputData, pre)
            if (value !== undefined) {
                this.setValueByPath(result, post, value)
            }
        })

        return result
    }
}
export default JsonRestructurer