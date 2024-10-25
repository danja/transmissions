// src/api/TransmissionRunner.js

import ModuleLoader from '../engine/ModuleLoader.js'
import TransmissionBuilder from '../engine/TransmissionBuilder.js'
import logger from '../utils/Logger.js'

class TransmissionRunner {
    constructor() {
        this.moduleLoader = null
    }

    async initialize(modulePath) {
        this.moduleLoader = new ModuleLoader([modulePath])
    }

    async run(options) {
        const {
            transmissionsFile,
            processorsConfigFile,
            message = {},
            rootDir = "",
            applicationRootDir
        } = options

        logger.debug('\nTransmissionRunner.run()')
        logger.debug('transmissionsFile = ' + transmissionsFile)
        logger.debug('processorsConfigFile = ' + processorsConfigFile)

        try {
            const transmissions = await TransmissionBuilder.build(
                transmissionsFile,
                processorsConfigFile,
                this.moduleLoader
            )

            if (!message.rootDir) {
                message.rootDir = rootDir
            }
            if (!message.applicationRootDir) {
                message.applicationRootDir = applicationRootDir
            }

            for (const transmission of transmissions) {
                if (!options.subtask || options.subtask === transmission.label) {
                    await transmission.execute(message)
                }
            }

            return { success: true }
        } catch (error) {
            logger.error('Error in TransmissionRunner:' + error)
            return {
                success: false,
                error: error.message
            }
        }
    }
}

export default TransmissionRunner