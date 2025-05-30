import RunCommand from '../../../src/processors/unsafe/RunCommand.js'
import { expect } from 'chai'
import fs from 'fs/promises'
import path from 'path'

describe('RunCommand', function () {
    let runCommand
    const workingDir = 'src/apps/test_runcommand/data'

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000
        runCommand = new RunCommand({
            simples: true,
            allowedCommands: ['echo', 'ls'],
            blockedPatterns: ['rm', '|', ';'],
            timeout: 50  // 50ms timeout
        })
    })

    it('should validate command output against required file', async function () {
        const requiredPath = path.join(workingDir, 'output', 'required-01.txt')
        const required = await fs.readFile(requiredPath, 'utf8')
        const message = { command: 'echo "Hello from RunCommand!"' }

        const result = await runCommand.process(message)
        expect(result.content.trim()).to.equal(required.trim())
    })

    it('should handle timeouts', async function () {
        // Create an infinitely running command
        const neverEndingCommand = `echo "test" && while true; do :; done`
        try {
            await runCommand.executeCommand(neverEndingCommand)
            expect.fail('Should have timed out')
        } catch (error) {
            expect(error.message).to.equal('Command timeout')
        }
    })

    it('should block disallowed commands', async function () {
        const message = { command: 'rm -rf /' }
        try {
            await runCommand.process(message)
            expect.fail('Should have blocked dangerous command')
        } catch (error) {
            expect(error.message).to.include('not in allowed list')
        }
    })

    it('should block commands with dangerous patterns', async function () {
        const message = { command: 'echo "test" | grep test' }
        try {
            await runCommand.process(message)
            expect.fail('Should have blocked command with pipe')
        } catch (error) {
            expect(error.message).to.include('blocked pattern')
        }
    })
})