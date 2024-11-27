import path from 'path'
import { fileURLToPath } from 'url'
import { expect } from 'chai'
import { exec } from 'child_process'
import fs from 'fs/promises'
import { glob } from 'glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../../')

async function scanTestApps() {
    const pattern = path.join(rootDir, 'src/applications/test_*')
    return await glob(pattern)
}

async function clearOutputFiles(appDir) {
    const outputDir = path.join(appDir, 'data/output')
    try {
        const files = await fs.readdir(outputDir)
        for (const file of files) {
            if (file.startsWith('output-')) {
                await fs.unlink(path.join(outputDir, file))
            }
        }
    } catch (error) {
        if (error.code !== 'ENOENT') throw error
    }
}

async function loadTestConfig(appDir) {
    try {
        const configPath = path.join(appDir, 'test-config.json')
        const configContent = await fs.readFile(configPath, 'utf8')
        return JSON.parse(configContent)
    } catch (error) {
        return {
            transmissions: [{
                name: path.basename(appDir),
                args: [],
                message: null,
                target: null,
                requiredFiles: ['output-01.*']
            }]
        }
    }
}

async function compareOutput(appDir, outputPattern, transmissionIndex = 0) {
    const outputGlob = path.join(appDir, 'data/output',
        outputPattern.replace('*', `${transmissionIndex + 1}*`))
    const outputFiles = await glob(outputGlob)
    const results = []

    for (const outputFile of outputFiles) {
        const requiredFile = outputFile.replace('output-', 'required-')
        try {
            const output = await fs.readFile(outputFile, 'utf8')
            const required = await fs.readFile(requiredFile, 'utf8')

            if (outputFile.endsWith('.json')) {
                results.push(JSON.stringify(JSON.parse(output)) === JSON.stringify(JSON.parse(required)))
            } else {
                results.push(output.trim() === required.trim())
            }
        } catch (error) {
            console.error(`Error comparing ${outputFile}:`, error)
            results.push(false)
        }
    }
    return results.every(result => result)
}

describe('Application Integration Tests', function () {
    it('should run test applications', async function () {
        const testApps = await scanTestApps()
        expect(testApps.length).to.be.greaterThan(0, 'No test applications found')

        for (const appDir of testApps) {
            const appName = path.basename(appDir)
            console.log(`Testing ${appName}...`)

            await clearOutputFiles(appDir)
            const config = await loadTestConfig(appDir)

            for (let i = 0; i < config.transmissions.length; i++) {
                const transmission = config.transmissions[i]
                let command = `node run.js ${transmission.name}`

                if (transmission.message) {
                    command += ` -m '${JSON.stringify(transmission.message)}'`
                }
                if (transmission.target) {
                    command += ` ${transmission.target}`
                }
                if (transmission.args?.length) {
                    command += ` ${transmission.args.join(' ')}`
                }

                await new Promise((resolve, reject) => {
                    exec(command, { cwd: rootDir }, async (error, stdout, stderr) => {
                        if (error) {
                            console.error(`${appName} exec error:`, error)
                            reject(error)
                            return
                        }

                        try {
                            console.log(`${appName} transmission ${i + 1} output:`, stdout)
                            if (stderr) console.error(`${appName} stderr:`, stderr)

                            for (const pattern of transmission.requiredFiles) {
                                const matched = await compareOutput(appDir, pattern, i)
                                expect(matched, `${appName} output does not match required files`).to.be.true
                            }
                            resolve()
                        } catch (err) {
                            console.error(`${appName} test error:`, err)
                            reject(err)
                        }
                    })
                })
            }
        }
    })
})