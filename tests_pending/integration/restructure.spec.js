import footpath from '../../src/utils/footpath.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { expect } from 'chai'
import { exec } from 'child_process'
import fs from 'fs/promises'

describe('test_restructure', function () {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const workingDir = path.join(__dirname, '../../src/applications/test_restructure/data')

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

    async function clearOutputFiles() {
        console.log('Clearing output files...')
        const outputDir = path.join(workingDir, 'output')
        const files = await fs.readdir(outputDir)
        for (const file of files) {
            if (file.startsWith('output-')) {
                await fs.unlink(path.join(outputDir, file))
                console.log(`Deleted ${file}`)
            }
        }
    }

    async function compareFiles(index) {
        const outputFile = path.join(workingDir, 'output', `output-${index}.json`)
        const requiredFile = path.join(workingDir, 'output', `required-${index}.json`)

        console.log(`Comparing files:`)
        console.log(`Output: ${outputFile}`)
        console.log(`Required: ${requiredFile}`)

        const output = JSON.parse(await fs.readFile(outputFile, 'utf8'))
        const required = JSON.parse(await fs.readFile(requiredFile, 'utf8'))

        // Deep compare objects instead of strings
        return JSON.stringify(output) === JSON.stringify(required)
    }

    beforeEach(async () => {
        await clearOutputFiles()
    })

    it('should process files correctly', (done) => {
        console.log('Running transmission...')
        exec('node src/api/cli/run.js test_restructure', async (error, stdout, stderr) => {
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