import footpath from '../../src/utils/footpath.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { expect } from 'chai'
import fs from 'fs/promises'

describe('fs-rw simple test', function () {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const rootDir = path.resolve(__dirname, '../../')

    const outputFile = path.join(rootDir, 'src/applications/test_fs-rw/data/output/output-01.md')
    const requiredFile = path.join(rootDir, 'src/applications/test_fs-rw/data/output/required-01.md')

    beforeEach(async () => {
        try {
            await fs.unlink(outputFile)
        } catch (error) {
            if (error.code !== 'ENOENT') throw error
        }
    })

    it('should process file correctly', async () => {
        // Run the simple script
        await import('../../src/applications/test_fs-rw/simple.js')

        // Read and compare files
        const output = await fs.readFile(outputFile, 'utf8')
        const required = await fs.readFile(requiredFile, 'utf8')

        expect(output.trim()).to.equal(required.trim())
    })
})