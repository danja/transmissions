// VanillaJS Logger

import fs from 'fs'
// 
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
];
const logComponent = "api.logger";

logger.appendLogToFile = function (message) {
    if (logger.logfile) {
        fs.appendFileSync(logger.logfile, message + '\n', 'utf8');
    }
}

logger.setLogLevel = function (logLevel = "warn") {
    console[logLevel]("[%s] log level: %s", logComponent, logLevel);
    let limit = LOG_LEVELS.indexOf(logLevel);
    LOG_LEVELS.filter(function (level, index) {
        if (index < limit) {
            console[logLevel]("[%s] disabling console.%s()", logComponent, level);
            console[level] = function () { }  // Disable lower log levels
        }
    });
};

logger.timestampISO = function () {
    let now = new Date();
    return now.toISOString();
};

logger.log = function (msg, level = "log") {
    // console.log(msg)
    console[level](msg)
    const logMessage = `[${logger.timestampISO()}] [${level.toUpperCase()}] - ${msg}`
    logger.appendLogToFile(logMessage)
}

logger.reveal = function (instance) {
    const serialized = {};
    for (const key in instance) {
        if (key === 'dataset') { // special case, RDF
            serialized[key] = instance[key].toString() // TODO make useful
        } else {
            if (instance.hasOwnProperty(key)) {
                let kiki = instance[key]

                if (Buffer.isBuffer(kiki)) {
                    kiki = kiki.toString()
                }
                if (kiki.length > 100) {
                    kiki = kiki.substring(0, 100) + '...'
                }
                serialized[key] = kiki
            }
        }
    }
    const props = JSON.stringify(serialized, null, 2)
    logger.log(`Instance of ${instance.constructor.name} with properties - \n${props}`)
}


logger.debug = function (msg) {
    logger.log(msg, "debug");
}


logger.info = function (msg) {
    logger.log(msg, "info");
}

logger.warn = function (msg) {
    logger.log(msg, "warn");
}

logger.error = function (msg) {
    logger.log(msg, "error");
}

logger.poi = function exploreGrapoi(grapoi, predicates, objects, subjects) {
    // Print the properties of the Grapoi object
    console.log('Properties of the Grapoi object:');
    for (const prop in grapoi) {
        console.log(`\t${prop}: ${grapoi[prop]}`);
    }

    // Define the path and print the quads
    console.log('\nPath:');
    const path = grapoi.out(predicates, objects).in(predicates, subjects);
    for (const quad of path.quads()) {
        console.log(`\t${quad.predicate.value}: ${quad.object.value}`);
    }
}

function handleExit(options, exitCode) {
    if (options.cleanup) {
        // Perform cleanup
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

// Cleanup listener for the process
process.on('exit', handleExit.bind(null, { cleanup: true }));
process.on('SIGINT', handleExit.bind(null, { exit: true })); // Catches ctrl+c event
process.on('SIGUSR1', handleExit.bind(null, { exit: true })); // Catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR2', handleExit.bind(null, { exit: true })); // Catches "kill pid" (for example: nodemon restart)
process.on('uncaughtException', handleExit.bind(null, { exit: true }));


export default logger;