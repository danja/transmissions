// tests/integration/newsmonitor/api-posts-escaping.spec.js
import { describe, it, expect } from 'vitest'
import axios from 'axios'
import Config from '../../../src/Config.js'
import { APIHandler } from '../../../docker/api-handler.js'

const TEST_POST_URI = 'http://hyperdata.it/posts/test-escape-post'
const TEST_FEED_URI = 'http://hyperdata.it/feeds/test-escape-feed'

function buildAuthHeader(endpoint) {
  const auth = Buffer.from(`${endpoint.username}:${endpoint.password}`).toString('base64')
  return `Basic ${auth}`
}

async function sparqlUpdate(endpoint, update) {
  await axios.post(endpoint.updateEndpoint, `update=${encodeURIComponent(update)}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: buildAuthHeader(endpoint)
    }
  })
}

describe('NewsMonitor API escaping (integration)', () => {
  it('returns summaries without escaped newlines', async () => {
    const endpoint = Config.getSparqlEndpoint('newsmonitor')

    const nowIso = new Date().toISOString()
    const insert = `
      PREFIX sioc: <http://rdfs.org/sioc/ns#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX content: <http://purl.org/rss/1.0/modules/content/>

      INSERT DATA {
        GRAPH <http://hyperdata.it/feeds> {
          <${TEST_FEED_URI}> a sioc:Forum ;
            dc:title "Escape Test Feed" ;
            sioc:feed_url <http://example.com/feed> .
        }
        GRAPH <http://hyperdata.it/content> {
          <${TEST_POST_URI}> a sioc:Post ;
            dc:title "Escape Test Post" ;
            sioc:link <http://example.com/post> ;
            dc:date "${nowIso}"^^<http://www.w3.org/2001/XMLSchema#dateTime> ;
            sioc:has_container <${TEST_FEED_URI}> ;
            sioc:content "Line1\\\\\\\\n\\\\\\\\nLine2\\\\\\\\tTabbed" ;
            content:encoded "Full\\\\\\\\n\\\\\\\\nContent" .
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
      const handler = new APIHandler()
      const posts = await handler.getRecentPosts(10, 0)
      const testPost = posts.find(post => post.uri === TEST_POST_URI)
      expect(testPost).toBeTruthy()
      expect(testPost.summary).not.toContain('\\\\n')
      expect(testPost.summary).toContain('Full')
      expect(testPost.summary).toContain('Content')
    } finally {
      await sparqlUpdate(endpoint, cleanup)
    }
  })
})
