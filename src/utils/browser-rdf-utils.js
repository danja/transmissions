// src/utils/browser-rdf-utils.js

// Simple mock for file operations in browser environment
const browserRdfUtils = {
  /**
   * Read file content from a URL in browser
   */
  async fromFile(filePath) {
    try {
      const response = await fetch(filePath)
      if (!response.ok) {
        throw new Error(`Failed to load file: ${filePath}`)
      }
      const text = await response.text()
      return text
    } catch (error) {
      console.error('Error in fromFile:', error)
      throw error
    }
  },

  /**
   * Write content to a file (download in browser)
   */
  async toFile(content, filePath) {
    try {
      // Create a download link
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filePath.split('/').pop() || 'file.txt'
      document.body.appendChild(a)
      a.click()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 0)

      return true
    } catch (error) {
      console.error('Error in toFile:', error)
      throw error
    }
  },

  /**
   * Mock dataset for browser environment
   */
  MockDataset: class MockDataset {
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
}

export const { fromFile, toFile, MockDataset } = browserRdfUtils
export default browserRdfUtils