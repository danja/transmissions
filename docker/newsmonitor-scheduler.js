// docker/newsmonitor-scheduler.js
import { spawn } from 'child_process'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Config from '../src/Config.js'
import generateEndpoints from '../src/apps/newsmonitor/generate-endpoints.js'
import { APIHandler } from './api-handler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL || 3600000 // 1 hour default
const RENDER_INTERVAL = process.env.RENDER_INTERVAL || 300000 // 5 minutes default
const AUTO_RUN = process.env.NEWSMONITOR_AUTO_RUN !== 'false'

// Generate endpoints.json on startup
console.log('='.repeat(60))
console.log('NewsMonitor Scheduler Starting...')
console.log('='.repeat(60))
console.log(`Environment: ${Config.getEnvironment()}`)
console.log('\nGenerating endpoints.json from Config...')

try {
  generateEndpoints()
  const endpoint = Config.getSparqlEndpoint('newsmonitor')
  console.log('SPARQL Configuration:')
  console.log(`  Query endpoint: ${endpoint.queryEndpoint}`)
  console.log(`  Update endpoint: ${endpoint.updateEndpoint}`)
  console.log(`  Username: ${endpoint.username}`)
  console.log(`  Password: ${endpoint.password ? '***set***' : '***NOT SET***'}`)
} catch (error) {
  console.error('Failed to generate endpoints:', error.message)
  console.error('Check your .env file and config/services.json')
  process.exit(1)
}

// Initialize API handler
const apiHandler = new APIHandler()

// HTTP server to serve API and static files
const newsmonitorConfig = Config.getService('newsmonitor')
const PORT = Number.parseInt(process.env.NEWSMONITOR_PORT || newsmonitorConfig?.port || 8080, 10)
const PUBLIC_DIR = path.join(__dirname, 'public')
const DATA_DIR = path.join(__dirname, '..', 'src', 'apps', 'newsmonitor', 'data')

const HOST = process.env.NEWSMONITOR_HOST || '0.0.0.0'

const server = http.createServer(async (req, res) => {
  // Handle API routes
  if (req.url.startsWith('/api/')) {
    const handled = await apiHandler.handleRequest(req, res)
    if (handled) return
  }

  // Serve static files from public directory
  let filePath
  if (req.url === '/') {
    const primaryIndex = path.join(DATA_DIR, 'index.html')
    const legacyIndex = path.join(__dirname, '..', 'src', 'apps', 'newsmonitor', 'render-to-html', 'data', 'index.html')
    filePath = await resolveIndexPath(primaryIndex, legacyIndex, PUBLIC_DIR)
  } else if (req.url.startsWith('/data/')) {
    // Legacy: serve generated HTML from data directory
    filePath = path.join(DATA_DIR, req.url.substring(6))
  } else {
    filePath = path.join(PUBLIC_DIR, req.url)
  }

  // Security: prevent directory traversal
  const resolvedPath = path.resolve(filePath)
  if (!resolvedPath.startsWith(PUBLIC_DIR) && !resolvedPath.startsWith(DATA_DIR)) {
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
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    }

    const headers = { 'Content-Type': contentTypes[ext] || 'text/plain' }
    if (req.url === '/') {
      headers['X-NewsMonitor-Index-Source'] = filePath
    }
    res.writeHead(200, headers)
    res.end(data)
  })
})

server.listen(PORT, HOST, () => {
  console.log(`NewsMonitor HTTP server running on ${HOST}:${PORT}`)
  console.log(`Environment: ${Config.getEnvironment()}`)
  console.log(`Frontend: http://localhost:${PORT}/`)
  console.log(`API: http://localhost:${PORT}/api/posts`)
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
  console.log('Note: Frontend is available even if initial data load fails')
  console.log(`Frontend available at: http://localhost:${PORT}/`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)

  await updateFeeds()
  await renderHTML()
  console.log('=== Startup complete ===\n')
}

if (AUTO_RUN) {
  // Run initial update and render (non-blocking - frontend stays up)
  initialRun().catch(err => {
    console.error('Initial run failed:', err.message)
    console.log('Frontend still accessible for debugging')
  })

  // Schedule periodic updates
  setInterval(() => {
    updateFeeds().catch(console.error)
  }, UPDATE_INTERVAL)

  // Schedule periodic HTML rendering
  setInterval(() => {
    renderHTML().catch(console.error)
  }, RENDER_INTERVAL)
} else {
  console.log('Auto-run disabled (NEWSMONITOR_AUTO_RUN=false)')
}

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

async function resolveIndexPath(primaryIndex, legacyIndex, publicDir) {
  try {
    const [primaryStat, legacyStat] = await Promise.all([
      fs.promises.stat(primaryIndex).catch(() => null),
      fs.promises.stat(legacyIndex).catch(() => null)
    ])

    if (primaryStat && legacyStat) {
      return primaryStat.mtimeMs >= legacyStat.mtimeMs ? primaryIndex : legacyIndex
    }
    if (primaryStat) {
      return primaryIndex
    }
    if (legacyStat) {
      return legacyIndex
    }
  } catch (error) {
    console.warn('Index resolution error:', error.message)
  }
  return path.join(publicDir, 'index.html')
}
