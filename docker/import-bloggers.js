// docker/import-bloggers.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const RDF_FILE = process.argv[2] || path.join(__dirname, '..', 'src', 'apps', 'newsmonitor', 'bloggers.rdf')
const DELAY = parseInt(process.argv[3]) || 2000 // 2 seconds between subscribes

/**
 * Extract feed URLs from RDF file
 */
function extractFeedUrls(rdfContent) {
  const regex = /<rss:channel rdf:about="([^"]+)"/g
  const urls = []
  let match

  while ((match = regex.exec(rdfContent)) !== null) {
    urls.push(match[1])
  }

  return urls
}

/**
 * Subscribe to a single feed
 */
function subscribeFeed(url) {
  return new Promise((resolve, reject) => {
    console.log(`\nSubscribing to: ${url}`)

    const trans = spawn('./trans', ['src/apps/newsmonitor/subscribe', '-m', JSON.stringify({ url })], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    })

    trans.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ Subscribed: ${url}`)
        resolve()
      } else {
        console.error(`✗ Failed: ${url} (exit code ${code})`)
        resolve() // Continue even if one fails
      }
    })

    trans.on('error', (err) => {
      console.error(`✗ Error: ${url} - ${err.message}`)
      resolve() // Continue even if one fails
    })
  })
}

/**
 * Subscribe to feeds with delay
 */
async function subscribeAll(urls) {
  console.log(`\nFound ${urls.length} feeds to subscribe`)
  console.log(`Delay between subscriptions: ${DELAY}ms`)
  console.log('=' .repeat(60))

  let success = 0
  let failed = 0

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    console.log(`\n[${i + 1}/${urls.length}] Processing...`)

    try {
      await subscribeFeed(url)
      success++
    } catch (error) {
      failed++
    }

    // Delay before next subscription (except for last one)
    if (i < urls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY))
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('Import Summary:')
  console.log(`  Total feeds: ${urls.length}`)
  console.log(`  Successful: ${success}`)
  console.log(`  Failed: ${failed}`)
  console.log('=' .repeat(60))
}

/**
 * Main
 */
async function main() {
  console.log('NewsMonitor Feed Importer')
  console.log('=' .repeat(60))
  console.log(`Reading RDF file: ${RDF_FILE}`)

  if (!fs.existsSync(RDF_FILE)) {
    console.error(`Error: File not found: ${RDF_FILE}`)
    console.error('\nUsage: node import-bloggers.js [rdf-file] [delay-ms]')
    process.exit(1)
  }

  const rdfContent = fs.readFileSync(RDF_FILE, 'utf8')
  const urls = extractFeedUrls(rdfContent)

  if (urls.length === 0) {
    console.error('Error: No feed URLs found in RDF file')
    process.exit(1)
  }

  await subscribeAll(urls)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
