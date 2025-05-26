// JsonRestructurer.js
/// Helper for Restructure.js
// TODO move to utils/JSONUtils.js

import logger from '../../utils/Logger.js'

// src/processors/json/JsonRestructurer.js
/**
 * @class JsonRestructurer
 * @classdesc
 * **Helper for Restructure.js**
 *
 * Maps and restructures JSON objects according to a set of mapping rules.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`mappings`** - Array of mapping rules specifying how to restructure the JSON object
 *
 * #### __*Input*__
 * * **`obj`** - JSON object to be restructured
 * * **`path`** - Dot-separated path string for value lookup
 *
 * #### __*Output*__
 * * **`obj`** - JSON object with fields potentially restructured or values extracted
 *
 * #### __*Behavior*__
 * * Uses mapping rules to extract and restructure fields from the input object
 * * Provides utility to get values by path
 *
 * #### __*Side Effects*__
 * * None
 *
 * #### __*Tests*__
 * * **`npm test -- tests/unit/json-restructurer-test.spec.js`**
 *
 * #### __*ToDo*__
 * * Move to utils/JSONUtils.js
 */

class JsonRestructurer {
    constructor(mappings) {
        if (!mappings?.mappings || !Array.isArray(mappings.mappings)) {
            throw new Error('JsonRestructurer : Invalid mapping structure')
        }
        this.mappings = mappings.mappings
        logger.debug('JsonRestructurer,  this.mappings = ' + this.mappings)
        //    logger.reveal(this.mappings)
    }

    getValueByPath(obj, path, caller) {
        logger.debug(`JsonRestructurer.getValueByPath, \n    path = ` + path)

        try {
            const sp = path.split('.')
            logger.debug('    sp = ' + sp)
            const reduced = sp.reduce((acc, part) => acc[part], obj)
            //         logger.debug('    reduced = ' + reduced)
            return reduced
        } catch (e) {
            logger.reveal(obj)
            logger.warn(`${e},
    path ${path} not found.
                `)
            logger.debug(`    caller : ${caller}`)
            return undefined
        }
    }

    setValueByPath(obj, path, value) {
        logger.debug(`JsonRestructurer.setValueByPath 
    obj = ${obj} 
    path = ${path} 
    value = ${value}`)
        const parts = path.split('.')
        const last = parts.pop()
        const target = parts.reduce((acc, part) => {
            acc[part] = acc[part] || {}
            return acc[part]
        }, obj)
        logger.debug(`    target = ${JSON.stringify(target)}
    last = ${last}
    value = ${value}`)
        target[last] = value
    }

    restructure(inputData, caller) {
        logger.debug(`\nJsonRestructurer.restructure, \n    inputData = ${inputData}`)
        if (typeof inputData === 'string') {
            try {
                inputData = JSON.parse(inputData)
            } catch (e) {
                throw new Error('Invalid JSON string provided')
            }
        }

        const result = {}
        this.mappings.forEach(({ pre, post }) => {
            const value = this.getValueByPath(inputData, pre, caller)
            logger.debug(`    pre = ${pre}
    post = ${post}
    value = ${value}`)
            if (value !== undefined) {
                this.setValueByPath(result, post, value)
            }
        })
        return result
    }
}
export default JsonRestructurer