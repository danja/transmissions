// src/processors/flow/Choice.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import JSONUtils from '../../utils/JSONUtils.js'

/**
 * @class Choice
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor for Conditional Logic**
 *
 * Evaluates a condition and sets message properties based on the result, enabling
 * conditional branching within transmission pipelines.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.testProperty`** - Property name to test (e.g., "userType", "status")
 * * **`ns.trn.testOperator`** - Comparison operator: "equals", "contains", "greater", "less", "exists"
 * * **`ns.trn.testValue`** - Value to compare against (for equals, contains, greater, less)
 * * **`ns.trn.trueProperty`** - Property to set if condition is true
 * * **`ns.trn.trueValue`** - Value to set for true condition
 * * **`ns.trn.falseProperty`** - Property to set if condition is false
 * * **`ns.trn.falseValue`** - Value to set for false condition
 *
 * #### __*Input*__
 * * **`message`** - The message object containing properties to test
 *
 * #### __*Output*__
 * * **`message`** - Message with additional properties set based on the choice made
 *
 * #### __*Behavior*__
 * * Skips processing if `message.done` is true
 * * Evaluates the specified condition using testProperty, testOperator, and testValue
 * * Sets trueProperty=trueValue if condition is true
 * * Sets falseProperty=falseValue if condition is false
 * * Supports operators: equals, contains, greater, less, exists
 * * Enables downstream processors to react to the choice via message properties
 *
 * #### __*Side Effects*__
 * * Adds choice result properties to the message object
 * * Logs the condition evaluation and choice made
 *
 * #### __*Example Configuration*__
 * ```turtle
 * :userRouter a :Choice ;
 *     :settings :userChoiceConfig .
 *
 * :userChoiceConfig a :ConfigSet ;
 *     :testProperty "userType" ;
 *     :testOperator "equals" ;
 *     :testValue "premium" ;
 *     :trueProperty "processingPath" ;
 *     :trueValue "premium-flow" ;
 *     :falseProperty "processingPath" ;
 *     :falseValue "standard-flow" .
 * ```
 */
class Choice extends Processor {
    constructor(config) {
        super(config)
    }

    /**
     * Evaluates a condition and sets message properties based on the result.
     * @param {Object} message - The message object to process
     * @returns {Promise} Resolves when processing is complete
     */
    async process(message) {
        logger.debug(`Choice.process starting`)

        // Get configuration properties
        const testProperty = this.getProperty(ns.trn.testProperty, undefined)
        const testOperator = this.getProperty(ns.trn.testOperator, 'equals')
        const testValue = this.getProperty(ns.trn.testValue, undefined)
        const trueProperty = this.getProperty(ns.trn.trueProperty, undefined)
        const trueValue = this.getProperty(ns.trn.trueValue, undefined)
        const falseProperty = this.getProperty(ns.trn.falseProperty, undefined)
        const falseValue = this.getProperty(ns.trn.falseValue, undefined)

        logger.debug(`Choice config: testProperty="${testProperty}", testOperator="${testOperator}", testValue="${testValue}"`)
        logger.debug(`Choice config: trueProperty="${trueProperty}", trueValue="${trueValue}"`)
        logger.debug(`Choice config: falseProperty="${falseProperty}", falseValue="${falseValue}"`)


        if (!testProperty) {
            logger.warn(`Choice: No testProperty specified, skipping condition evaluation`)
            return this.emit('message', message)
        }

        // Get the value to test from the message (supports nested paths)
        const messageValue = JSONUtils.get(message, testProperty)

        // Evaluate the condition
        const conditionResult = this.evaluateCondition(messageValue, testOperator || 'equals', testValue)

        logger.debug(`Choice: ${testProperty}="${JSON.stringify(messageValue)}" ${testOperator} "${testValue}" = ${conditionResult}`)

        // Apply the choice result
        if (conditionResult) {
            if (trueProperty && trueValue !== undefined) {
                // Try to get value from message path
                let actualTrueValue = JSONUtils.get(message, trueValue)
                // Only set if value exists, or if it's a simple literal (no dots/brackets)
                if (actualTrueValue !== undefined) {
                    JSONUtils.set(message, trueProperty, actualTrueValue)
                    logger.debug(`Choice: TRUE - Set ${trueProperty}="${actualTrueValue}"`)
                } else if (!trueValue.includes('.') && !trueValue.includes('[')) {
                    // Simple literal value (not a path)
                    JSONUtils.set(message, trueProperty, trueValue)
                    logger.debug(`Choice: TRUE - Set ${trueProperty}="${trueValue}"`)
                } else {
                    logger.debug(`Choice: TRUE - Skipping set, ${trueValue} not found in message`)
                }
            }
        } else {
            if (falseProperty && falseValue !== undefined) {
                // Try to get value from message path
                let actualFalseValue = JSONUtils.get(message, falseValue)
                // Only set if value exists, or if it's a simple literal (no dots/brackets)
                if (actualFalseValue !== undefined) {
                    JSONUtils.set(message, falseProperty, actualFalseValue)
                    logger.debug(`Choice: FALSE - Set ${falseProperty}="${actualFalseValue}"`)
                } else if (!falseValue.includes('.') && !falseValue.includes('[')) {
                    // Simple literal value (not a path)
                    JSONUtils.set(message, falseProperty, falseValue)
                    logger.debug(`Choice: FALSE - Set ${falseProperty}="${falseValue}"`)
                } else {
                    logger.debug(`Choice: FALSE - Skipping set, ${falseValue} not found in message`)
                }
            }
        }

        return this.emit('message', message)
    }

    /**
     * Evaluates a condition using the specified operator
     * @param {any} messageValue - Value from the message to test
     * @param {string} operator - Comparison operator
     * @param {any} testValue - Value to compare against
     * @returns {boolean} Result of the condition evaluation
     */
    evaluateCondition(messageValue, operator, testValue) {
        switch (operator.toLowerCase()) {
            case 'equals':
                return messageValue == testValue

            case 'contains':
                return String(messageValue || '').includes(String(testValue || ''))

            case 'greater':
                return Number(messageValue) > Number(testValue)

            case 'less':
                return Number(messageValue) < Number(testValue)

            case 'exists':
                if (Array.isArray(messageValue)) {
                    return messageValue.length > 0
                }
                return messageValue !== undefined && messageValue !== null && messageValue !== ''

            default:
                logger.warn(`Choice: Unknown operator "${operator}", defaulting to equals`)
                return messageValue == testValue
        }
    }
}
export default Choice