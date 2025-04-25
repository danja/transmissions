
// Simple mock for file operations in browser environment
class RDFUtilsBrowser {
  /**
   * Read file content from a URL in browser
   */
  static async fromFile(filePath) {
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
  }

  /**
   * Write content to a file (download in browser)
   */
  static async toFile(content, filePath) {
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
  }
}

const browserRdfUtils = new RDFUtilsBrowser()

export const { fromFile, toFile, MockDataset } = browserRdfUtils
export default RDFUtilsBrowser