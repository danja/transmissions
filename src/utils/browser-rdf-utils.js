/**
 * Browser-compatible replacement for rdf-utils-fs
 * Implements file loading/saving functionality for the browser
 */

// Create a simple mock for Dataset to use when real dataset isn't available
class MockDataset {
  constructor() {
    this.quads = [];
  }
  
  add(quad) {
    this.quads.push(quad);
    return this;
  }
  
  addAll(quads) {
    this.quads = this.quads.concat(quads);
    return this;
  }
  
  toStream() {
    // Simple mock stream for browser compatibility
    return {
      on: (event, callback) => {
        if (event === 'data') {
          this.quads.forEach(quad => callback(quad));
        }
        if (event === 'end') {
          callback();
        }
        return this;
      },
      pipe: () => this
    };
  }
}

/**
 * Load RDF data from a file path (browser version)
 * @param {string} filePath - Path to load from
 * @returns {Promise<Stream>} - Stream of quads
 */
function fromFile(filePath) {
  // In browser, fetch the file
  return new Promise((resolve, reject) => {
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load file: ${filePath}`);
        }
        return response.text();
      })
      .then(text => {
        console.log(`Loaded from ${filePath}:`, text.substring(0, 100) + '...');
        // Create a mock stream for browser compatibility
        const stream = {
          on: (event, callback) => {
            if (event === 'data') {
              // We don't parse the turtle here - that would be done by parser
              callback(text);
            }
            if (event === 'end') {
              callback();
            }
            return stream;
          },
          pipe: (dest) => {
            // Simplified piping
            return dest;
          }
        };
        resolve(stream);
      })
      .catch(reject);
  });
}

/**
 * Save RDF data to a file (browser version)
 * @param {Stream} stream - Stream of quads
 * @param {string} filePath - Path to save to
 * @returns {Promise<void>}
 */
function toFile(stream, filePath) {
  return new Promise((resolve, reject) => {
    // In browser, trigger a download
    try {
      // Collect all data from the stream
      let content = '';
      stream.on('data', chunk => {
        content += chunk;
      });
      
      stream.on('end', () => {
        // Create a download link
        const blob = new Blob([content], { type: 'text/turtle' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath.split('/').pop();
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 0);
        
        resolve();
      });
      
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

export { fromFile, toFile, MockDataset };
export default { fromFile, toFile, MockDataset };