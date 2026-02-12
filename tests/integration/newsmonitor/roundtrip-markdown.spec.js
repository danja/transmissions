// tests/integration/newsmonitor/roundtrip-markdown.spec.js
import { describe, it, expect } from 'vitest'
import axios from 'axios'
import Config from '../../../src/Config.js'
import HTMLToMarkdown from '../../../src/processors/markup/HTMLToMarkdown.js'
import MarkdownBindingsToHTML from '../../../src/processors/markup/MarkdownBindingsToHTML.js'

const TEST_POST_URI = 'http://hyperdata.it/posts/test-roundtrip-post'
const TEST_FEED_URI = 'http://hyperdata.it/feeds/test-roundtrip-feed'

const runProcessor = async (processor, message) => new Promise((resolve, reject) => {
  processor.once('message', resolve)
  processor.process(message).catch(reject)
})

const buildAuthHeader = (endpoint) => {
  const auth = Buffer.from(`${endpoint.username}:${endpoint.password}`).toString('base64')
  return `Basic ${auth}`
}

const sparqlUpdate = async (endpoint, update) => {
  await axios.post(endpoint.updateEndpoint, `update=${encodeURIComponent(update)}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: buildAuthHeader(endpoint)
    }
  })
}

const sparqlSelect = async (endpoint, query) => {
  const response = await axios.post(endpoint.queryEndpoint, `query=${encodeURIComponent(query)}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: buildAuthHeader(endpoint),
      Accept: 'application/sparql-results+json'
    }
  })
  return response.data
}

const toSparqlString = (value) => {
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/"""/g, '\\"""')
  return `"""${escaped}"""`
}

describe('NewsMonitor markdown round-trip (integration)', () => {
  it('preserves core formatting from HTML -> Markdown -> HTML', async () => {
    const endpoint = Config.getSparqlEndpoint('newsmonitor')
    const nowIso = new Date().toISOString()

    const sampleHtml = `
      <article>
        <h2>Sample Title</h2>
        <p>This is a <strong>bold</strong> and <em>italic</em> sentence with a
        <a href="https://example.com">link</a>.</p>
        <p>Inline code: <code>const x = 1</code></p>
        <p>Second paragraph with extra spacing.</p>
        <pre><code>function test() {\n  return true;\n}</code></pre>
        <ul>
          <li>First item</li>
          <li>Second item</li>
        </ul>
      </article>
    `

    const htmlToMarkdown = new HTMLToMarkdown({
      simpleConfig: {
        inputField: 'html',
        outputField: 'markdown'
      }
    })

    const markdownMessage = await runProcessor(htmlToMarkdown, { html: sampleHtml })
    const markdown = markdownMessage.markdown

    expect(markdown).toContain('## Sample Title')
    expect(markdown).toContain('**bold**')
    expect(markdown).toContain('*italic*')
    expect(markdown).toContain('[link](https://example.com)')
    expect(markdown).toContain('`const x = 1`')
    expect(markdown).toContain('```')
    expect(markdown).toContain('- First item')
    expect(markdown).toMatch(/Inline code:[\s\S]*\n\nSecond paragraph with extra spacing\./)
    expect(markdown).not.toMatch(/\n\s{4}This is a \*\*bold\*\*/)

    const insert = `
      PREFIX sioc: <http://rdfs.org/sioc/ns#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>

      INSERT DATA {
        GRAPH <http://hyperdata.it/feeds> {
          <${TEST_FEED_URI}> a sioc:Forum ;
            dc:title "Roundtrip Test Feed" ;
            sioc:feed_url <http://example.com/feed> .
        }
        GRAPH <http://hyperdata.it/content> {
          <${TEST_POST_URI}> a sioc:Post ;
            dc:title "Roundtrip Test Post" ;
            sioc:link <http://example.com/post> ;
            dc:date "${nowIso}"^^<http://www.w3.org/2001/XMLSchema#dateTime> ;
            sioc:has_container <${TEST_FEED_URI}> ;
            sioc:content ${toSparqlString(markdown)} .
        }
      }
    `

    const cleanup = `
      PREFIX sioc: <http://rdfs.org/sioc/ns#>
      DELETE WHERE { GRAPH <http://hyperdata.it/content> { <${TEST_POST_URI}> ?p ?o } };
      DELETE WHERE { GRAPH <http://hyperdata.it/feeds> { <${TEST_FEED_URI}> ?p ?o } }
    `

    await sparqlUpdate(endpoint, insert)

    try {
      const select = `
        PREFIX sioc: <http://rdfs.org/sioc/ns#>
        SELECT ?content WHERE {
          GRAPH <http://hyperdata.it/content> {
            <${TEST_POST_URI}> sioc:content ?content .
          }
        }
      `

      const data = await sparqlSelect(endpoint, select)
      const bindings = data.results.bindings
      expect(bindings.length).toBe(1)

      const mdToHtml = new MarkdownBindingsToHTML({
        simpleConfig: {
          listField: 'queryResults.results.bindings',
          sourceField: 'content.value',
          outputField: 'contentHtml'
        }
      })

      const htmlMessage = await runProcessor(mdToHtml, { queryResults: data })
      const html = htmlMessage.queryResults.results.bindings[0].contentHtml.value

      expect(html).toContain('<h2>Sample Title</h2>')
      expect(html).toContain('<p>This is a <strong>bold</strong> and <em>italic</em> sentence with a')
      expect(html).toContain('<p>Inline code: <code>const x = 1</code></p>')
      expect(html).toContain('<p>Second paragraph with extra spacing.</p>')
      expect(html).toContain('<a href="https://example.com">link</a>')
      expect(html).toContain('<ul>')
      expect(html).toContain('<li>First item</li>')
    } finally {
      await sparqlUpdate(endpoint, cleanup)
    }
  })
})
