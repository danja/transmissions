// RENAMED: legacy, out-of-sync with codebase after Jasmine->Vitest migration

import path from 'path'
import { fileURLToPath } from 'url'
import { expect, describe, it } from 'vitest'
import { exec } from 'child_process'
import fs from 'fs'
import chalk from 'chalk'

// Vitest test suite for running application commands

describe('AppTester', () => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const logFile = path.join(__dirname, '../../latest.log')
    const commandsFile = path.join(__dirname, 'applications.json') // JSON file for commands

    const testRegex = /TEST_PASSED/g

    // Read commands from the JSON file
    const commands = JSON.parse(fs.readFileSync(commandsFile, 'utf8'))

    commands.forEach((test) => {
        const { command, label, description, requiredMatchCount } = test

        it(`run ${label}`, async () => {
            console.log(`${chalk.bold(description)}, command :\n   ${chalk.yellow(command)}`)
            await new Promise((resolve, reject) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(chalk.red('Exec error:'), error)
                        reject(error)
                        return
                    }
                    try {
                        const logs = stdout.toString()
                        const matches = logs.match(testRegex)
                        const matchCount = matches ? matches.length : 0
                        expect(matchCount).toBe(requiredMatchCount)
                        resolve()
                    } catch (err) {
                        console.error(chalk.red('Test error:'), err)
                        reject(err)
                    }
                })
            })
        })
    })
})
