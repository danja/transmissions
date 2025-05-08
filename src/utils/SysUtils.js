// import logger from './Logger.js'

import logger from "./Logger.js"

class SysUtils {

    /* Workaround for structuredClone limitation (bits get lost) */
    static copyMessage(message) {
        const dataset = message.dataset
        message = structuredClone(message)
        message.dataset = dataset
        return message
    }

    static sleep(ms = 100) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    }

    // TODO wire in garbage collection
    static gc() {
        if (global.gc) {
            global.gc()
            logger.debug('<<<Garbage collection triggered>>>')
        } else {
            logger.warn('Garbage collection triggered without global.gc, check ./trans-gc')
        }
    }

    static resolveFilePath(message, configPath, defaultPath) {
        let filePath

        // TODO tidy up
        // First try deriving path from message properties
        if (message.fullPath) {
            filePath = message.fullPath
        } else if (message.filepath) {
            if (message.targetPath && !path.isAbsolute(message.filepath)) {
                filePath = path.join(message.targetPath, message.filepath)
            } else {
                filePath = message.filepath
            }
        } else {
            // Fall back to getting path from config
            filePath = configPath
            if (!filePath) {
                logger.warn(`No source file path provided, defaulting to ${this.defaultFilePath}`)
                filePath = this.defaultFilePath
            }

            logger.trace(`filePath = ${filePath}`)
            // Resolve relative to targetPath or rootDir

            if (!path.isAbsolute(filePath)) {
                //     filePath = path.join(message.targetPath || message.rootDir, filePath)
                filePath = path.join(message.targetPath || message.workingDir, filePath)
            }
        }
    }
}
export default SysUtils