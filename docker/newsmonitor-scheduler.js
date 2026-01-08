// docker/newsmonitor-scheduler.js
import { spawn } from 'child_process'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Config from '../src/Config.js'
import generateEndpoints from '../src/apps/newsmonitor/generate-endpoints.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL || 3600000 // 1 hour default
const RENDER_INTERVAL = process.env.RENDER_INTERVAL || 300000 // 5 minutes default

// Generate endpoints.json on startup
console.log('Generating endpoints.json from Config...')
try {
  generateEndpoints()
} catch (error) {
  console.error('Failed to generate endpoints:', error.message)
  process.exit(1)
}

// Simple HTTP server to serve generated HTML
const newsmonitorConfig = Config.getService('newsmonitor')
const PORT = newsmonitorConfig?.port || 8080
const DATA_DIR = path.join(__dirname, '..', 'src', 'apps', 'newsmonitor', 'data')

const server = http.createServer((req, res) => {
  let filePath = path.join(DATA_DIR, req.url === '/' ? 'index.html' : req.url)

  // Security: prevent directory traversal
  if (!filePath.startsWith(DATA_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' })
    res.end('Forbidden')
    return
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not Found')
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Server Error')
      }
      return
    }

    const ext = path.extname(filePath)
    const contentTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json'
    }

    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' })
    res.end(data)
  })
})

server.listen(PORT, () => {
  console.log(`NewsMonitor HTTP server running on port ${PORT}`)
  console.log(`Environment: ${Config.getEnvironment()}`)
})

/**
 * Run a transmissions command
 */
function runTransCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ./trans ${command} ${args.join(' ')}`)

    const trans = spawn('./trans', [command, ...args], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    })

    trans.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ Completed: ${command}`)
        resolve()
      } else {
        console.error(`✗ Failed: ${command} (exit code ${code})`)
        reject(new Error(`Command failed with code ${code}`))
      }
    })

    trans.on('error', (err) => {
      console.error(`✗ Error running ${command}:`, err.message)
      reject(err)
    })
  })
}

/**
 * Update all feeds
 */
async function updateFeeds() {
  console.log(`\n[${new Date().toISOString()}] Updating all feeds...`)
  try {
    await runTransCommand('src/apps/newsmonitor/update-all')
  } catch (error) {
    console.error('Feed update failed:', error.message)
  }
}

/**
 * Render HTML output
 */
async function renderHTML() {
  console.log(`\n[${new Date().toISOString()}] Rendering HTML...`)
  try {
    await runTransCommand('src/apps/newsmonitor/render-to-html')
  } catch (error) {
    console.error('HTML render failed:', error.message)
  }
}

/**
 * Initial run on startup
 */
async function initialRun() {
  console.log('\n=== Initial startup ===')
  await updateFeeds()
  await renderHTML()
  console.log('=== Startup complete ===\n')
}

// Run initial update and render
initialRun().catch(console.error)

// Schedule periodic updates
setInterval(() => {
  updateFeeds().catch(console.error)
}, UPDATE_INTERVAL)

// Schedule periodic HTML rendering
setInterval(() => {
  renderHTML().catch(console.error)
}, RENDER_INTERVAL)

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

console.log(`Update interval: ${UPDATE_INTERVAL}ms (${UPDATE_INTERVAL / 60000} minutes)`)
console.log(`Render interval: ${RENDER_INTERVAL}ms (${RENDER_INTERVAL / 60000} minutes)`)
