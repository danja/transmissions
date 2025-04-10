import log from 'loglevel'
import { isBrowser } from './BrowserUtils.js'
import ns from './ns.js'

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

const logger = {}

const LOG_STYLES = {
    "trace": chalkImpl.bgGray?.greenBright || ((text) => `%c${text}`),
    "debug": chalkImpl.cyanBright || ((text) => `%c${text}`),
    "info": chalkImpl.white || ((text) => `%c${text}`),
    "warn": chalkImpl.red?.italic || ((text) => `%c${text}`),
    "error": chalkImpl.red?.bold || ((text) => `%c${text}`)
}
const LOG_LEVELS = ["trace", "debug", "info", "warn", "error"]

logger.logfile = 'latest.log'
logger.currentLogLevel = "warn"

log.setLevel(logger.currentLogLevel)

logger.getLevel = () => log.getLevel()
logger.enableAll = () => log.enableAll()
logger.disableAll = () => log.disableAll()
logger.setDefaultLevel = (level) => log.setDefaultLevel(level)
logger.getLogger = (name) => {
    const namedLogger = log.getLogger(name)
    return wrapLogger(namedLogger, name)
}

logger.methodFactory = log.methodFactory

logger.noConflict = () => log.noConflict()

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

logger.appendLogToFile = function (message) {
    if (logger.logfile && !isBrowser() && fs) {
        try {
            fs.appendFileSync(logger.logfile, message + '\n', 'utf8')
        } catch (e) {
            console.warn('Failed to write to log file:', e)
        }
    }
}

logger.setLogLevel = function (logLevel = "warn", persist = true) {
    logger.currentLogLevel = logLevel
    log.setLevel(logLevel, persist)
}

logger.timestampISO = function () {
    return new Date().toISOString()
}

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

logger.sh = function (string) {
    string = logger.shorter(string)
    logger.log(string)
}

logger.shorter = function (rdfString) {
    if (!rdfString) return chalkImpl.red ? chalkImpl.red('undefined') : 'undefined'
    rdfString = rdfString.toString()
    Object.entries(ns.prefixMap).forEach(([key, value]) => {
        rdfString = rdfString.replaceAll(key, chalkImpl.green ? chalkImpl.green(value) : value)
    })
    return chalkImpl.magentaBright ? chalkImpl.magentaBright(rdfString) : rdfString
}

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

LOG_LEVELS.forEach(level => {
    logger[level] = (msg) => logger.log(msg, level)
})

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