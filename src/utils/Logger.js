import log from 'loglevel';
import fs from 'fs';

const logger = {};

// Map internal log levels to loglevel's levels
const LOG_LEVELS = ["trace", "debug", "info", "warn", "error"];

logger.logfile = 'latest.log';
logger.currentLogLevel = "warn"; // Default level

// Initialize loglevel
log.setLevel(logger.currentLogLevel);

// Expose core loglevel functionality
logger.getLevel = () => log.getLevel();
logger.enableAll = () => log.enableAll();
logger.disableAll = () => log.disableAll();
logger.setDefaultLevel = (level) => log.setDefaultLevel(level);
logger.getLogger = (name) => {
    const namedLogger = log.getLogger(name);
    return wrapLogger(namedLogger, name);
};
logger.methodFactory = log.methodFactory;
logger.noConflict = () => log.noConflict();

// Helper to wrap loglevel loggers with file logging
function wrapLogger(baseLogger, name = 'root') {
    const wrapped = {};

    wrapped.log = function (msg, level = "debug") {
        const logMessage = `[${logger.timestampISO()}] [${level.toUpperCase()}] [${name}] - ${msg}`;
        baseLogger[level](msg);
        logger.appendLogToFile(logMessage);
    };

    // Add convenience methods
    LOG_LEVELS.forEach(level => {
        wrapped[level] = (msg) => wrapped.log(msg, level);
    });

    // Pass through loglevel methods
    wrapped.getLevel = () => baseLogger.getLevel();
    wrapped.setLevel = (level, persist) => baseLogger.setLevel(level, persist);
    wrapped.setDefaultLevel = (level) => baseLogger.setDefaultLevel(level);
    wrapped.enableAll = () => baseLogger.enableAll();
    wrapped.disableAll = () => baseLogger.disableAll();

    // Add plugin support
    wrapped.methodFactory = baseLogger.methodFactory;
    wrapped.setMethodFactory = function (factory) {
        baseLogger.methodFactory = factory;
        baseLogger.rebuild();
    };

    return wrapped;
}

logger.appendLogToFile = function (message) {
    if (logger.logfile) {
        fs.appendFileSync(logger.logfile, message + '\n', 'utf8');
    }
}

logger.setLogLevel = function (logLevel = "warn", persist = true) {
    logger.currentLogLevel = logLevel;
    log.setLevel(logLevel, persist);
}

logger.timestampISO = function () {
    return new Date().toISOString();
}

logger.log = function (msg, level = "debug") {
    const logMessage = `[${logger.timestampISO()}] [${level.toUpperCase()}] [root] - ${msg}`;
    log[level](msg);
    logger.appendLogToFile(logMessage);
}

logger.reveal = function (instance) {
    if (!instance) {
        logger.log('no instance defined', 'warn');
        return;
    }

    const serialized = {};
    logger.log('***    hidden keys :  ', 'debug');

    for (const key in instance) {
        if (key === 'dataset') {
            logger.log('[[dataset found, skipping]]', 'debug');
            continue;
        }

        if (key.startsWith('_')) {
            logger.log(`       ${key}`, 'debug');
            continue;
        }

        if (instance.hasOwnProperty(key)) {
            let value = instance[key];
            if (value) {
                if (Buffer.isBuffer(value)) {
                    value = value.toString();
                }
                if (value.length > 100) {
                    try {
                        value = value.substring(0, 100) + '...';
                    } catch (e) {
                        value = value.slice(0, 99);
                    }
                }
                serialized[key] = value;
            } else {
                serialized[key] = '[no key]';
            }
        }
    }

    const props = JSON.stringify(serialized, null, 2);
    logger.log(`Instance of ${instance.constructor.name} with properties - \n${props}`, 'debug');
}

// Convenience methods mapping to loglevel
LOG_LEVELS.forEach(level => {
    logger[level] = (msg) => logger.log(msg, level);
});

logger.poi = function exploreGrapoi(grapoi, predicates, objects, subjects) {
    console.log('Properties of the Grapoi object:');
    for (const prop in grapoi) {
        console.log(`\t${prop}: ${grapoi[prop]}`);
    }

    console.log('\nPath:');
    const path = grapoi.out(predicates, objects).in(predicates, subjects);
    for (const quad of path.quads()) {
        console.log(`\t${quad.predicate.value}: ${quad.object.value}`);
    }
}

// Process cleanup handlers
function handleExit(options, exitCode) {
    if (options.cleanup) {
        // Perform cleanup
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

process.on('exit', handleExit.bind(null, { cleanup: true }));
process.on('SIGINT', handleExit.bind(null, { exit: true }));
process.on('SIGUSR1', handleExit.bind(null, { exit: true }));
process.on('SIGUSR2', handleExit.bind(null, { exit: true }));
process.on('uncaughtException', handleExit.bind(null, { exit: true }));

export default logger;