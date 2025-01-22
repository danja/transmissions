import log from 'loglevel'
import fs from 'fs'
import chalk from 'chalk'

const logger = {}

//  logger.log(`\n\nconfig dataset: ${[...config].map(q => `${q.subject.value} ${q.predicate.value} ${q.object.value}`).join('\n')}`)


// Map log levels to chalk styles
const LOG_STYLES = {
    "trace": chalk.greenBright,
    "debug": chalk.white,
    "info": chalk.yellow,
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

// have this return a string
logger.reveal = function (instance) {

    if (!instance) {
        // logger.warn('*** no instance defined ***')
        return
    }

    const serialized = {}

    const loglevel = logger.getLevel()
    logger.setLogLevel('trace')


    if (instance.constructor) {
        logger.log(`*** Class : ${instance.constructor.name}`)
    }
    logger.log('* Keys :  ', 'debug')
    for (const key in instance) {
        if (key === 'dataset') {
            logger.log('[[dataset found, skipping]]', 'debug')
            continue
        }

        if (key.startsWith('_')) {
            logger.log(`       ${key}`, 'debug')
            continue
        }

        if (instance.hasOwnProperty(key)) {
            let value = instance[key]
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
    //  logger.log(`Instance of ${chalk.bold(instance.constructor.name)} with properties - \n${props}`, 'trace');
    logger.log(`Instance of ${chalk.yellow(chalk.bold(instance.constructor.name))} with properties - \n${chalk.yellow(props)})`)
    logger.setLogLevel(loglevel)
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
        // Perform cleanup
    }
    if (exitCode || exitCode === 0) console.log(exitCode)
    if (options.exit) process.exit()
}

process.on('exit', handleExit.bind(null, { cleanup: true }))
process.on('SIGINT', handleExit.bind(null, { exit: true }))
process.on('SIGUSR1', handleExit.bind(null, { exit: true }))
process.on('SIGUSR2', handleExit.bind(null, { exit: true }))
process.on('uncaughtException', handleExit.bind(null, { exit: true }))

// TESTING
// logger.setLogLevel('info')
// logger.log('a log() message on info - show yellow, concise')
// logger.debug('a debug() message on info -  dont show')
// logger.setLogLevel('debug')
// logger.log('a log() message on debug - show yellow, with prefix')
// logger.debug('a debug() message on debug - show red, with prefix')

export default logger