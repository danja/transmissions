// JsonRestructurer.js
/// Helper for Restructure.js

import logger from '../../utils/Logger.js'

class JsonRestructurer {
    constructor(mappings) {
        //   logger.setLogLevel('info')
        if (!mappings?.mappings || !Array.isArray(mappings.mappings)) {
            throw new Error('JsonRestructurer : Invalid mapping structure')
        }
        this.mappings = mappings.mappings
        logger.debug('JsonRestructurer,  this.mappings = ' + this.mappings)
        logger.reveal(this.mappings)
    }

    getValueByPath(obj, path) {
        logger.debug('JsonRestructurer, path = ' + path)
        //  logger.debug('JsonRestructurer, OBJECT = ' + obj)

        //        logger.reveal(obj)
        //      logger.debug('JsonRestructurer, OBJECT = ^^^^')

        //   logger.debug('JsonRestructurer, obj.item.chat_messages = ' + obj.item.chat_messages)
        try {
            const sp = path.split('.')
            logger.debug('JsonRestructurer, sp = ' + sp)
            const reduced = sp.reduce((acc, part) => acc[part], obj)
            logger.debug('JsonRestructurer, reduced = ' + reduced)
            return reduced
        } catch (e) {
            logger.warn(`Warning: JsonRestructurer.getValueByPath, path ${path} not found`)
            return undefined
        }
    }

    setValueByPath(obj, path, value) {
        logger.debug(`JsonRestructurer.setValueByPath, obj = ${obj}, path = ${path}, value = ${value}`)
        const parts = path.split('.')
        const last = parts.pop()
        const target = parts.reduce((acc, part) => {
            acc[part] = acc[part] || {}
            return acc[part]
        }, obj)
        logger.debug(`JsonRestructurer.setValueByPath, target = ${target}, last = ${last}, value = ${value}`)
        target[last] = value
    }

    restructure(inputData) {
        //   logger.log(`typeof inputData = ${typeof inputData}`)
        if (typeof inputData === 'string') {
            try {
                inputData = JSON.parse(inputData)
            } catch (e) {
                throw new Error('Invalid JSON string provided')
            }
        }
        // logger.reveal(inputData)
        //  process.exit(0)
        const result = {}
        this.mappings.forEach(({ pre, post }) => {
            logger.log(`PRE = ${pre}, POST = ${post}`)
            const value = this.getValueByPath(inputData, pre)
            // logger.log(`PRE = ${pre}, POST = ${post} value = ${value}`)
            if (value !== undefined) {
                this.setValueByPath(result, post, value)
            }
        })
        //    logger.log('RESULT%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%55')
        //  logger.reveal(result)
        // logger.log('RESULT ^^^^')
        return result
    }
}
export default JsonRestructurer