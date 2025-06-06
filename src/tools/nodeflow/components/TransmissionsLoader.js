import { isBrowser } from '../../../utils/BrowserUtils.js'
import logger from '../../../utils/Logger.js'
import RDFUtils from '../../../utils/RDFUtils.js'

class TransmissionsLoader {
  async loadFromFile(filePath) {
    try {
      logger.debug(`TransmissionsLoader: Loading from ${filePath}`)
      console.log(`TransmissionsLoader: Loading from ${filePath}`)
      
      // Use RDFUtils to read the dataset
      const rdfUtils = new RDFUtils()
      const dataset = await rdfUtils.readDataset(filePath)
      console.log(`Dataset parsed, quad count:`, dataset?.size || 'unknown')
      
      // Extract transmission objects from dataset
      const transmissions = this.parseDataset(dataset, filePath)
      console.log(`Transmissions found: ${transmissions?.length || 0}`)
      
      return transmissions
    } catch (error) {
      logger.error(`TransmissionsLoader: Error loading file: ${error.message}`)
      console.error(`TransmissionsLoader: Error loading file:`, error)
      throw error
    }
  }

  parseDataset(dataset, filePath) {
    const transmissions = []

    try {
      // Get namespace definitions (handle both browser and Node environments)
      let ns
      try {
        if (isBrowser()) {
          ns = {
            rdf: {
              type: { value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' },
              first: { value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#first' },
              rest: { value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#rest' },
              nil: { value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#nil' }
            },
            rdfs: {
              label: { value: 'http://www.w3.org/2000/01/rdf-schema#label' },
              comment: { value: 'http://www.w3.org/2000/01/rdf-schema#comment' }
            },
            trn: {
              Transmission: { value: 'http://purl.org/stuff/transmissions/Transmission' },
              pipe: { value: 'http://purl.org/stuff/transmissions/pipe' },
              settings: { value: 'http://purl.org/stuff/transmissions/settings' },
              ConfigSet: { value: 'http://purl.org/stuff/transmissions/ConfigSet' }
            }
          }
        } else {
          ns = require('../../../utils/ns.js').default
        }
      } catch (e) {
        // Fallback namespace definition
        ns = {
          rdf: {
            type: { value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' },
            first: { value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#first' },
            rest: { value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#rest' },
            nil: { value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#nil' }
          },
          rdfs: {
            label: { value: 'http://www.w3.org/2000/01/rdf-schema#label' },
            comment: { value: 'http://www.w3.org/2000/01/rdf-schema#comment' }
          },
          trn: {
            Transmission: { value: 'http://purl.org/stuff/transmissions/Transmission' },
            pipe: { value: 'http://purl.org/stuff/transmissions/pipe' },
            settings: { value: 'http://purl.org/stuff/transmissions/settings' },
            ConfigSet: { value: 'http://purl.org/stuff/transmissions/ConfigSet' }
          }
        }
      }

      // Get all quads from the dataset
      const quads = this.getQuadsArray(dataset)

      // Find all transmissions
      for (const quad of quads) {
        if (!quad.predicate || !quad.object) continue

        if (quad.predicate.value === ns.rdf.type.value &&
          quad.object.value === ns.trn.Transmission.value) {
          const transmissionID = quad.subject
          const transmission = this.extractTransmission(dataset, transmissionID, ns)
          transmission.filePath = filePath
          transmissions.push(transmission)
        }
      }

      logger.debug(`TransmissionsLoader: Found ${transmissions.length} transmissions`)
      return transmissions
    } catch (error) {
      logger.error(`Error parsing dataset: ${error.message}`)
      logger.error(`Stack trace: ${error.stack}`)
      return []
    }
  }

  // Get array of quads from dataset
  getQuadsArray(dataset) {
    if (Array.isArray(dataset)) {
      return dataset
    }

    if (dataset.quads) {
      return Array.isArray(dataset.quads) ? dataset.quads : [...dataset.quads]
    }

    if (dataset[Symbol.iterator]) {
      return [...dataset]
    }

    if (typeof dataset.forEach === 'function') {
      const quads = []
      dataset.forEach(quad => quads.push(quad))
      return quads
    }

    if (dataset.toArray && typeof dataset.toArray === 'function') {
      return dataset.toArray()
    }

    throw new Error('Unable to extract quads from dataset')
  }

  extractTransmission(dataset, transmissionID, ns) {
    let label = ''
    let comment = ''

    const quads = this.getQuadsArray(dataset)

    // Get label and comment
    for (const quad of quads) {
      if (!quad.subject || !quad.predicate || !quad.object) continue

      if (this.termsEqual(quad.subject, transmissionID)) {
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
      let settingsData = null
      const nodeComments = []

      for (const quad of quads) {
        if (!quad.subject || !quad.predicate || !quad.object) continue

        if (this.termsEqual(quad.subject, node)) {
          if (quad.predicate.value === ns.rdf.type.value) {
            processorType = quad.object
          } else if (quad.predicate.value === ns.trn.settings.value) {
            settingsNode = quad.object
            // Extract settings data
            settingsData = this.extractSettingsData(dataset, settingsNode, ns)
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
        settingsData: settingsData,
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

  // Extract settings data from config set
  extractSettingsData(dataset, settingsNode, ns) {
    if (!settingsNode) return null

    const settings = {}
    const quads = this.getQuadsArray(dataset)

    // First verify it's a ConfigSet
    let isConfigSet = false
    for (const quad of quads) {
      if (this.termsEqual(quad.subject, settingsNode) &&
        quad.predicate.value === ns.rdf.type.value &&
        quad.object.value === ns.trn.ConfigSet.value) {
        isConfigSet = true
        break
      }
    }

    if (!isConfigSet) return null

    // Extract all properties from the settings node
    for (const quad of quads) {
      if (this.termsEqual(quad.subject, settingsNode) &&
        quad.predicate.value !== ns.rdf.type.value) {

        const propName = this.getShortName(quad.predicate.value)
        const propValue = quad.object.value

        // Add to settings object
        if (!settings[propName]) {
          settings[propName] = []
        }
        settings[propName].push(propValue)
      }
    }

    return settings
  }

  findPipeNodes(dataset, transmissionID, ns) {
    const pipeNodes = []
    let pipeFound = false

    const quads = this.getQuadsArray(dataset)

    // Try to find the pipe property
    for (const quad of quads) {
      if (!quad.subject || !quad.predicate || !quad.object) continue

      if (this.termsEqual(quad.subject, transmissionID) &&
        quad.predicate.value === ns.trn.pipe.value) {

        pipeFound = true

        try {
          // Check if the object is a blank node (start of RDF list)
          const listHead = quad.object
          this.traverseRdfList(dataset, listHead, pipeNodes, ns)
        } catch (error) {
          logger.error(`Error traversing RDF list: ${error.message}`)

          // Fallback: Try to parse the pipe as space-separated values
          const objectId = quad.object.value
          if (objectId && objectId.includes(' ')) {
            const parts = objectId.split(' ')

            for (const part of parts) {
              if (part && !part.startsWith('(') && !part.startsWith(')')) {
                pipeNodes.push({
                  value: part,
                  equals: other => part === other.value
                })
              }
            }
          }
        }
      }
    }

    if (!pipeFound) {
      logger.warn(`No pipe found for transmission: ${transmissionID.value}`)
    }

    return pipeNodes
  }

  traverseRdfList(dataset, currentNode, results, ns) {
    // Base case: nil node
    if (currentNode.value === ns.rdf.nil.value) {
      return
    }

    const quads = this.getQuadsArray(dataset)

    // Get first item
    let firstItem = null
    for (const quad of quads) {
      if (!quad.subject || !quad.predicate || !quad.object) continue

      if (this.termsEqual(quad.subject, currentNode) &&
        quad.predicate.value === ns.rdf.first.value) {
        firstItem = quad.object
        break
      }
    }

    if (firstItem) {
      results.push(firstItem)
    }

    // Get rest of list
    for (const quad of quads) {
      if (!quad.subject || !quad.predicate || !quad.object) continue

      if (this.termsEqual(quad.subject, currentNode) &&
        quad.predicate.value === ns.rdf.rest.value) {
        this.traverseRdfList(dataset, quad.object, results, ns)
        break
      }
    }
  }

  // Helper to safely compare RDF terms
  termsEqual(term1, term2) {
    if (!term1 || !term2) return false

    // Use equals method if available
    if (term1.equals && typeof term1.equals === 'function') {
      return term1.equals(term2)
    }

    // Compare by value
    if (term1.value && term2.value) {
      return term1.value === term2.value
    }

    // Last resort - compare stringified objects
    return JSON.stringify(term1) === JSON.stringify(term2)
  }

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