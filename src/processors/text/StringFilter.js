import path from 'path'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'
import ns from '../../utils/ns.js'
import StringUtils from '../../utils/StringUtils.js'

class StringFilter extends Processor {
    constructor(config) {
        super(config)
    }

    // filepath maybe a good default, but..?
    async process(message) {
        if (message.done) {
            return this.emit('message', message)
        }

        if (!message.filepath) {
            logger.warn('StringFilter: No filepath provided')
            return
        }
        this.includePatterns = this.getValues(ns.trn.includePattern)
        this.excludePatterns = this.getValues(ns.trn.excludePattern)

        if (this.isAccepted(message.filepath)) {
            return this.emit('message', message)
        }
    }

    //matchPattern(filePath, pattern) {
    //  try {
    //    const regexPattern = pattern
    //      .replace(/\./g, '\\.')
    //    .replace(/\*/g, '.*')
    //  .replace(/\?/g, '.');
    //        const regex = new RegExp(`^${regexPattern}$`);
    //      const filename = path.basename(filePath);
    //    return regex.test(filename);
    //} catch (error) {
    //  logger.error('Pattern matching error:', { pattern, error });
    //return false;
    //  }
    // }

    isAccepted(filePath) {
        if (!filePath) return false

        if (this.excludePatterns.length === 0 && this.includePatterns.length === 0) {
            return true
        }

        /*
        for (const pattern of this.excludePatterns) {
            if (this.matchPattern(filePath, pattern)) {
                logger.debug(`File ${filePath} excluded by pattern ${pattern}`)
                return false
            }
        }
        */
        if (StringUtils.matchPatterns(filePath, this.excludePatterns)) {
            return false
        }

        if (StringUtils.matchPatterns(filePath, this.includePatterns)) {
            return true
        }

        /*
        if (this.includePatterns.length > 0) {
            for (const pattern of this.includePatterns) {
                if (this.matchPattern(filePath, pattern)) {
                    logger.debug(`File ${filePath} included by pattern ${pattern}`)
                    return true
                }
            }
            return false
        }
            */

        return true
    }
}

export default StringFilter