// docker/api-handler.js
import axios from 'axios'
import Config from '../src/Config.js'

/**
 * API handler for NewsMonitor frontend
 */
export class APIHandler {
  constructor() {
    this.endpoint = Config.getSparqlEndpoint('newsmonitor')
  }

  /**
   * Query SPARQL endpoint
   */
  async querySparql(query) {
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
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('SPARQL query error:', error.message)
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

      SELECT ?post ?title ?link ?date ?creator ?summary ?feedTitle
      FROM <http://hyperdata.it/content>
      FROM <http://hyperdata.it/feeds>
      WHERE {
        GRAPH <http://hyperdata.it/content> {
          ?post a sioc:Post ;
                dc:title ?title ;
                sioc:link ?link ;
                dc:date ?date ;
                sioc:has_container ?feed .
          OPTIONAL { ?post dc:creator ?creator }
          OPTIONAL { ?post sioc:content ?summary }
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
      FROM <http://hyperdata.it/content>
      WHERE {
        ?post a sioc:Post .
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
    const query = `
      PREFIX sioc: <http://rdfs.org/sioc/ns#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>

      SELECT ?feed ?title ?feedUrl (COUNT(?post) as ?postCount)
      FROM <http://hyperdata.it/feeds>
      FROM <http://hyperdata.it/content>
      WHERE {
        GRAPH <http://hyperdata.it/feeds> {
          ?feed a sioc:Forum ;
                dc:title ?title ;
                sioc:feed_url ?feedUrl .
        }
        OPTIONAL {
          GRAPH <http://hyperdata.it/content> {
            ?post sioc:has_container ?feed .
          }
        }
      }
      GROUP BY ?feed ?title ?feedUrl
      ORDER BY DESC(?postCount)
    `

    const data = await this.querySparql(query)
    return data.results.bindings.map(b => ({
      uri: b.feed.value,
      title: b.title.value,
      feedUrl: b.feedUrl.value,
      postCount: parseInt(b.postCount.value)
    }))
  }

  /**
   * Format SPARQL results to JSON
   */
  formatResults(data) {
    return data.results.bindings.map(binding => ({
      uri: binding.post.value,
      title: binding.title.value,
      link: binding.link.value,
      date: binding.date.value,
      creator: binding.creator?.value || null,
      summary: this.truncateSummary(binding.summary?.value || ''),
      feedTitle: binding.feedTitle.value
    }))
  }

  /**
   * Truncate summary to reasonable length
   */
  truncateSummary(text, maxLength = 300) {
    if (!text) return ''
    // Strip HTML tags
    const stripped = text.replace(/<[^>]*>/g, '')
    if (stripped.length <= maxLength) return stripped
    return stripped.substring(0, maxLength) + '...'
  }

  /**
   * Handle API request
   */
  async handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const path = url.pathname

    try {
      if (path === '/api/posts') {
        const limit = parseInt(url.searchParams.get('limit') || '50')
        const offset = parseInt(url.searchParams.get('offset') || '0')
        const posts = await this.getRecentPosts(limit, offset)

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify({ posts, count: posts.length }))
        return true

      } else if (path === '/api/count') {
        const count = await this.getPostsCount()

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify({ count }))
        return true

      } else if (path === '/api/feeds') {
        const feeds = await this.getFeeds()

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify({ feeds }))
        return true
      }

      return false // Not an API route
    } catch (error) {
      console.error('API error:', error)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: error.message }))
      return true
    }
  }
}
