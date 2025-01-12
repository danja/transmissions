import path from 'path'
import { fileURLToPath } from 'url'
import { expect } from 'chai'
import { exec } from 'child_process'
import fs from 'fs/promises'

describe('run-command test', function () {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const testDir = path.resolve(__dirname, '../../src/applications/test_run-command')

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

    // Create test directory with config if it doesn't exist
    beforeAll(async function () {
        try {
            await fs.mkdir(testDir, { recursive: true })

            const configTtl = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix trm: <http://purl.org/stuff/transmission/> .
@prefix t: <http://hyperdata.it/transmissions/> .

t:RunCommandConfig a trm:ConfigSet ;
    trm:settings t:runCommand ;
    trm:command "echo \\"test\\"" .`

            await fs.writeFile(path.join(testDir, 'config.ttl'), configTtl)

            const transmissionsTtl = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix trm: <http://purl.org/stuff/transmission/> .
@prefix : <http://hyperdata.it/transmissions/> .

:test_run_command a trm:Transmission ;
    trm:pipe (:p10 :p20) .

:p10 a :RunCommand ;
    trm:settings :runCommand .

:p20 a :ShowMessage .`

            await fs.writeFile(path.join(testDir, 'transmissions.ttl'), transmissionsTtl)
        } catch (err) {
            console.error('Setup error:', err)
            throw err
        }
    })

    it('should execute command successfully', (done) => {
        exec('node src/api/cli/run.js test_run-command', async (error, stdout, stderr) => {
            if (error) {
                console.error('Exec error:', error)
                done(error)
                return
            }

            try {
                expect(stdout).to.include('test')
                expect(stderr).to.be.empty
                done()
            } catch (err) {
                console.error('Test error:', err)
                done(err)
            }
        })
    })

    // Clean up test directory after tests
    afterAll(async function () {
        try {
            await fs.rm(testDir, { recursive: true, force: true })
        } catch (err) {
            console.error('Cleanup error:', err)
        }
    })
})
