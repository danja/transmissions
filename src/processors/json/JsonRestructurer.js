// JsonRestructurer.js
/// Helper for Restructure.js
// TODO move to utils/JSONUtils.js

import logger from '../../utils/Logger.js'

class JsonRestructurer {
    constructor(mappings) {
        if (!mappings?.mappings || !Array.isArray(mappings.mappings)) {
            throw new Error('JsonRestructurer : Invalid mapping structure')
        }
        this.mappings = mappings.mappings
        logger.trace('JsonRestructurer,  this.mappings = ' + this.mappings)
        //    logger.reveal(this.mappings)
    }

    getValueByPath(obj, path) {
        logger.trace('JsonRestructurer, path = ' + path)

        try {
            const sp = path.split('.')
            logger.trace('JsonRestructurer, sp = ' + sp)
            const reduced = sp.reduce((acc, part) => acc[part], obj)
            logger.trace('JsonRestructurer, reduced = ' + reduced)
            return reduced
        } catch (e) {
            logger.warn(`Warning: JsonRestructurer.getValueByPath, path ${path} not found`)
            return undefined
        }
    }

    setValueByPath(obj, path, value) {
        logger.trace(`JsonRestructurer.setValueByPath, obj = ${obj}, path = ${path}, value = ${value}`)
        const parts = path.split('.')
        const last = parts.pop()
        const target = parts.reduce((acc, part) => {
            acc[part] = acc[part] || {}
            return acc[part]
        }, obj)
        logger.trace(`JsonRestructurer.setValueByPath, target = ${target}, last = ${last}, value = ${value}`)
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
            logger.trace(`PRE = ${pre}, POST = ${post}`)
            const value = this.getValueByPath(inputData, pre)
            // logger.log(`PRE = ${pre}, POST = ${post} value = ${value}`)
            if (value !== undefined) {
                this.setValueByPath(result, post, value)
            }
        })
        return result
    }
}
export default JsonRestructurer