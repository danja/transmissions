// src/utils/browser-rdf-utils.js
import rdfExt from 'rdf-ext'
import N3Parser from '@rdfjs/parser-n3'
import stringToStream from 'string-to-stream'

class MockDataset {
  constructor() {
    this.quads = []
    this.size = 0
  }

  add(quad) {
    this.quads.push(quad)
    this.size++
    return this
  }

  addAll(quads) {
    this.quads = this.quads.concat(quads)
    this.size = this.quads.length
    return this
  }

  import(stream) {
    return {
      on: (event, callback) => {
        if (event === 'end') {
          // Process the stream data and add quads to this dataset
          // Then call the callback when done
          setTimeout(() => callback(), 0)
        }
        return this
      }
    }
  }

  toStream() {
    return {
      on: (event, callback) => {
        if (event === 'data') {
          this.quads.forEach(quad => callback(quad))
        }
        if (event === 'end') {
          callback()
        }
        return this
      },
      pipe: () => this
    }
  }
}

const turtleParser = new N3Parser({
  factory: rdfExt,
  format: 'text/turtle'
})

async function fromFile(filePath) {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`Failed to load file: ${filePath}`)
    }
    const turtleText = await response.text()
    console.log(`Loaded from ${filePath}:`, turtleText.substring(0, 100) + '...')

    // Create a dataset and import the parsed quads
    const dataset = rdfExt.dataset()
    const stream = stringToStream(turtleText)
    const quadStream = turtleParser.import(stream)

    return new Promise((resolve, reject) => {
      dataset.import(quadStream)
        .on('end', () => resolve(dataset))
        .on('error', reject)
    })
  } catch (error) {
    console.error('Error in fromFile:', error)
    throw error
  }
}

function toFile(dataset, filePath) {
  return new Promise((resolve, reject) => {
    try {
      // Convert dataset to string representation
      const serializer = new rdfExt.SerializerNTriples()
      const quadStream = dataset.toStream()
      const textStream = serializer.import(quadStream)

      let content = ''
      textStream.on('data', chunk => {
        content += chunk
      })

      textStream.on('end', () => {
        // Create a download link
        const blob = new Blob([content], { type: 'text/turtle' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filePath.split('/').pop()
        document.body.appendChild(a)
        a.click()

        // Clean up
        setTimeout(() => {
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }, 0)

        resolve()
      })

      textStream.on('error', reject)
    } catch (error) {
      reject(error)
    }
  })
}

export { fromFile, toFile, MockDataset }
export default { fromFile, toFile, MockDataset }