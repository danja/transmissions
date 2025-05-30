import footpath from '../../src/utils/footpath.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { expect } from 'chai'
import fs from 'fs/promises'

describe('restructure simple test', function () {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const rootDir = path.resolve(__dirname, '../../')

    const outputFile = path.join(rootDir, 'src/apps/test_restructure/data/output/output-01.json')
    const requiredFile = path.join(rootDir, 'src/apps/test_restructure/data/output/required-01.json')

    beforeEach(async () => {
        try {
            await fs.unlink(outputFile)
        } catch (error) {
            if (error.code !== 'ENOENT') throw error
        }
    })

    it('should process JSON file correctly', async () => {
        console.log('Running restructure test')
        // Run the simple restructure script
        await import('../../src/apps/test_restructure/simple.js')

        // Read and parse both files
        const output = JSON.parse(await fs.readFile(outputFile, 'utf8'))
        const required = JSON.parse(await fs.readFile(requiredFile, 'utf8'))

        // Compare JSON structures
        expect(output).to.deep.equal(required)
    })
})