// tests/integration/fs-rw.spec.js
import footpath from '../../src/utils/footpath.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { expect } from 'chai'
import { exec } from 'child_process'
import fs from 'fs/promises'

describe('fs-rw test', function () {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const dataDir = path.join(__dirname, '../../src/applications/test_fs-rw/data')

    // Set timeout for the entire suite
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

    async function clearOutputFiles() {
        console.log('Clearing output files...')
        const outputDir = path.join(dataDir, 'output')
        const files = await fs.readdir(outputDir)
        for (const file of files) {
            if (file.startsWith('output-')) {
                await fs.unlink(path.join(outputDir, file))
                console.log(`Deleted ${file}`)
            }
        }
    }

    async function compareFiles(index) {
        const outputFile = path.join(dataDir, 'output', `output-${index}.md`)
        const requiredFile = path.join(dataDir, 'output', `required-${index}.md`)

        console.log(`Comparing files:`)
        console.log(`Output: ${outputFile}`)
        console.log(`Required: ${requiredFile}`)

        const output = await fs.readFile(outputFile, 'utf8')
        const required = await fs.readFile(requiredFile, 'utf8')

        if (output.trim() !== required.trim()) {
            console.log('Files differ:')
            console.log('Output:', output)
            console.log('Required:', required)
        }

        return output.trim() === required.trim()
    }

    beforeEach(async () => {
        await clearOutputFiles()
    })

    it('should process files correctly', (done) => {
        console.log('Running transmission...')
        exec('node src/api/cli/run.js test_fs-rw', async (error, stdout, stderr) => {
            if (error) {
                console.error('Exec error:', error)
                done(error)
                return
            }

            try {
                console.log('Transmission output:', stdout)
                if (stderr) console.error('Stderr:', stderr)

                const matched = await compareFiles('01')
                expect(matched).to.be.true
                done()
            } catch (err) {
                console.error('Test error:', err)
                done(err)
            }
        })
    })
})