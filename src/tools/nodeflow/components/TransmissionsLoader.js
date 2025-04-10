// src/tools/nodeflow/components/TransmissionsLoader.js
import { isBrowser } from '../../../utils/BrowserUtils.js'
import RDFUtils from '../../../utils/RDFUtils.js'
import logger from '../../../utils/Logger.js'

class TransmissionsLoader {
  /**
   * Load transmission definitions from a TTL file
   */
  async loadFromFile(filePath) {
    try {
      logger.debug(`TransmissionsLoader: Loading from ${filePath}`)
      const dataset = await RDFUtils.readDataset(filePath)
      return this.parseDataset(dataset, filePath)
    } catch (error) {
      logger.error(`TransmissionsLoader: Error loading file: ${error.message}`)
      throw error
    }
  }

  /**
   * Parse an RDF dataset into transmission objects
   */
  parseDataset(dataset, filePath) {
    const transmissions = []

    // Import necessary dependencies
    let ns

    try {
      if (isBrowser()) {
        // In browser environment
        ns = {
          rdf: { type: { value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' } },
          rdfs: {
            label: { value: 'http://www.w3.org/2000/01/rdf-schema#label' },
            comment: { value: 'http://www.w3.org/2000/01/rdf-schema#comment' }
          },
          trn: {
            Transmission: { value: 'http://purl.org/stuff/transmissions/Transmission' },
            pipe: { value: 'http://purl.org/stuff/transmissions/pipe' },
            settings: { value: 'http://purl.org/stuff/transmissions/settings' }
          }
        }
      } else {
        // In Node.js environment
        ns = require('../../../utils/ns.js').default
      }

      // Print dataset info for debugging
      console.log(`Dataset size: ${dataset.size}`)

      // Find all transmissions in the dataset
      for (const quad of dataset) {
        if (quad.predicate.value === ns.rdf.type.value &&
          quad.object.value === ns.trn.Transmission.value) {

          const transmissionID = quad.subject
          const transmission = this.extractTransmission(dataset, transmissionID, ns)
          transmission.filePath = filePath
          transmissions.push(transmission)
        }
      }

      console.log(`TransmissionsLoader: Found ${transmissions.length} transmissions`)
      return transmissions
    } catch (error) {
      logger.error(`Error parsing dataset: ${error.message}`)
      logger.error(`Stack trace: ${error.stack}`)
      return []
    }
  }

  /**
   * Extract a transmission definition from the dataset
   */
  extractTransmission(dataset, transmissionID, ns) {
    // Extract label and comment
    let label = ''
    let comment = ''

    for (const quad of dataset) {
      if (quad.subject.equals(transmissionID)) {
        if (quad.predicate.value === ns.rdfs.label.value) {
          label = quad.object.value
        } else if (quad.predicate.value === ns.rdfs.comment.value) {
          comment = quad.object.value
        }
      }
    }

    // Extract pipe nodes
    const pipeNodes = this.findPipeNodes(dataset, transmissionID, ns)

    // Extract processor details
    const processors = []
    for (const node of pipeNodes) {
      let processorType = null
      let settingsNode = null
      const nodeComments = []

      for (const quad of dataset) {
        if (quad.subject.equals(node)) {
          if (quad.predicate.value === ns.rdf.type.value) {
            processorType = quad.object
          } else if (quad.predicate.value === ns.trn.settings.value) {
            settingsNode = quad.object
          } else if (quad.predicate.value === ns.rdfs.comment.value) {
            nodeComments.push(quad.object.value)
          }
        }
      }

      // Create processor object
      processors.push({
        id: node.value,
        shortId: this.getShortName(node.value),
        type: processorType ? processorType.value : null,
        shortType: processorType ? this.getShortName(processorType.value) : null,
        settings: settingsNode ? settingsNode.value : null,
        shortSettings: settingsNode ? this.getShortName(settingsNode.value) : null,
        comments: nodeComments
      })
    }

    // Create connections between processors
    const connections = []
    for (let i = 0; i < processors.length - 1; i++) {
      connections.push({
        from: processors[i].id,
        to: processors[i + 1].id
      })
    }

    // Return the complete transmission object
    return {
      id: transmissionID.value,
      shortId: this.getShortName(transmissionID.value),
      label,
      comment,
      processors,
      connections
    }
  }

  /**
   * Find pipe nodes for a transmission
   */
  findPipeNodes(dataset, transmissionID, ns) {
    const pipeNodes = []

    // Find pipe property
    for (const quad of dataset) {
      if (quad.subject.equals(transmissionID) &&
        quad.predicate.value === ns.trn.pipe.value) {

        // This is a simplified approach - we're assuming the pipe nodes are listed directly
        // In a proper RDF list, we'd need to follow rdf:first/rdf:rest chains
        const objectId = quad.object.value
        const parts = objectId.split(' ')

        for (const part of parts) {
          if (part && !part.startsWith('(') && !part.startsWith(')')) {
            pipeNodes.push({ value: part, equals: other => part === other.value })
          }
        }
      }
    }

    return pipeNodes
  }

  /**
   * Extract short name from URI
   */
  getShortName(uri) {
    if (!uri) return ''

    // Get the last part after / or #
    const lastSlashIndex = uri.lastIndexOf('/')
    const lastHashIndex = uri.lastIndexOf('#')
    const splitIndex = Math.max(lastSlashIndex, lastHashIndex)

    if (splitIndex >= 0 && splitIndex < uri.length - 1) {
      return uri.substring(splitIndex + 1)
    }

    return uri
  }
}

export default TransmissionsLoader