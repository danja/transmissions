// src/core/TransmissionRunner.js

import path from 'path'
import { fileURLToPath } from 'url'
import ModuleLoaderFactory from '../api/ModuleLoaderFactory.js'
import TransmissionBuilder from './TransmissionBuilder.js'
import logger from '../utils/Logger.js'

class TransmissionRunner {
    constructor() {
        this.moduleLoader = null
    }

    async initialize(modulePath) {
        if (typeof modulePath !== 'string') {
            throw new TypeError('Module path must be a string')
        }
        this.moduleLoader = ModuleLoaderFactory.createModuleLoader([modulePath])
    }

    async run(options) {
        const {
            transmissionsFile,
            processorsConfigFile,
            message = {},
            rootDir = '',
            applicationRootDir
        } = options

        logger.debug('\nTransmissionRunner.run()')
        logger.debug('transmissionsFile =', transmissionsFile)
        logger.debug('processorsConfigFile =', processorsConfigFile)

        try {
            if (!this.moduleLoader) {
                throw new Error('ModuleLoader not initialized. Call initialize() first.')
            }

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
                    await transmission.process(message)
                }
            }

            return { success: true }
        } catch (error) {
            logger.error('Error in TransmissionRunner:', error)
            throw error
        }
    }
}

export default TransmissionRunner 