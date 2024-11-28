import RunCommand from '../../src/processors/unsafe/RunCommand.js'
import { expect } from 'chai'

describe('RunCommand', function () {
    let runCommand

    beforeEach(function () {
        runCommand = new RunCommand({
            simples: true,
            allowedCommands: ['echo', 'ls'],
            blockedPatterns: ['rm', '|']
        })
    })

    describe('validateCommand()', function () {
        it('should accept allowed commands', function () {
            expect(() => runCommand.validateCommand('echo hello')).to.not.throw()
            expect(() => runCommand.validateCommand('ls -la')).to.not.throw()
        })

        it('should reject commands not in whitelist', function () {
            expect(() => runCommand.validateCommand('cat file.txt')).to.throw('Command not in allowed list')
        })

        it('should reject commands with blocked patterns', function () {
            expect(() => runCommand.validateCommand('echo hello | grep a')).to.throw('Command contains blocked pattern')
        })

        it('should accept any command when no whitelist is specified', function () {
            runCommand.allowedCommands = []
            expect(() => runCommand.validateCommand('any-command')).to.not.throw()
        })
    })

    describe('process()', function () {
        it('should execute command from message', async function () {
            const message = { command: 'echo "test"' }
            const result = await runCommand.process(message)
            expect(result.commandResult.stdout.trim()).to.equal('test')
        })

        it('should skip execution when no command specified', async function () {
            const message = {}
            const result = await runCommand.process(message)
            expect(result.commandResult).to.be.undefined
            expect(result.commandError).to.be.undefined
        })

        it('should handle command errors', async function () {
            const message = { command: 'invalid-command' }
            const result = await runCommand.process(message)
            expect(result.commandError).to.not.be.undefined
        })
    })
})
