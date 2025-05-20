import { exec } from 'child_process'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'

/**
 * @class BashCommand
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Executes bash commands with security restrictions. This processor should be used with
 * extreme caution as it can execute arbitrary shell commands on the host system.
 *
 * ### Service Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.allowedCommands`** - Comma-separated list of allowed command names (optional)
 * * **`ns.trn.blockedPatterns`** - Comma-separated list of blocked command patterns (optional)
 * * **`ns.trn.timeout`** - Command execution timeout in milliseconds (optional)
 * * **`ns.trn.command`** - Default command to execute if not provided in message (optional)
 *
 * #### __*Input*__
 * * **`message.command`** - The bash command to execute (if not provided in config)
 *
 * #### __*Output*__
 * * **`message.content`** - Command's stdout on success, error message on failure
 * * **`message.commandResult`** - Object containing command execution details on success
 * * **`message.commandError`** - Error message if command execution fails
 *
 * #### __*Behavior*__
 * * Validates commands against allowed/blocked lists if configured
 * * Executes the command with a configurable timeout
 * * Handles command output and errors appropriately
 * * Returns command results in a structured format
 *
 * #### __*Security Notes*__
 * * **WARNING**: This processor can execute arbitrary shell commands
 * * Always configure `allowedCommands` and `blockedPatterns` in production
 * * Run with minimal necessary permissions
 * * Consider using more specific processors instead when possible
 *
 * #### __*Side Effects*__
 * * Executes shell commands on the host system
 * * May modify system state depending on the command
 *
 * #### __*Tests*__
 * Tests should verify:
 *   - Command validation logic
 *   - Timeout handling
 *   - Security restrictions
 *   - Output/error handling
 */
class BashCommand extends Processor {
    constructor(config) {
        super(config)
        this.allowedCommands = super.getProperty(ns.trn.allowedCommands)
        this.blockedPatterns = super.getProperty(ns.trn.blockedPatterns)
        this.timeout = super.getProperty(ns.trn.timeout)
        this.initializeSecurity()
    }

    async initializeSecurity() {
        if (this.settings) {
            const allowed = super.getProperty(ns.trn.allowedCommands)
            this.allowedCommands = allowed ? allowed.split(',') : []

            const blocked = super.getProperty(ns.trn.blockedPatterns)
            this.blockedPatterns = blocked ? blocked.split(',') : []
        }
    }

    validateCommand(command) {
        if (!command) {
            throw new Error('No command specified')
        }

        const commandName = command.split(' ')[0]
        const isAllowed = this.allowedCommands.length === 0 ||
            this.allowedCommands.includes(commandName)

        if (!isAllowed) {
            throw new Error(`Command '${commandName}' not in allowed list`)
        }

        const hasBlocked = this.blockedPatterns.some(pattern =>
            command.includes(pattern)
        )
        if (hasBlocked) {
            throw new Error('Command contains blocked pattern')
        }
    }

    async process(message) {
        let command = message.command
        if (!command) {
            command = super.getProperty(ns.trn.command)
        }

        try {
            this.validateCommand(command)
            const result = await this.executeCommand(command)
            message.content = result.stdout
            message.commandResult = result
            logger.debug(`Command executed successfully: ${command}`)
        } catch (error) {
            logger.error(`Command error: ${error.message}`)
            message.commandError = error.message
            message.content = error.message
            throw error
        }

        return this.emit('message', message)
    }

    executeCommand(command) {
        return new Promise((resolve, reject) => {
            const child = exec(command, {
                timeout: this.timeout
            }, (error, stdout, stderr) => {
                if (error) {
                    if (error.signal === 'SIGTERM') {
                        reject(new Error('Command timeout'))
                    } else {
                        reject(error)
                    }
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

export default BashCommand