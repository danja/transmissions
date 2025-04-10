import { isBrowser } from '../../../utils/BrowserUtils.js'
import RDFUtils from '../../../utils/RDFUtils.js'
import logger from '../../../utils/Logger.js'
import grapoi from 'grapoi'

class TransmissionsLoader {
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

  parseDataset(dataset, filePath) {
    const transmissions = []

    let ns
    try {
      if (isBrowser()) {
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
        ns = require('../../../utils/ns.js').default
      }

      console.log(`Dataset size: ${dataset.size}`)

      // HERE
      // console.log(`D : \n ${JSON.stringify(dataset)}`)
      // Find all transmissions in the dataset
      const wtf = 'http://purl.org/stuff/transmissions/a'

      for (const quad of dataset.quads) {
        console.log(`quad- ${JSON.stringify(quad)} \n\n`)
        //  console.log(`quad.predicate.value : \n ${JSON.stringify(quad.predicate.value)}`)
        // console.log(`ns.trn.a : \n ${JSON.stringify(ns.trn.a)}`)
        console.log(`quad.object.value : \n ${JSON.stringify(quad.object.value)}`)
        console.log(`ns.trn.Transmission.value : \n ${JSON.stringify(ns.trn.Transmission.value)}`)
        //  if (quad.predicate.value === ns.rdf.type.value &&
        //  quad.object.value === ns.trn.Transmission.value) {
        if (quad.predicate.value === wtf &&
          quad.object.value === ns.trn.Transmission.value) {
          console.log(`A`)
          const transmissionID = quad.subject
          const transmission = this.extractTransmission(dataset, transmissionID, ns)
          transmission.filePath = filePath
          transmissions.push(transmission)
        }
      }

      /////////////////////////////////////
      /*
      console.log(`A`)
      const poi = grapoi({ dataset: dataset })
      console.log(`D : \n ${JSON.stringify(dataset)}`)
      console.log(` poi.out(ns.rdf.type) = ${poi.out(ns.rdf.type)}`)
      console.log(`B`)
      console.log(` poi.out(ns.rdf.type).quads() = ${poi.out(ns.rdf.type).quads()}`)
      console.log(`C`)
      for (const quad of poi.out(ns.rdf.type).quads()) {
        if (quad.object.equals(ns.trn.Transmission)) {
          const transmissionID = quad.subject
          const transmission = this.extractTransmission(dataset, transmissionID, ns)
          transmission.filePath = filePath
          transmissions.push(transmission)
        }
      }
*/
      //////////////////////////////////////7

      logger.debug(`TransmissionsLoader: Found ${transmissions.length} transmissions`)
      return transmissions
    } catch (error) {
      logger.error(`Error parsing dataset: ${error.message}`)
      logger.error(`Stack trace: ${error.stack}`)

      // Return empty array if error occurs
      return []
    }
  }

  extractTransmission(dataset, transmissionID, ns) {
    console.log(`B`)
    let label = ''
    let comment = ''
    console.log(`Dataset : \n ${JSON.stringify(dataset)}`)
    // HERE TOO
    for (const quad of dataset.quads) {
      console.log(`C`)
      if (quad.subject.equals(transmissionID)) {
        console.log(`D`)
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

  findPipeNodes(dataset, transmissionID, ns) {
    const pipeNodes = []
    let pipeFound = false

    // HERE 3
    // Try to find the pipe property
    for (const quad of dataset.quads) {
      if (quad.subject.equals(transmissionID) &&
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

    // Get first item
    let firstItem = null
    for (const quad of dataset) {
      if (quad.subject.equals(currentNode) &&
        quad.predicate.value === ns.rdf.first.value) {
        firstItem = quad.object
        break
      }
    }

    if (firstItem) {
      results.push(firstItem)
    }

    // Get rest of list
    for (const quad of dataset) {
      if (quad.subject.equals(currentNode) &&
        quad.predicate.value === ns.rdf.rest.value) {
        this.traverseRdfList(dataset, quad.object, results, ns)
        break
      }
    }
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