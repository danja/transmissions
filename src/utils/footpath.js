import path from 'path'
import { fileURLToPath } from 'url'

import logger from './Logger.js'

/*
resolves paths so both runtime and tests work

must be a better way of doing this, but I can't be bothered looking today
*/

let footpath = {}

footpath.resolve = function footpath(here, relative, start) {

    const loggy = false
    if (loggy) {
        logger.debug("\n*** start footpath.resolve ***")
        logger.debug("process.cwd() = " + process.cwd())
        logger.debug("here = " + here)
        logger.debug("relative = " + relative)
        logger.debug("start = " + start)
    }

    const __filename = fileURLToPath(here)
    const __dirname = path.dirname(__filename)
    const rootDir = path.resolve(__dirname, relative)
    const filePath = path.join(rootDir, start)

    if (loggy) {
        logger.debug("__filename = " + __filename)
        logger.debug("__dirname = " + __dirname)
        logger.debug("rootDir = " + rootDir)
        logger.debug("filePath = " + filePath)
        logger.debug("*** end footpath.resolve ***\n")
    }

    return filePath
}

footpath.urlLastPart = function footpath(url) {
    const urlObj = new URL(url);
    const hash = urlObj.hash;
    const path = urlObj.pathname;
    const lastPart = hash ? hash.replace(/^#/, '') : path.split('/').pop();
    return lastPart;
}

export default footpath