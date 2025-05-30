import { expect } from 'chai'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import fs from 'fs/promises'

describe('TestSettings Integration', function () {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const testDir = path.join(__dirname, '../../src/apps/test_config-settings')

    // Verify test files exist before running
    beforeAll(async () => {
        const files = ['config.ttl', 'transmissions.ttl']
        for (const file of files) {
            const exists = await fs.access(path.join(testDir, file))
                .then(() => true)
                .catch(() => false)
            expect(exists, `${file} exists`).to.be.true
        }
    })

    // Test the full application pipeline
    it('should process settings through transmission pipeline', (done) => {
        exec('node src/api/cli/run.js test_config-settings', {
            cwd: path.resolve(__dirname, '../..')
        }, async (error, stdout, stderr) => {
            if (error) {
                done(error)
                return
            }

            try {
                // Verify expected output in logs
                expect(stdout).to.include('settingsSingle')
                expect(stdout).to.include('Alice')

                // Check multiple settings
                expect(stdout).to.include('settingsMulti')
                expect(stdout).to.include('Bob')
                expect(stdout).to.include('dirB')

                // Verify settings lists
                expect(stdout).to.include('settingsLists')
                expect(stdout).to.include('settingA1')
                expect(stdout).to.include('settingB1')

                done()
            } catch (err) {
                done(err)
            }
        })
    })

    // Test configuration error cases
    it('should handle missing configuration gracefully', (done) => {
        const badConfigPath = path.join(testDir, 'missing-config.ttl')

        exec(`node src/api/cli/run.js test_config-settings -c ${badConfigPath}`, {
            cwd: path.resolve(__dirname, '../..')
        }, (error, stdout, stderr) => {
            expect(stdout).to.include('fallback value')
            expect(stderr).to.not.include('UnhandledPromiseRejection')
            done()
        })
    })

    // Test settings inheritance
    it('should handle settings inheritance', (done) => {
        exec('node src/api/cli/run.js test_config-settings inherit', {
            cwd: path.resolve(__dirname, '../..')
        }, async (error, stdout, stderr) => {
            try {
                expect(stdout).to.include('base setting')
                expect(stdout).to.include('inherited setting')
                done()
            } catch (err) {
                done(err)
            }
        })
    })

    // Test configuration reloading
    it('should reload changed configuration', async () => {
        const configPath = path.join(testDir, 'config.ttl')
        const backupPath = path.join(testDir, 'config.ttl.bak')

        // Backup original config
        await fs.copyFile(configPath, backupPath)

        try {
            // Modify config
            const config = await fs.readFile(configPath, 'utf8')
            const modified = config.replace('Alice', 'Modified')
            await fs.writeFile(configPath, modified)

            // Run test
            await new Promise((resolve, reject) => {
                exec('node src/api/cli/run.js test_config-settings', {
                    cwd: path.resolve(__dirname, '../..')
                }, (error, stdout, stderr) => {
                    try {
                        expect(stdout).to.include('Modified')
                        resolve()
                    } catch (err) {
                        reject(err)
                    }
                })
            })

        } finally {
            // Restore original config
            await fs.copyFile(backupPath, configPath)
            await fs.unlink(backupPath)
        }
    })

    // Test processor settings interaction
    it('should pass settings between processors', (done) => {
        exec('node src/api/cli/run.js test_config-settings chain', {
            cwd: path.resolve(__dirname, '../..')
        }, (error, stdout, stderr) => {
            try {
                // Verify settings flow through processor chain
                expect(stdout).to.include('first processor setting')
                expect(stdout).to.include('second processor setting')
                expect(stdout).to.include('combined settings')
                done()
            } catch (err) {
                done(err)
            }
        })
    })
})
