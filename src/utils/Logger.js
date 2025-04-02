import log from 'loglevel'
import fs from 'fs'
import chalk from 'chalk'
import ns from './ns.js'

const logger = {}

//  logger.log(`\n\nconfig dataset: ${[...config].map(q => `${q.subject.value} ${q.predicate.value} ${q.object.value}`).join('\n')}`)


// Map log levels to chalk styles
const LOG_STYLES = {
    "trace": chalk.bgGray.greenBright,
    "debug": chalk.cyanBright,
    "info": chalk.white,
    "warn": chalk.red.italic,
    "error": chalk.red.bold
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

    wrapped.log = function (msg, level = "info") {  // Changed default to info
        const timestamp = chalk.dim(`[${logger.timestampISO()}]`)
        const levelStyle = LOG_STYLES[level] || LOG_STYLES["info"]  // Fallback to info style
        const levelTag = levelStyle(`[${level.toUpperCase()}]`)
        const nameTag = chalk.green(`[${name}]`)
        const message = levelStyle(msg)

        //   const consoleMessage = `${timestamp} ${levelTag} ${nameTag} - ${message}`;
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
    if (logger.logfile) {
        fs.appendFileSync(logger.logfile, message + '\n', 'utf8')
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
        //   console.log(`level = ${level}`)
        // console.log(`consoleMessage = ${consoleMessage}`)

        log[level](consoleMessage)
        logger.appendLogToFile(fileMessage)
    } catch (err) {
        console.log(`wtf? ${err.message}`)
    }

}

// abbrev URLs in text - dirty version!
logger.sh = function (string) {
    // const loglevel = logger.getLevel()
    // logger.setLogLevel('trace')
    string = logger.shorter(string)
    logger.log(string)
}

logger.shorter = function (rdfString) {
    rdfString = rdfString.toString() // to be sure, to be sure
    Object.entries(ns.prefixMap).forEach(([key, value]) => {
        rdfString = rdfString.replaceAll(key, chalk.green(value))
    })
    return chalk.magentaBright(rdfString)
}

// TODO have this return a string
/*
logger.reveal = function (instance, verbose = true) {

    if (!instance) return

    const serialized = {}

    const loglevel = logger.getLevel()
    logger.setLogLevel('trace')

    for (const key in instance) {
        if (key === 'app') {
            logger.log(chalk.yellow(chalk.bold('message.app :')), 'debug')
            logger.reveal(instance[key], false)
            continue
        }
        if (key === 'dataset') {
            logger.log(chalk.yellow.italic('[[dataset found, skipping]]'), 'debug')
            continue
        }

        if (key.startsWith('_')) {
            logger.log(`       ${key}`, 'debug')
            continue
        }

        if (instance.hasOwnProperty(key)) {
            var value = instance[key]

            if (value) {
                if (Buffer.isBuffer(value)) {
                    value = value.toString()
                }
                if (value.length > 100) {
                    try {
                        value = value.substring(0, 100) + '...'
                    } catch (e) {
                        value = value.slice(0, 99)
                    }
                }

                serialized[key] = value

            } else {
                serialized[key] = '[no key]'
            }
        }
    }

    const props = JSON.stringify(serialized, null, 2)
    if (verbose) {
        logger.log(`Instance of ${chalk.yellow(chalk.bold(instance.constructor.name))} with properties - `)
    }
    logger.log(`${chalk.yellow(props)}`)
    logger.setLogLevel(loglevel)
}
*/
// Updated reveal function for src/utils/Logger.js
// Replace the existing reveal function with this one

logger.reveal = function (instance, verbose = true) {
    if (!instance) return;

    try {
        // Create a cache to store already-visited objects to avoid circular references
        const cache = new WeakSet();
        
        // Custom replacer function to handle circular references
        const customReplacer = (key, value) => {
            // Ignore special properties that lead to circular references
            if (key === 'transmission' || key === 'config' || key === 'dataset' || key === 'app') {
                return `[${key}: circular ref]`;
            }
            
            // Handle other objects that might be circular
            if (typeof value === 'object' && value !== null) {
                if (cache.has(value)) {
                    return '[Circular]';
                }
                cache.add(value);
            }
            
            // If it's a Buffer, convert to string
            if (Buffer.isBuffer(value)) {
                return value.toString();
            }
            
            // Truncate long strings
            if (typeof value === 'string' && value.length > 100) {
                try {
                    return value.substring(0, 100) + '...';
                } catch (e) {
                    return value.slice(0, 99);
                }
            }
            
            return value;
        };

        const serialized = {};

        const loglevel = logger.getLevel();
        logger.setLogLevel('trace');

        for (const key in instance) {
            if (key === 'app') {
                logger.log(chalk.yellow(chalk.bold('message.app :')), 'debug');
                continue;
            }
            
            if (key.startsWith('_')) {
                logger.log(`       ${key}`, 'debug');
                continue;
            }

            if (instance.hasOwnProperty(key)) {
                serialized[key] = instance[key];
            }
        }

        const props = JSON.stringify(serialized, customReplacer, 2);
        if (verbose) {
            logger.log(`Instance of ${chalk.yellow(chalk.bold(instance.constructor.name))} with properties - `);
        }
        logger.log(`${chalk.yellow(props)}`);
        logger.setLogLevel(loglevel);
    } catch (error) {
        logger.error(`Error in reveal: ${error.message}`);
        logger.log(`Failed to stringify object of type: ${instance.constructor?.name || typeof instance}`);
        logger.setLogLevel('debug');
        
        // Fallback to simple key listing
        logger.log("Properties (keys only):");
        try {
            for (const key in instance) {
                if (instance.hasOwnProperty(key)) {
                    logger.log(`- ${key}: [${typeof instance[key]}]`);
                }
            }
        } catch (e) {
            logger.error(`Even simple inspection failed: ${e.message}`);
        }
    }
}

LOG_LEVELS.forEach(level => {
    logger[level] = (msg) => logger.log(msg, level)
})

logger.poi = function exploreGrapoi(grapoi, predicates, objects, subjects) {
    console.log(chalk.bold('Properties of the Grapoi object:'))
    for (const prop in grapoi) {
        console.log(chalk.cyan(`\t${prop}: ${grapoi[prop]}`))
    }

    console.log(chalk.bold('\nPath:'))
    const path = grapoi.out(predicates, objects).in(predicates, subjects)
    for (const quad of path.quads()) {
        console.log(chalk.cyan(`\t${quad.predicate.value}: ${quad.object.value}`))
    }
}

function handleExit(options, exitCode) {
    if (options.cleanup) {
        // TODO cleanup
    }
    if (exitCode || exitCode === 0) console.log(exitCode)
    if (options.exit) process.exit()
}

process.on('exit', handleExit.bind(null, { cleanup: true }))
process.on('SIGINT', handleExit.bind(null, { exit: true }))
process.on('SIGUSR1', handleExit.bind(null, { exit: true }))
process.on('SIGUSR2', handleExit.bind(null, { exit: true }))
process.on('uncaughtException', handleExit.bind(null, { exit: true }))

// TODO testing
// logger.setLogLevel('info')
// logger.log('a log() message on info - show yellow, concise')
// logger.debug('a debug() message on info -  dont show')
// logger.setLogLevel('debug')
// logger.log('a log() message on debug - show yellow, with prefix')
// logger.debug('a debug() message on debug - show red, with prefix')

export default logger