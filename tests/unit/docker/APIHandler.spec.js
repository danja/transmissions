// tests/unit/docker/APIHandler.spec.js
import { describe, it, expect } from 'vitest'
import { APIHandler } from '../../../docker/api-handler.js'

describe('APIHandler', () => {
  it('normalizes escaped text sequences', () => {
    const handler = new APIHandler()
    const input = 'Line1\\\\n\\\\nLine2\\\\tTabbed\\\\rCarriage\\\\\\"Quote\\\\\\\\'
    const output = handler.normalizeEscapedText(input)
    expect(output).toContain('Line1\n\nLine2\tTabbed\nCarriage"Quote\\')
    expect(output).not.toContain('\\\\n')
    expect(output).not.toContain('\\\\t')
    expect(output).not.toContain('\\\\r')
  })

  it('renders markdown and unescapes before conversion', async () => {
    const handler = new APIHandler()
    const input = 'Hello **world**\\\\n\\\\nNext line'
    const html = await handler.renderMarkdownIfNeeded(input)
    expect(html).toContain('<strong>world</strong>')
    expect(html).toContain('Next line')
    expect(html).not.toContain('\\\\n')
  })
})
