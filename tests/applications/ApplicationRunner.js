// tests/integration/fork.spec.js
import path from 'path'
import { fileURLToPath } from 'url'
import { expect } from 'chai'
import { exec } from 'child_process'
import fs from 'fs'

describe('', function () {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const logFile = path.join(__dirname, '../../latest.log')
    const commandsFile = path.join(__dirname, 'applications.json') // JSON file for commands

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000

    const testRegex = /TEST_PASSED/g

    // Read commands from the JSON file
    const commands = JSON.parse(fs.readFileSync(commandsFile, 'utf8'))

    commands.forEach((test, index) => {
        const { command, label, description, requiredMatchCount } = test

        it(`run ${label} app & check results, command : ${index + 1}`, (done) => {
            console.log(`Running : ${description}`) // Print description to console
            exec(command, async (error, stdout, stderr) => {
                if (error) {
                    console.error('Exec error:', error)
                    done(error)
                    return
                }
                try {
                    // Parse console log file
                    const logs = stdout.toString()
                    // console.log(`LOGS = \n${logs}`);
                    const matches = logs.match(testRegex)
                    const matchCount = matches ? matches.length : 0
                    expect(matchCount).to.equal(requiredMatchCount)
                    done()
                } catch (err) {
                    console.error('Test error:', err)
                    console.log('Logs:\n', err)
                    done(err)
                }
            })
        })
    })
})