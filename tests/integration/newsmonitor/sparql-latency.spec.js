// tests/integration/newsmonitor/sparql-latency.spec.js
import { describe, it, expect } from 'vitest'
import axios from 'axios'
import Config from '../../../src/Config.js'

const shouldRun = process.env.RUN_EXTERNAL_APPS === '1'

describe('NewsMonitor SPARQL latency (integration)', () => {
  const runIt = shouldRun ? it : it.skip

  runIt('responds to a simple count query within 15s', async () => {
    const endpoint = Config.getSparqlEndpoint('newsmonitor')
    const auth = Buffer.from(`${endpoint.username}:${endpoint.password}`).toString('base64')
    const query = 'SELECT (COUNT(*) as ?count) WHERE { ?s ?p ?o } LIMIT 1'
    const started = Date.now()
    const response = await axios.post(
      endpoint.queryEndpoint,
      `query=${encodeURIComponent(query)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
          Accept: 'application/sparql-results+json'
        },
        timeout: 15000
      }
    )
    const elapsed = Date.now() - started
    expect(response.status).toBe(200)
    expect(elapsed).toBeLessThan(15000)
  }, 20000)
})
