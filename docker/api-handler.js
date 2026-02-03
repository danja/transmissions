// docker/api-handler.js
import axios from 'axios'
import Config from '../src/Config.js'
import { spawn } from 'child_process'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * API handler for NewsMonitor frontend
 */
export class APIHandler {
  constructor() {
    this.endpoint = Config.getSparqlEndpoint('newsmonitor')
    this.adminUsername = Config.getEnv('NEWSMONITOR_ADMIN_USERNAME', 'admin')
    this.adminPassword = Config.getEnv('NEWSMONITOR_ADMIN_PASSWORD')
    this.dataDir = path.join(__dirname, '..', 'src', 'apps', 'newsmonitor', 'data')
  }

  /**
   * Query SPARQL endpoint
   */
  async querySparql(query, timeout = 30000) {
    const auth = Buffer.from(
      `${this.endpoint.username}:${this.endpoint.password}`
    ).toString('base64')

    try {
      const response = await axios.post(
        this.endpoint.queryEndpoint,
        `query=${encodeURIComponent(query)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${auth}`,
            Accept: 'application/sparql-results+json'
          },
          timeout: timeout
        }
      )
      return response.data
    } catch (error) {
      console.error('SPARQL query error:', error.message)
      console.error('Endpoint:', this.endpoint.queryEndpoint)
      console.error('Query:', query.substring(0, 200))
      if (error.code === 'ECONNABORTED') {
        console.error('Query timed out after', timeout, 'ms')
      }
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      }
      throw error
    }
  }

  /**
   * Get recent posts with summaries
   */
  async getRecentPosts(limit = 50, offset = 0) {
    const query = `
      PREFIX sioc: <http://rdfs.org/sioc/ns#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX content: <http://purl.org/rss/1.0/modules/content/>

      SELECT ?post ?title ?link ?date ?creator ?summary ?fullContent ?feedTitle
      WHERE {
        GRAPH <http://hyperdata.it/content> {
          ?post a sioc:Post ;
                dc:title ?title ;
                sioc:link ?link ;
                dc:date ?date ;
                sioc:has_container ?feed .
          OPTIONAL { ?post dc:creator ?creator }
          OPTIONAL { ?post sioc:content ?summary }
          OPTIONAL { ?post content:encoded ?fullContent }
        }
        GRAPH <http://hyperdata.it/feeds> {
          ?feed dc:title ?feedTitle .
        }
      }
      ORDER BY DESC(?date)
      LIMIT ${limit}
      OFFSET ${offset}
    `

    const data = await this.querySparql(query)
    return this.formatResults(data)
  }

  /**
   * Get posts count
   */
  async getPostsCount() {
    const query = `
      PREFIX sioc: <http://rdfs.org/sioc/ns#>

      SELECT (COUNT(?post) as ?count)
      WHERE {
        GRAPH <http://hyperdata.it/content> {
          ?post a sioc:Post .
        }
      }
    `

    const data = await this.querySparql(query)
    if (data.results.bindings.length > 0) {
      return parseInt(data.results.bindings[0].count.value)
    }
    return 0
  }

  /**
   * Get feeds list
   */
  async getFeeds() {
    // First get all feeds (fast query without aggregation)
    const feedsQuery = `
      PREFIX sioc: <http://rdfs.org/sioc/ns#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>

      SELECT ?feed ?title ?feedUrl
      WHERE {
        GRAPH <http://hyperdata.it/feeds> {
          ?feed a sioc:Forum ;
                dc:title ?title ;
                sioc:feed_url ?feedUrl .
        }
      }
      ORDER BY ?title
    `

    // Then get post counts (can be slow but separate)
    const countsQuery = `
      PREFIX sioc: <http://rdfs.org/sioc/ns#>

      SELECT ?feed (COUNT(?post) as ?postCount)
      WHERE {
        GRAPH <http://hyperdata.it/content> {
          ?post sioc:has_container ?feed .
        }
      }
      GROUP BY ?feed
    `

    try {
      const [feedsData, countsData] = await Promise.all([
        this.querySparql(feedsQuery, 10000),  // 10s timeout for feeds
        this.querySparql(countsQuery, 20000).catch(() => ({ results: { bindings: [] } }))  // 20s for counts, optional
      ])

      // Build counts map
      const counts = {}
      countsData.results.bindings.forEach(b => {
        counts[b.feed.value] = parseInt(b.postCount.value)
      })

      // Combine feeds with their counts
      return feedsData.results.bindings.map(b => ({
        uri: b.feed.value,
        title: b.title.value,
        feedUrl: b.feedUrl.value,
        postCount: counts[b.feed.value] || 0
      })).sort((a, b) => b.postCount - a.postCount)  // Sort by post count desc
    } catch (error) {
      console.error('Error fetching feeds:', error.message)
      throw error
    }
  }

  /**
   * Format SPARQL results to JSON
   */
  formatResults(data) {
    return data.results.bindings.map(binding => {
      // Prefer full content for paragraph extraction, fall back to summary
      const fullContent = binding.fullContent?.value || ''
      const summary = binding.summary?.value || ''
      const contentText = fullContent || summary

      // Extract first couple paragraphs if we have content
      const formattedContent = contentText
        ? this.extractParagraphs(contentText, 2)
        : this.truncateSummary(summary)

      return {
        uri: binding.post.value,
        title: binding.title.value,
        link: binding.link.value,
        date: binding.date.value,
        creator: binding.creator?.value || null,
        summary: formattedContent,
        feedTitle: binding.feedTitle.value
      }
    })
  }

  /**
   * Extract first few paragraphs from content
   */
  extractParagraphs(text, maxParagraphs = 2) {
    if (!text) return ''

    // Split into paragraphs (look for double newlines or <p> tags)
    let paragraphs = []

    // Try HTML paragraphs first
    const pTagMatch = text.match(/<p[^>]*>(.*?)<\/p>/gi)
    if (pTagMatch && pTagMatch.length > 0) {
      paragraphs = pTagMatch
        .slice(0, maxParagraphs)
        .map(p => p.replace(/<p[^>]*>|<\/p>/gi, '').trim())
        .filter(p => p.length > 0)
    } else {
      // Fall back to text-based paragraphs
      const textParagraphs = text
        .split(/\n\s*\n/)
        .map(p => p.replace(/<[^>]*>/g, '').trim())
        .filter(p => p.length > 50) // Skip very short paragraphs

      paragraphs = textParagraphs.slice(0, maxParagraphs)
    }

    // Join paragraphs
    let result = paragraphs.join('\n\n')

    // Clean up any remaining HTML tags
    result = result.replace(/<[^>]*>/g, '')

    // Truncate if still too long (max ~600 chars for 2 paragraphs)
    if (result.length > 800) {
      result = result.substring(0, 800) + '...'
    }

    return result
  }

  /**
   * Truncate summary to reasonable length (fallback)
   */
  truncateSummary(text, maxLength = 300) {
    if (!text) return ''
    // Strip HTML tags
    const stripped = text.replace(/<[^>]*>/g, '')
    if (stripped.length <= maxLength) return stripped
    return stripped.substring(0, maxLength) + '...'
  }

  /**
   * Run a transmissions command
   */
  runTransCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      const trans = spawn('./trans', [command, ...args], {
        cwd: path.join(__dirname, '..'),
        stdio: ['pipe', 'pipe', 'pipe']
      })

      let stdout = ''
      let stderr = ''

      trans.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      trans.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      trans.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr, code })
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr || stdout}`))
        }
      })

      trans.on('error', (err) => {
        reject(err)
      })
    })
  }

  /**
   * Subscribe to a feed
   */
  async subscribeToFeed(url) {
    try {
      const result = await this.runTransCommand(
        'src/apps/newsmonitor/subscribe',
        ['-m', `{"url":"${url}"}`]
      )
      return { success: true, url }
    } catch (error) {
      console.error(`Failed to subscribe to ${url}:`, error.message)
      return { success: false, url, error: error.message }
    }
  }

  /**
   * Unsubscribe from a feed
   */
  async unsubscribeFromFeed(feedUri) {
    try {
      // Delete feed from SPARQL store
      const deleteQuery = `
        PREFIX sioc: <http://rdfs.org/sioc/ns#>

        DELETE WHERE {
          GRAPH <http://hyperdata.it/feeds> {
            <${feedUri}> ?p ?o .
          }
        }
      `

      const auth = Buffer.from(
        `${this.endpoint.username}:${this.endpoint.password}`
      ).toString('base64')

      const response = await axios.post(
        this.endpoint.updateEndpoint,
        `update=${encodeURIComponent(deleteQuery)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${auth}`
          }
        }
      )

      return { success: true, feedUri }
    } catch (error) {
      console.error(`Failed to unsubscribe from ${feedUri}:`, error.message)
      throw error
    }
  }

  /**
   * Parse request body (for POST requests)
   */
  parseBody(req) {
    return new Promise((resolve, reject) => {
      let body = ''
      req.on('data', chunk => {
        body += chunk.toString()
      })
      req.on('end', () => {
        try {
          resolve(JSON.parse(body))
        } catch (err) {
          reject(new Error('Invalid JSON'))
        }
      })
      req.on('error', reject)
    })
  }

  /**
   * Handle API request
   */
  async handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const routePath = url.pathname

    try {
      if (routePath === '/api/admin-check') {
        if (!this.requireAdminAuth(req, res)) {
          return true
        }

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify({ status: 'ok', user: this.adminUsername }))
        return true
      }

      // Subscribe to feeds (POST)
      if (routePath === '/api/subscribe' && req.method === 'POST') {
        if (!this.requireAdminAuth(req, res)) {
          return true
        }

        const body = await this.parseBody(req)
        const urls = body.urls || []

        if (!Array.isArray(urls) || urls.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'URLs array required' }))
          return true
        }

        // Subscribe to each feed
        const results = await Promise.all(
          urls.map(url => this.subscribeToFeed(url))
        )

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify({ results }))
        return true
      }

      // Unsubscribe from feed (POST)
      if (routePath === '/api/unsubscribe' && req.method === 'POST') {
        if (!this.requireAdminAuth(req, res)) {
          return true
        }

        const body = await this.parseBody(req)
        const feedUri = body.feedUri

        if (!feedUri) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'feedUri required' }))
          return true
        }

        await this.unsubscribeFromFeed(feedUri)

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify({ success: true }))
        return true
      }

      // Update all feeds (POST)
      if (routePath === '/api/update-feeds' && req.method === 'POST') {
        if (!this.requireAdminAuth(req, res)) {
          return true
        }

        try {
          console.log('Manual feed update triggered via API')
          const result = await this.runTransCommand('src/apps/newsmonitor/update-all')

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
          res.end(JSON.stringify({
            success: true,
            message: 'Feed update completed',
            output: result.stdout
          }))
          return true
        } catch (error) {
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
          res.end(JSON.stringify({
            success: false,
            error: error.message
          }))
          return true
        }
      }

      // Subscribe feeds from OPML (POST)
      if (routePath === '/api/subscribe-opml' && req.method === 'POST') {
        if (!this.requireAdminAuth(req, res)) {
          return true
        }

        const body = await this.parseBody(req)
        const opmlText = body.opmlText

        if (!opmlText || typeof opmlText !== 'string') {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'opmlText is required' }))
          return true
        }

        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'newsmonitor-opml-'))
        const tempFile = path.join(tempDir, `feeds-${Date.now()}.opml`)

        try {
          await fs.writeFile(tempFile, opmlText, 'utf8')
          const result = await this.runTransCommand(
            'src/apps/newsmonitor/subscribe-from-opml',
            ['-m', JSON.stringify({ sourceFile: tempFile })]
          )

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
          res.end(JSON.stringify({
            success: true,
            output: result.stdout
          }))
          return true
        } catch (error) {
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
          res.end(JSON.stringify({
            success: false,
            error: error.message
          }))
          return true
        } finally {
          await fs.unlink(tempFile).catch(() => {})
          await fs.rmdir(tempDir).catch(() => {})
        }
      }

      // Export OPML (POST)
      if (routePath === '/api/export-opml' && req.method === 'POST') {
        if (!this.requireAdminAuth(req, res)) {
          return true
        }

        try {
          await this.runTransCommand('src/apps/newsmonitor/export-opml')
          const outputPath = path.join(this.dataDir, 'feeds.opml')
          const opml = await fs.readFile(outputPath, 'utf8')

          res.writeHead(200, {
            'Content-Type': 'application/xml',
            'Content-Disposition': 'attachment; filename="newsmonitor-feeds.opml"',
            'Access-Control-Allow-Origin': '*'
          })
          res.end(opml)
          return true
        } catch (error) {
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
          res.end(JSON.stringify({
            success: false,
            error: error.message
          }))
          return true
        }
      }

      if (routePath === '/api/posts') {
        const limit = parseInt(url.searchParams.get('limit') || '50')
        const offset = parseInt(url.searchParams.get('offset') || '0')
        const posts = await this.getRecentPosts(limit, offset)

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify({ posts, count: posts.length }))
        return true

      } else if (routePath === '/api/count') {
        const count = await this.getPostsCount()

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify({ count }))
        return true

      } else if (routePath === '/api/feeds') {
        const feeds = await this.getFeeds()

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify({ feeds }))
        return true

      } else if (routePath === '/api/health') {
        // Health check endpoint with config info
        const health = {
          status: 'ok',
          endpoint: {
            query: this.endpoint.queryEndpoint,
            update: this.endpoint.updateEndpoint,
            dataset: this.endpoint.dataset
          },
          timestamp: new Date().toISOString()
        }

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify(health))
        return true

      } else if (routePath === '/api/diagnostics') {
        // Diagnostic endpoint to test SPARQL connectivity
        try {
          const startTime = Date.now()

          // Test simple query
          const testQuery = `SELECT (COUNT(*) as ?count) WHERE { ?s ?p ?o } LIMIT 1`
          await this.querySparql(testQuery, 5000)

          const duration = Date.now() - startTime

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
          res.end(JSON.stringify({
            status: 'ok',
            sparql: {
              endpoint: this.endpoint.queryEndpoint,
              reachable: true,
              responseTime: duration + 'ms'
            },
            timestamp: new Date().toISOString()
          }))
        } catch (error) {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
          res.end(JSON.stringify({
            status: 'error',
            sparql: {
              endpoint: this.endpoint.queryEndpoint,
              reachable: false,
              error: error.message,
              code: error.code
            },
            timestamp: new Date().toISOString()
          }))
        }
        return true
      }

      return false // Not an API route
    } catch (error) {
      console.error('API error:', error)
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
      res.end(JSON.stringify({
        error: error.message,
        endpoint: this.endpoint?.queryEndpoint
      }))
      return true
    }
  }

  requireAdminAuth(req, res) {
    if (!this.adminPassword) {
      console.error('Admin password missing: set NEWSMONITOR_ADMIN_PASSWORD in .env')
      res.writeHead(503, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
      res.end(JSON.stringify({ error: 'Admin password not configured' }))
      return false
    }

    if (!this.isAdminAuthorized(req)) {
      res.writeHead(401, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'WWW-Authenticate': 'Basic realm="NewsMonitor Admin"'
      })
      res.end(JSON.stringify({ error: 'Admin authentication required' }))
      return false
    }

    return true
  }

  isAdminAuthorized(req) {
    const authHeader = req.headers.authorization || ''
    if (!authHeader.startsWith('Basic ')) {
      return false
    }

    const encoded = authHeader.slice('Basic '.length)
    let decoded
    try {
      decoded = Buffer.from(encoded, 'base64').toString('utf8')
    } catch (error) {
      return false
    }

    const separatorIndex = decoded.indexOf(':')
    if (separatorIndex === -1) {
      return false
    }

    const username = decoded.slice(0, separatorIndex)
    const password = decoded.slice(separatorIndex + 1)

    return username === this.adminUsername && password === this.adminPassword
  }
}
