// VanillaJS Logger

// TODO make better use of console.*

import fs from 'fs'

// NOTE: You probably shouldn't use this in production... you've been warned.
let logger = {}

logger.logfile = 'latest.log'

// Log levels
// debug=0, info=1, log=2, warn=3, error=4
const LOG_LEVELS = [
    "debug",
    "info",
    "log",
    "warn",
    "error",
]
const logComponent = "api.logger"

logger.appendLogToFile = function (message) {
    if (logger.logfile) {
        fs.appendFileSync(logger.logfile, message + '\n', 'utf8')
    }
}

logger.setLogLevel = function (logLevel = "warn") {
    // console[logLevel]("[%s] log level: %s", logComponent, logLevel);
    console[logLevel]('', logComponent, logLevel)
    logger.currentLogLevel = logLevel
}

logger.timestampISO = function () {
    let now = new Date()
    return now.toISOString()
}

logger.log = function (msg, level = "log") {
    const currentLevelIndex = LOG_LEVELS.indexOf(logger.currentLogLevel)
    const messageLevelIndex = LOG_LEVELS.indexOf(level)

    if (messageLevelIndex >= currentLevelIndex) {
        console[level](msg)
        const logMessage = `[${logger.timestampISO()}] [${level.toUpperCase()}] - ${msg}`
        logger.appendLogToFile(logMessage)
    }
}

logger.reveal = function (instance) {
    const serialized = {}

    logger.log('***    hidden keys :  ')
    for (const key in instance) {

        if (key.startsWith('_')) { // special case, RDF
            //    serialized[key] = instance[key].toString(); // TODO make useful
            // DatasetExt
            logger.log(`       ${key}`)
            continue
        } else {
            if (instance.hasOwnProperty(key)) {
                let kiki = instance[key]
                //   logger.debug('OOOO ' + Object.prototype.toString.call(kiki))
                if (kiki) {
                    if (Buffer.isBuffer(kiki)) {
                        kiki = kiki.toString()

                    }
                    if (kiki.length > 100) {
                        try {
                            kiki = kiki.substring(0, 100) + '...'
                        } catch (e) {
                            kiki = kiki.slice(0, 99)
                        }
                    }
                    serialized[key] = kiki
                } else {
                    serialized[key] = '[no key]'
                }
            }
        }
    }
    const props = JSON.stringify(serialized, null, 2)
    logger.log(`Instance of ${instance.constructor.name} with properties - \n${props}`)
}

logger.debug = function (msg) {
    logger.log(msg, "debug")
}

logger.info = function (msg) {
    logger.log(msg, "info")
}

logger.warn = function (msg) {
    logger.log(msg, "warn")
}

logger.error = function (msg) {
    logger.log(msg, "error")
}

logger.poi = function exploreGrapoi(grapoi, predicates, objects, subjects) {
    // Print the properties of the Grapoi object
    console.log('Properties of the Grapoi object:')
    for (const prop in grapoi) {
        console.log(`\t${prop}: ${grapoi[prop]}`)
    }

    // Define the path and print the quads
    console.log('\nPath:')
    const path = grapoi.out(predicates, objects).in(predicates, subjects)
    for (const quad of path.quads()) {
        console.log(`\t${quad.predicate.value}: ${quad.object.value}`)
    }
}

function handleExit(options, exitCode) {
    if (options.cleanup) {
        // Perform cleanup
    }
    if (exitCode || exitCode === 0) console.log(exitCode)
    if (options.exit) process.exit()
}

// Cleanup listener for the process
process.on('exit', handleExit.bind(null, { cleanup: true }))
process.on('SIGINT', handleExit.bind(null, { exit: true })) // Catches ctrl+c event
process.on('SIGUSR1', handleExit.bind(null, { exit: true })) // Catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR2', handleExit.bind(null, { exit: true })) // Catches "kill pid" (for example: nodemon restart)
process.on('uncaughtException', handleExit.bind(null, { exit: true }))

export default logger