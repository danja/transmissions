/**
 * Logger utility, wraps `loglevel` lib, does some formatting, and deals with output.
 * Supports both Node.js and browser environments.
 */
import log from 'loglevel'
import { isBrowser } from './BrowserUtils.js'
import ns from './ns.js'

// the global logger object
const logger = {}

// where it goes
logger.logfile = 'run.log'

logger.currentLogLevel = "warn"

// Conditionally import Node.js modules
let fs, chalk
if (!isBrowser()) {
    try {
        fs = await import('fs')
        chalk = await import('chalk')
    } catch (e) {
        // Handle import errors - will use fallbacks
    }
}

/**
 * Resets the log file by truncating it to zero length.
 */
logger.resetLogFile = () => {
    if (!isBrowser() && fs) {
        try {
            fs.writeFileSync(logger.logfile, '')
        } catch (error) {
            console.error('Error resetting log file:', error)
        }
    }
}

// Reset log file at startup
if (!isBrowser()) {
    logger.resetLogFile()
}

// Fallback chalk for browser
const browserChalk = {
    cyan: (text) => `%c${text}`,
    red: (text) => `%c${text}`,
    green: (text) => `%c${text}`,
    yellow: (text) => `%c${text}`,
    magentaBright: (text) => `%c${text}`,
    dim: (text) => `%c${text}`,
    bold: (text) => `%c${text}`,
    bgYellow: {
        black: (text) => `%c${text}`
    },
    red: {
        bold: (text) => `%c${text}`,
        italic: (text) => `%c${text}`
    }
}

// Use appropriate chalk implementation
const chalkImpl = isBrowser() ? browserChalk : (chalk?.default || browserChalk)


/**
 * Log styles for different log levels.
 * @type {Object<string, Function>}
 */
const LOG_STYLES = {
    "trace": chalkImpl.bgGray?.greenBright || ((text) => `%c${text}`),
    "debug": chalkImpl.cyanBright || ((text) => `%c${text}`),
    "info": chalkImpl.white || ((text) => `%c${text}`),
    "warn": chalkImpl.red?.italic || ((text) => `%c${text}`),
    "error": chalkImpl.red?.bold || ((text) => `%c${text}`)
}

/**
 * Supported log levels.
 * @type {string[]}
 */
const LOG_LEVELS = ["trace", "debug", "info", "warn", "error"]

log.setLevel(logger.currentLogLevel)

/**
 * Gets the current log level.
 * @returns {string} The current log level.
 */
logger.getLevel = () => log.getLevel()

/**
 * Enables all log levels.
 */
logger.enableAll = () => log.enableAll()

/**
 * Disables all log levels.
 */
logger.disableAll = () => log.disableAll()

/**
 * Sets the default log level.
 * @param {string} level - The log level to set as default.
 */
logger.setDefaultLevel = (level) => log.setDefaultLevel(level)

logger.getLogger = (name) => {
    const namedLogger = log.getLogger(name)
    return wrapLogger(namedLogger, name)
}

logger.methodFactory = log.methodFactory

logger.noConflict = () => log.noConflict()

/**
 * Wraps a base logger with additional functionality.
 * @param {Object} baseLogger - The base logger to wrap.
 * @param {string} [name='root'] - The name of the logger.
 * @returns {Object} The wrapped logger.
 */
function wrapLogger(baseLogger, name = 'root') {
    const wrapped = {}

    wrapped.log = function (msg, level = "info") {
        const timestamp = chalkImpl.dim ? chalkImpl.dim(`[${logger.timestampISO()}]`) : `[${logger.timestampISO()}]`
        const levelStyle = LOG_STYLES[level] || LOG_STYLES["info"]
        const levelTag = levelStyle(`[${level.toUpperCase()}]`)
        const nameTag = chalkImpl.green ? chalkImpl.green(`[${name}]`) : `[${name}]`
        const message = levelStyle(msg)

        const consoleMessage = `${message}`
        const fileMessage = `[${logger.timestampISO()}] [${level.toUpperCase()}] [${name}] - ${msg}`

        baseLogger[level](consoleMessage)
        logger.appendLogToFile(fileMessage)
    }

    LOG_LEVELS.forEach(level => {
        wrapped[level] = (msg) => wrapped.log(msg, level)
    })

    wrapped.getLevel = () => baseLogger.getLevel()
    wrapped.setLevel = (level, persist) => baseLogger.setLevel(level, persist)
    wrapped.setDefaultLevel = (level) => baseLogger.setDefaultLevel(level)
    wrapped.enableAll = () => baseLogger.enableAll()
    wrapped.disableAll = () => baseLogger.disableAll()
    wrapped.methodFactory = baseLogger.methodFactory
    wrapped.setMethodFactory = function (factory) {
        baseLogger.methodFactory = factory
        baseLogger.rebuild()
    }

    return wrapped
}

/**
 * Appends a log message to the log file.
 * @param {string} message - The message to append.
 */
logger.appendLogToFile = function (message) {
    if (logger.logfile && !isBrowser() && fs) {
        try {
            fs.appendFileSync(logger.logfile, message + '\n', 'utf8')
        } catch (e) {
            console.warn('Failed to write to log file:', e)
        }
    }
}

/**
 * Sets the log level.
 * @param {string} [logLevel="warn"] - The log level to set.
 * @param {boolean} [persist=true] - Whether to persist the log level.
 */
logger.setLogLevel = function (logLevel = "warn", persist = true) {
    logger.currentLogLevel = logLevel
    log.setLevel(logLevel, persist)
}


/**
 * Gets the current timestamp in ISO format.
 * @returns {string} The current timestamp.
 */
logger.timestampISO = function () {
    return new Date().toISOString()
}

/**
 * Logs a message at the specified level.
 * @param {string} msg - The message to log.
 * @param {string} [level="info"] - The log level.
 */
logger.log = function (msg, level = "info") {
    const levelStyle = LOG_STYLES[level] || LOG_STYLES["info"]
    const message = levelStyle(msg)
    const consoleMessage = `${message}`
    const fileMessage = `[${logger.timestampISO()}] [${level.toUpperCase()}] [root] - ${msg}`
    try {
        log[level](consoleMessage)
        logger.appendLogToFile(fileMessage)
    } catch (err) {
        console.log(`Logger error: ${err.message}`)
    }
}

// shorter shortening
logger.sh = function (string) {
    string = logger.shorter(string)
    logger.log(string)
}

/**
 * Shortens an RDF string using namespace prefixes.
 * @param {string} rdfString - The RDF string to shorten.
 * @returns {string} The shortened RDF string.
 */
logger.shorter = function (rdfString) {
    rdfString = rdfString.toString() // defensive
    rdfString = rdfString.replaceAll('http://www.w3.org/1999/02/22-rdf-syntax-ns#type', chalkImpl.white('a'))
    if (!rdfString) return chalkImpl.red ? chalkImpl.red('undefined') : 'undefined'
    rdfString = rdfString.toString()
    Object.entries(ns.prefixMap).forEach(([key, value]) => {

        rdfString = rdfString.replaceAll(key, chalkImpl.green ? chalkImpl.green(value) : value)

    })

    return chalkImpl.magentaBright ? chalkImpl.magentaBright(rdfString) : rdfString
}

/*
logger.reveal = function (instance, verbose = true) {
    if (!instance) return

    try {
        const cache = new WeakSet()

        const customReplacer = (key, value) => {
            if (key === 'transmission' || key === 'config' || key === 'dataset' || key === 'app') {
                return `[${key}: circular ref]`
            }

            if (typeof value === 'object' && value !== null) {
                if (cache.has(value)) {
                    return '[Circular]'
                }
                cache.add(value)
            }

            if (isBrowser() && value instanceof ArrayBuffer) {
                return '[ArrayBuffer]'
            } else if (!isBrowser() && Buffer && Buffer.isBuffer(value)) {
                return value.toString()
            }

            if (typeof value === 'string' && value.length > 100) {
                try {
                    return value.substring(0, 100) + '...'
                } catch (e) {
                    return value.slice(0, 99)
                }
            }

            return value
        }

        const serialized = {}

        const loglevel = logger.getLevel()
        logger.setLogLevel('trace')

        for (const key in instance) {
            if (key === 'app') {
                logger.log(chalkImpl.yellow ? chalkImpl.yellow(chalkImpl.bold('.app :')) : '.app :', 'debug')
                continue
            }

            if (key.startsWith('_')) {
                logger.log(`       ${key}`, 'debug')
                continue
            }

            if (instance.hasOwnProperty(key)) {
                serialized[key] = instance[key]
            }
        }

        const props = JSON.stringify(serialized, customReplacer, 2)
        if (verbose) {
            const className = instance.constructor?.name || typeof instance
            logger.log(`Instance of ${chalkImpl.yellow ? chalkImpl.yellow(chalkImpl.bold(className)) : className} with properties - `)
        }
        logger.log(`${chalkImpl.yellow ? chalkImpl.yellow(props) : props}`)
        logger.setLogLevel(loglevel)
    } catch (error) {
        logger.error(`Error in reveal: ${error.message}`)
        logger.log(`Failed to stringify object of type: ${instance.constructor?.name || typeof instance}`)
        logger.setLogLevel('debug')

        logger.log("Properties (keys only):")
        try {
            for (const key in instance) {
                if (instance.hasOwnProperty(key)) {
                    logger.log(`- ${key}: [${typeof instance[key]}]`)
                }
            }
        } catch (e) {
            logger.error(`Even simple inspection failed: ${e.message}`)
        }
    }
}
*/



LOG_LEVELS.forEach(level => {
    logger[level] = (msg) => logger.log(msg, level)
})


/**
 * Reveals the properties of an object as a formatted string. Fancy version of JSON.stringify.
 * Handles circular references, large strings, and optionally RDF datasets.
 * @param {Object} instance - The object to reveal.
 * @param {boolean} [verbose=true] - Whether to include detailed information.
 * @returns {string} The formatted string representation of the object.
 */
logger.reveal = function (instance, verbose = true, revealDatasets = false) {
    if (!instance) return ''

    try {
        const cache = new WeakSet()

        const customReplacer = (key, value) => {
            // Detect RDF datasets by checking for specific methods or properties
            if (value && typeof value === 'object' && typeof value.match === 'function' && typeof value.add === 'function') {
                if (logger.revealDatasets) {
                    return logger.dataset(value) // Call Logger.dataset to reveal the dataset
                }
                return '[RDF Dataset: Skipped]'
            }

            if (typeof value === 'object' && value !== null) {
                if (cache.has(value)) {
                    return '[Circular]'
                }
                cache.add(value)
            }

            if (isBrowser() && value instanceof ArrayBuffer) {
                return '[ArrayBuffer]'
            } else if (!isBrowser() && Buffer && Buffer.isBuffer(value)) {
                return value.toString()
            }

            if (typeof value === 'string' && value.length > 100) {
                try {
                    return value.substring(0, 100) + '...'
                } catch (e) {
                    return value.slice(0, 99)
                }
            }

            return value
        }

        const serialized = {}
        let output = ''

        for (const key in instance) {
            if (key === 'app') {
                output += `${chalkImpl.yellow ? chalkImpl.yellow(chalkImpl.bold('.app :')) : '.app :'}\n`
                continue
            }

            if (key.startsWith('_')) {
                output += `       ${key}\n`
                continue
            }

            if (instance.hasOwnProperty(key)) {
                serialized[key] = instance[key]
            }
        }

        const props = JSON.stringify(serialized, customReplacer, 2)
        if (verbose) {
            const className = instance.constructor?.name || typeof instance
            output += `Instance of ${chalkImpl.yellow ? chalkImpl.yellow(chalkImpl.bold(className)) : className} with properties - \n`
        }
        output += `${chalkImpl.yellow ? chalkImpl.yellow(props) : props}\n`

        return output
    } catch (error) {
        let errorOutput = `Error in reveal: ${error.message}\n`
        errorOutput += `Failed to stringify object of type: ${instance.constructor?.name || typeof instance}\n`

        errorOutput += "Properties (keys only):\n"
        try {
            for (const key in instance) {
                if (instance.hasOwnProperty(key)) {
                    errorOutput += `- ${key}: [${typeof instance[key]}]\n`
                }
            }
        } catch (e) {
            errorOutput += `Even simple inspection failed: ${e.message}\n`
        }

        return errorOutput
    }
}

/**
 * Reveals the contents of an RDF dataset as a formatted string.
 * @param {Object} dataset - The RDF dataset to reveal.
 * @returns {string} The formatted string representation of the dataset.
 */
logger.dataset = function (dataset) {
    if (!dataset || typeof dataset.match !== 'function') {
        logger.log('[Not a valid RDF Dataset]', 'warn')
        return
    }

    logger.log('RDF Dataset:', 'info')
    for (const quad of dataset) {
        logger.log(
            `${chalkImpl.red(logger.shorter(quad.subject.value))} ` +
            `${chalkImpl.cyan(logger.shorter(quad.predicate.value))} ` +
            `${chalkImpl.magenta(logger.shorter(quad.object.value))} .`,
            'info'
        )
    }
}

/**
 * Logs the properties of an object using `logger.reveal`.
 * @param {Object} instance - The object to log.
 * @param {boolean} [verbose=true] - Whether to include detailed information.
 */
logger.v = function (instance, verbose = true) {
    const output = logger.reveal(instance, verbose)
    logger.log(output)
}

/**
 * Logs the properties of an object using `logger.reveal`.
 * @param {Object} instance - The object to log.
 * @param {boolean} [verbose=true] - Whether to include detailed information.
 */
logger.rv = function (instance) {
    logger.revealDatasets = true
    const output = logger.reveal(instance, true, true)
    logger.log(output)
}

/**
 * Explores and logs the properties of a Grapoi object and its path.
 * @param {Object} grapoi - The Grapoi object to explore.
 * @param {Array} predicates - The predicates to use for path exploration.
 * @param {Array} objects - The objects to use for path exploration.
 * @param {Array} subjects - The subjects to use for path exploration.
 */
logger.poi = function exploreGrapoi(grapoi, predicates, objects, subjects) {
    console.log(chalkImpl.bold ? chalkImpl.bold('Properties of the Grapoi object:') : 'Properties of the Grapoi object:')
    for (const prop in grapoi) {
        console.log(chalkImpl.cyan ? chalkImpl.cyan(`\t${prop}: ${grapoi[prop]}`) : `\t${prop}: ${grapoi[prop]}`)
    }

    console.log(chalkImpl.bold ? chalkImpl.bold('\nPath:') : '\nPath:')
    const path = grapoi.out(predicates, objects).in(predicates, subjects)
    for (const quad of path.quads()) {
        console.log(chalkImpl.cyan ? chalkImpl.cyan(`\t${quad.predicate.value}: ${quad.object.value}`) : `\t${quad.predicate.value}: ${quad.object.value}`)
    }
}

// Only add event handlers in Node.js environment
if (!isBrowser()) {
    function handleExit(options, exitCode) {
        if (options.cleanup) {
            // Cleanup tasks
        }
        if (exitCode || exitCode === 0) console.log(exitCode)
        if (options.exit) process.exit()
    }

    if (typeof process !== 'undefined') {
        process.on('exit', handleExit.bind(null, { cleanup: true }))
        process.on('SIGINT', handleExit.bind(null, { exit: true }))
        process.on('SIGUSR1', handleExit.bind(null, { exit: true }))
        process.on('SIGUSR2', handleExit.bind(null, { exit: true }))
        process.on('uncaughtException', handleExit.bind(null, { exit: true }))
    }
}

export default logger