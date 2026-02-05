// tests/unit/processors/markup/HTMLToMarkdown.spec.js
import { describe, it, expect } from 'vitest'
import HTMLToMarkdown from '../../../../src/processors/markup/HTMLToMarkdown.js'

const runProcessor = async (processor, message) => new Promise((resolve, reject) => {
    processor.once('message', resolve)
    processor.process(message).catch(reject)
})

describe('HTMLToMarkdown', () => {
    it('converts basic HTML to markdown', async () => {
        const processor = new HTMLToMarkdown({
            simpleConfig: {
                inputField: 'html',
                outputField: 'md'
            }
        })

        const message = {
            html: '<h1>Title</h1><p>Hello <strong>world</strong>.</p>'
        }

        const result = await runProcessor(processor, message)
        expect(result.md).toContain('# Title')
        expect(result.md).toContain('Hello **world**.')
    })

    it('removes script content by default', async () => {
        const processor = new HTMLToMarkdown({
            simpleConfig: {
                inputField: 'html',
                outputField: 'md'
            }
        })

        const message = {
            html: '<p>Keep</p><script>alert("bad")</script><p>Safe</p>'
        }

        const result = await runProcessor(processor, message)
        expect(result.md).toContain('Keep')
        expect(result.md).toContain('Safe')
        expect(result.md).not.toContain('bad')
    })
})
