// src/apps/newsmonitor/generate-endpoints.js
import Config from '../../Config.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Generate endpoints.json from Config for newsmonitor
 */
function generateEndpoints() {
  const endpoint = Config.getSparqlEndpoint('newsmonitor')

  const endpoints = [
    {
      type: 'query',
      url: endpoint.queryEndpoint,
      credentials: {
        user: endpoint.username,
        password: endpoint.password
      }
    },
    {
      type: 'update',
      url: endpoint.updateEndpoint,
      credentials: {
        user: endpoint.username,
        password: endpoint.password
      }
    }
  ]

  const outputPath = path.join(__dirname, 'data', 'endpoints.json')
  fs.writeFileSync(outputPath, JSON.stringify(endpoints, null, 2))

  console.log(`Generated endpoints.json for ${Config.getEnvironment()} environment`)
  console.log(`Query endpoint: ${endpoint.queryEndpoint}`)
  console.log(`Update endpoint: ${endpoint.updateEndpoint}`)
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateEndpoints()
}

export default generateEndpoints
