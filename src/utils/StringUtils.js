import logger from './Logger.js'

class StringUtils {

    // const markdownFiles = files.filter(file => matchesPattern(file, '*.md'));
    static matchPatterns(str, patterns) {
        logger.trace(`StringUtils.matchPatterns, patterns = ${patterns}`)
        const matches = patterns.filter(pattern => this.matchesPattern(str, pattern))
        if (matches.length > 0) {
            return matches
        }
        return false
    }

    // Convert glob pattern to regex
    static matchesPattern(str, pattern) {

        logger.trace(`StringUtils.matchesPattern, pattern = ${pattern}`)
        const regexPattern = pattern
            .replace(/\./g, '\\.')   // Escape dots
            .replace(/\*/g, '.*')   // Convert * to .*
        const regex = new RegExp(`^${regexPattern}$`)
        return regex.test(str)
    }
}
export default StringUtils