import { exec } from 'child_process'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'
import ns from '../../utils/ns.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'

class RunCommand extends Processor {
    constructor(config) {
        super(config)
        this.allowedCommands = []
        this.blockedPatterns = []
        this.initializeSecurity()
    }

    async initializeSecurity() {
        if (this.configKey) {
            const allowed = await GrapoiHelpers.listToArray(
                this.config,
                this.configKey,
                ns.trm.allowedCommands
            )
            this.allowedCommands = allowed.map(term => term.value)

            const blocked = await GrapoiHelpers.listToArray(
                this.config,
                this.configKey,
                ns.trm.blockedPatterns
            )
            this.blockedPatterns = blocked.map(term => term.value)
        }
    }

    validateCommand(command) {
        // Check if command starts with an allowed command
        const isAllowed = this.allowedCommands.length === 0 ||
            this.allowedCommands.some(allowed => command.startsWith(allowed))
        if (!isAllowed) {
            throw new Error('Command not in allowed list')
        }

        // Check for blocked patterns
        const hasBlocked = this.blockedPatterns.some(pattern =>
            command.includes(pattern)
        )
        if (hasBlocked) {
            throw new Error('Command contains blocked pattern')
        }

        return true
    }

    async process(message) {
        logger.debug('RunCommand process method called')

        let command = message.command
        if (!command) {
            command = this.getPropertyFromMyConfig(ns.trm.command)
        }

        if (!command) {
            logger.debug('No command specified, skipping execution')
            return this.emit('message', message)
        }

        try {
            this.validateCommand(command)
            const result = await this.executeCommand(command)
            message.commandResult = result
            logger.debug(`Command executed successfully: ${command}`)
        } catch (error) {
            logger.error(`Command error: ${error.message}`)
            message.commandError = error.message
        }

        return this.emit('message', message)
    }

    executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, {
                timeout: 30000, // 30 second timeout
                maxBuffer: 1024 * 1024 // 1MB buffer
            }, (error, stdout, stderr) => {
                if (error) {
                    reject(error)
                    return
                }

                resolve({
                    stdout: stdout.toString(),
                    stderr: stderr.toString(),
                    code: 0
                })
            })
        })
    }
}

export default RunCommand