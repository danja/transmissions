import path from 'path'
import { access, constants } from 'node:fs'
import logger from './Logger.js'
import ns from './ns.js'

class PathResolver {
    /**
     * Resolves a file path based on message, config, and defaults.
     * @param {Object} params
     * @param {Object} params.message - The message object.
     * @param {Object} params.app - The app context (should have workingDir).
     * @param {Function} params.getProperty - Function to get config property.
     * @param {string} params.defaultFilePath - Default file path if none found.
     * @param {string} [params.sourceOrDest] - ns.trn.sourceFile or ns.trn.destinationFile
     * @returns {Promise<string>} - The resolved file path.
     */
    static async resolveFilePath({ message, app, getProperty, defaultFilePath, sourceOrDest, isWriter }) {
        let filePath
        // Try message properties first
        if (message.fullPath) {
            filePath = message.fullPath
        } else if (message.filepath) {
            if (message.targetPath && !path.isAbsolute(message.filepath)) {
                filePath = path.join(message.targetPath, message.filepath)
            } else {
                filePath = message.filepath
            }
        } else {
            // Fallback to config property
            filePath = typeof getProperty === 'function' ? await getProperty(sourceOrDest) : undefined
            if (!filePath) {
                logger.warn(`No file path provided, defaulting to ${defaultFilePath}`)
                filePath = defaultFilePath
            }
            logger.debug(`filePath = ${filePath}`)
            // Resolve relative to targetPath or rootDir
            if (typeof filePath === 'string' && !path.isAbsolute(filePath)) {
                const workingDir = app.workingDir
                logger.debug(`app.workingDir = ${workingDir}`)
                const possiblePath = path.join(workingDir, filePath)
                //  logger.log(`sourceOrDest = ${sourceOrDest}`)
                if (isWriter) {
                    return possiblePath
                }
                try {
                    await new Promise((resolve, reject) => {
                        access(possiblePath, constants.R_OK, (err) => {
                            if (err) reject(err)
                            else resolve()
                        })
                    })
                    filePath = possiblePath
                } catch (err) {
                    logger.error(`Failed to access possiblePath: ${possiblePath}. Error: ${err.message}`)

                    const dataPath = path.join(workingDir, 'data', filePath)
                    try {
                        await new Promise((resolve, reject) => {
                            access(dataPath, constants.R_OK, (err) => {
                                if (err) reject(err)
                                else resolve()
                            })
                        })
                        filePath = dataPath
                    } catch (err2) {
                        logger.error(`Failed to access dataPath: ${dataPath}. Error: ${err2.message}`)

                        throw new Error(`File not found in expected locations: ${possiblePath}, ${dataPath}`)
                    }
                }
            }
        }
        return filePath
    }
}

export default PathResolver
