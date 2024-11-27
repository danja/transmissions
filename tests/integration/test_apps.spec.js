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
    return new Promise((resolve, reject) => {
        exec(`./trans ${command}`, { ...options, cwd: rootDir }, (error, stdout, stderr) => {
            if (error && !stderr.includes('Warning')) {
                console.error('Command failed:', command)
                console.error('Error:', error)
                reject(error)
                return
            }
            resolve({ stdout, stderr })
        })
    })
}

describe('Application Integration Tests', function () {
    it('should run test applications', async function () {
        const testApps = await glob(path.join(rootDir, 'src/applications/test_*'))
        expect(testApps.length).to.be.greaterThan(0)

        for (const appDir of testApps) {
            const appName = path.basename(appDir)
            console.log(`Testing ${appName}`)

            const configPath = path.join(appDir, 'test-config.json')
            const config = existsSync(configPath) ?
                JSON.parse(await fs.readFile(configPath, 'utf8')) :
                { transmissions: [{ name: appName }] }

            for (const tx of config.transmissions) {
                let cmd = tx.name
                if (tx.message) cmd += ` -m '${JSON.stringify(tx.message)}'`

                const { stdout, stderr } = await runCommand(cmd)
                console.log(stdout)
                if (stderr) console.error(stderr)

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