// VanillaJS Logger
// 
// NOTE: You probably shouldn't use this in production... you've been warned.
let logger = {}

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

// Set log level
logger.setLogLevel = function (logLevel = "warn") {
    console[logLevel]("[%s] log level: %s", logComponent, logLevel);
    let limit = LOG_LEVELS.indexOf(logLevel);
    LOG_LEVELS.filter(function (level, index) {
        if (index < limit) {
            console[logLevel]("[%s] disabling console.%s()", logComponent, level);
            console[level] = function () { };
        }
    });
};

// Timestamp generator
logger.timestampISO = function () {
    let now = new Date();
    return now.toISOString();
};

// Custom JSON Logger
logger.log = function (msg, level = "log") {
    // console.log(msg)
    console[level](msg)

    /*
      console[level](JSON.stringify({
        ts: logger.timestampISO(),
        msg: msg,
    }, null, 0))
    */
}

logger.reveal = function (instance) {
    const serialized = {};
    for (const key in instance) {
        if (instance.hasOwnProperty(key)) {
            serialized[key] = instance[key];
        }
    }
    const props = JSON.stringify(serialized, null, 2)
    logger.log(`\n# ${instance.constructor.name}\n\n\`\`\`\n${props}\n\`\`\``)
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

export default logger;