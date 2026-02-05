// tests/integration/newsmonitor/http-posts-escaping.spec.js
import { describe, it, expect } from 'vitest'
import axios from 'axios'

const BASE_URL = process.env.NEWSMONITOR_BASE_URL || 'http://localhost:6011'

describe('NewsMonitor HTTP escaping (integration)', () => {
  it('responds to health check quickly', async () => {
    const started = Date.now()
    const response = await axios.get(`${BASE_URL}/api/health`, {
      timeout: 3000
    })
    const elapsed = Date.now() - started
    expect(response.status).toBe(200)
    expect(elapsed).toBeLessThan(3000)
  }, 5000)

  it('returns posts without escaped newlines in summary', async () => {
    const started = Date.now()
    const response = await axios.get(`${BASE_URL}/api/posts?limit=10`, {
      timeout: 15000
    })
    const elapsed = Date.now() - started
    expect(response.status).toBe(200)
    expect(response.data).toBeTruthy()
    expect(Array.isArray(response.data.posts)).toBe(true)
    if (response.data.posts.length === 0) {
      return
    }
    const sample = response.data.posts[0]
    expect(typeof sample.summary).toBe('string')
    expect(sample.summary).not.toContain('\\n')
    expect(elapsed).toBeLessThan(15000)
  }, 20000)
})
