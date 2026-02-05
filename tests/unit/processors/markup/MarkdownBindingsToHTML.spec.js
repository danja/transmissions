// tests/unit/processors/markup/MarkdownBindingsToHTML.spec.js
import { describe, it, expect } from 'vitest'
import MarkdownBindingsToHTML from '../../../../src/processors/markup/MarkdownBindingsToHTML.js'

const runProcessor = async (processor, message) => new Promise((resolve, reject) => {
    processor.once('message', resolve)
    processor.process(message).catch(reject)
})

describe('MarkdownBindingsToHTML', () => {
    it('adds HTML to SPARQL bindings', async () => {
        const processor = new MarkdownBindingsToHTML({
            simpleConfig: {
                listField: 'queryResults.results.bindings',
                sourceField: 'content.value',
                outputField: 'contentHtml'
            }
        })

        const message = {
            queryResults: {
                results: {
                    bindings: [
                        {
                            content: { type: 'literal', value: 'Hello **world**' }
                        }
                    ]
                }
            }
        }

        const result = await runProcessor(processor, message)
        const html = result.queryResults.results.bindings[0].contentHtml.value
        expect(html).toContain('<strong>world</strong>')
    })

    it('normalizes escaped newlines before conversion', async () => {
        const processor = new MarkdownBindingsToHTML({
            simpleConfig: {
                listField: 'queryResults.results.bindings',
                sourceField: 'content.value',
                outputField: 'contentHtml'
            }
        })

        const message = {
            queryResults: {
                results: {
                    bindings: [
                        {
                            content: { type: 'literal', value: 'Line1\\\\n\\\\nLine2' }
                        }
                    ]
                }
            }
        }

        const result = await runProcessor(processor, message)
        const html = result.queryResults.results.bindings[0].contentHtml.value
        expect(html).toContain('Line1')
        expect(html).toContain('Line2')
        expect(html).not.toContain('\\\\n')
    })
})
