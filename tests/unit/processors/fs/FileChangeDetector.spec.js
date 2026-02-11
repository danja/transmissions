// tests/unit/processors/fs/FileChangeDetector.spec.js
import { describe, it, expect, beforeEach } from 'vitest'
import { writeFile, rm } from 'node:fs/promises'
import path from 'path'
import FileChangeDetector from '../../../../src/processors/fs/FileChangeDetector.js'

const runProcessor = async (processor, message) => new Promise((resolve, reject) => {
    processor.once('message', resolve)
    processor.process(message).catch(reject)
})

describe('FileChangeDetector', () => {
    const tmpDir = '/tmp'
    const cacheFile = path.join(tmpDir, 'md-to-sparqlstore-cache.test.json')
    const testFile = path.join(tmpDir, 'md-to-sparqlstore-change.txt')

    beforeEach(async () => {
        await writeFile(testFile, `hello-${Date.now()}`, 'utf8')
        await rm(cacheFile, { force: true })
    })

    it('marks unchanged files as done on subsequent runs', async () => {
        const processor = new FileChangeDetector({
            simpleConfig: {
                cacheFile,
                pathField: 'fullPath'
            }
        })

        const first = await runProcessor(processor, { fullPath: testFile })
        expect(first.done).not.toBe(true)

        const second = await runProcessor(processor, { fullPath: testFile })
        expect(second.done).toBe(true)
        expect(second.skipped).toBe(true)

        await runProcessor(processor, { done: true })
    })
})
