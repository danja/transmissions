// tests/unit/processors/util/MessageChangeDetector.spec.js
import { describe, it, expect, beforeEach } from 'vitest'
import { rm } from 'node:fs/promises'
import path from 'path'
import MessageChangeDetector from '../../../../src/processors/util/MessageChangeDetector.js'

const runProcessor = async (processor, message) => new Promise((resolve, reject) => {
    processor.once('message', resolve)
    processor.process(message).catch(reject)
})

describe('MessageChangeDetector', () => {
    const tmpDir = '/tmp'
    const cacheFile = path.join(tmpDir, 'message-change-cache.test.json')

    beforeEach(async () => {
        await rm(cacheFile, { force: true })
    })

    it('skips messages with unchanged key/value', async () => {
        const processor = new MessageChangeDetector({
            simpleConfig: {
                cacheFile,
                keyField: 'contentBlocks.uri',
                valueField: 'contentBlocks.created'
            }
        })

        const message = {
            contentBlocks: {
                uri: 'urn:test:1',
                created: '2026-02-01T00:00:00Z'
            }
        }

        const first = await runProcessor(processor, message)
        expect(first.done).not.toBe(true)

        const second = await runProcessor(processor, {
            contentBlocks: {
                uri: 'urn:test:1',
                created: '2026-02-01T00:00:00Z'
            }
        })
        expect(second.done).toBe(true)
        expect(second.skipped).toBe(true)

        await runProcessor(processor, { done: true })
    })
})
