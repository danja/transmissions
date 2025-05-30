import path from 'path'
import { fileURLToPath } from 'url'
import { expect } from 'chai'
import { exec } from 'child_process'
import fs from 'fs/promises'
import { glob } from 'glob'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../../')

async function runCommand(command, options) {
    return new Promise((resolve) => {
        const startTime = process.hrtime()
        const proc = exec(`./trans ${command}`, { ...options, cwd: rootDir })
        let stdout = '', stderr = ''

        proc.stdout.on('data', (data) => {
            stdout += data
            process.stdout.write(data)
        })

        proc.stderr.on('data', (data) => {
            stderr += data
            process.stderr.write(data)
        })

        proc.on('exit', (code, signal) => {
            const endTime = process.hrtime(startTime)
            const duration = (endTime[0] + endTime[1] / 1e9).toFixed(3)

            // Check for error messages in output
            const hasError = stdout.includes('TypeError:') ||
                stdout.includes('Error:') ||
                stderr.includes('TypeError:') ||
                stderr.includes('Error:')

            const result = {
                stdout,
                stderr,
                code,
                signal,
                success: code === 0 && !hasError,
                duration
            }
            resolve(result)
        })
    })
}

describe('Application Integration Tests', function () {
    it('should run test apps', async function () {
        const testApps = await glob(path.join(rootDir, 'src/apps/test_*'))
        expect(testApps.length).to.be.greaterThan(0)

        for (const appDir of testApps) {
            const appName = path.basename(appDir)
            console.log(`\nTesting ${appName}`)

            const configPath = path.join(appDir, 'test-config.json')
            const config = existsSync(configPath) ?
                JSON.parse(await fs.readFile(configPath, 'utf8')) :
                { transmissions: [{ name: appName }] }

            for (const tx of config.transmissions) {
                let cmd = tx.name
                if (tx.message) cmd += ` -m '${JSON.stringify(tx.message)}'`

                const result = await runCommand(cmd)

                if (!result.success) {
                    console.error('\n' + '='.repeat(80))
                    console.error(`🔴 Test failed for ${cmd}`)
                    console.error('='.repeat(80))
                    console.error('\nExecution Details:')
                    console.error('-'.repeat(40))
                    console.error(`Duration: ${result.duration}s`)
                    console.error('Exit code:', result.code)
                    console.error('Signal:', result.signal)

                    if (result.error) {
                        console.error('\nError Details:')
                        console.error('-'.repeat(40))
                        console.error('Message:', result.error.message)
                        console.error('Stack:', result.error.stack)
                    }

                    if (result.stderr) {
                        console.error('\nStderr Output:')
                        console.error('-'.repeat(40))
                        console.error(result.stderr)
                    }

                    console.error('\nStdout Output:')
                    console.error('-'.repeat(40))
                    console.error(result.stdout || '(no stdout output)')

                    console.error('\nTest Configuration:')
                    console.error('-'.repeat(40))
                    console.error(JSON.stringify(tx, null, 2))
                    console.error('\n' + '='.repeat(80))

                    try {
                        const failuresDir = path.join(rootDir, 'test-failures', appName, new Date().toISOString().replace(/:/g, '-'))
                        await fs.mkdir(failuresDir, { recursive: true })
                        await fs.writeFile(
                            path.join(failuresDir, 'test-output.json'),
                            JSON.stringify({ result, config: tx }, null, 2)
                        )
                        console.error(`Failure details saved to: ${failuresDir}`)
                    } catch (err) {
                        console.error('Failed to save failure details:', err)
                    }
                } else {
                    console.log(`✅ ${cmd} completed successfully (${result.duration}s)`)
                }

                expect(result.success, `Command failed: ${cmd} with exit code ${result.code}`).to.be.true

                if (tx.requiredFiles) {
                    for (const pattern of tx.requiredFiles) {
                        const outputFiles = await glob(path.join(appDir, 'data/output', pattern))
                        for (const outputFile of outputFiles) {
                            const requiredFile = outputFile.replace('output-', 'required-')
                            const [output, required] = await Promise.all([
                                fs.readFile(outputFile, 'utf8'),
                                fs.readFile(requiredFile, 'utf8')
                            ])
                            expect(output.trim()).to.equal(required.trim())
                        }
                    }
                }
            }
        }
    })
})