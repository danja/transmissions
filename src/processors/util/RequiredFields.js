// src/processors/util/RequiredFields.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import JSONUtils from '../../utils/JSONUtils.js'

/**
 * @class RequiredFields
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Skips messages that do not contain required fields.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.requiredFields`** - Comma-separated list of required fields
 * * **`ns.trn.skipOnHttpError`** - Skip if message.httpError exists (default: 'true')
 *
 * #### __*Output*__
 * * Message is not emitted when required fields are missing.
 */
class RequiredFields extends Processor {
  constructor(config) {
    super(config)
  }

  async process(message) {
    logger.debug('RequiredFields.process')

    if (message.done) {
      return this.emit('message', message)
    }

    const skipOnHttpError = super.getProperty(ns.trn.skipOnHttpError, 'true') !== 'false'
    if (skipOnHttpError && message.httpError) {
      logger.warn(`RequiredFields: Skipping due to httpError: ${message.httpError}`)
      return
    }

    const required = super.getProperty(ns.trn.requiredFields, '')
    const fields = String(required)
      .split(',')
      .map(field => field.trim())
      .filter(Boolean)

    for (const field of fields) {
      const value = JSONUtils.get(message, field)
      if (value === undefined || value === null || value === '') {
        logger.warn(`RequiredFields: Missing ${field}, skipping message`)
        message.skipReason = `Missing required field: ${field}`
        return
      }
    }

    return this.emit('message', message)
  }
}

export default RequiredFields
