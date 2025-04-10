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

    // If in browser environment with missing grapoi, return placeholder data
    if (isBrowser() && !window.grapoi) {
      // Lazy-load dependencies
      import('grapoi').then(module => { window.grapoi = module.default })
      import('../../../utils/GrapoiHelpers.js').then(module => { window.GrapoiHelpers = module.default })
      import('../../../utils/ns.js').then(module => { window.ns = module.default })

      // Return placeholder data until dependencies are loaded
      return [{
        id: 'http://purl.org/stuff/transmissions/example',
        shortId: 'example',
        label: 'Example Transmission',
        comment: 'This is a placeholder transmission for browser testing',
        processors: [
          {
            id: 'http://purl.org/stuff/transmissions/p10',
            shortId: 'p10',
            type: 'http://purl.org/stuff/transmissions/ShowMessage',
            shortType: 'ShowMessage',
            comments: ['Displays message contents and continues']
          },
          {
            id: 'http://purl.org/stuff/transmissions/p20',
            shortId: 'p20',
            type: 'http://purl.org/stuff/transmissions/DeadEnd',
            shortType: 'DeadEnd',
            comments: ['Ends the pipeline without error']
          }
        ],
        connections: [
          {
            from: 'http://purl.org/stuff/transmissions/p10',
            to: 'http://purl.org/stuff/transmissions/p20'
          }
        ],
        filePath: filePath
      }]
    }

    // Import necessary libraries
    let grapoi, GrapoiHelpers, ns

    try {
      if (isBrowser()) {
        // Use window globals if available
        grapoi = window.grapoi
        GrapoiHelpers = window.GrapoiHelpers
        ns = window.ns
        window.grapoiLoaded = true
      } else {
        // Import directly in Node.js
        const grapoiModule = require('grapoi')
        grapoi = grapoiModule.default || grapoiModule

        const GrapoiHelpersModule = require('../../../utils/GrapoiHelpers.js')
        GrapoiHelpers = GrapoiHelpersModule.default || GrapoiHelpersModule

        const nsModule = require('../../../utils/ns.js')
        ns = nsModule.default || nsModule
      }

      // Continue with parsing if dependencies are loaded
      if (grapoi && ns) {
        const poi = grapoi({ dataset })

        // Find all transmissions in the dataset
        const transmissionType = ns.trn.Transmission
        for (const quad of dataset.match(null, ns.rdf.type, transmissionType)) {
          const transmissionID = quad.subject
          const transmission = this.extractTransmission(dataset, transmissionID, ns, GrapoiHelpers, grapoi)
          transmission.filePath = filePath
          transmissions.push(transmission)
        }

        logger.debug(`TransmissionsLoader: Found ${transmissions.length} transmissions`)
      }

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
  extractTransmission(dataset, transmissionID, ns, GrapoiHelpers, grapoi) {
    // Create a pointer to the transmission in the dataset
    const transPoi = grapoi({ dataset, term: transmissionID })

    // Extract label and comment
    let label = ''
    let comment = ''

    for (const quad of dataset.match(transmissionID, ns.rdfs.label)) {
      label = quad.object.value
    }

    for (const quad of dataset.match(transmissionID, ns.rdfs.comment)) {
      comment = quad.object.value
    }

    // Extract the pipe (list of processors)
    const pipeNodes = GrapoiHelpers.listToArray(dataset, transmissionID, ns.trn.pipe)

    // Extract processor details
    const processors = []
    for (const node of pipeNodes) {
      // Find the processor type
      let processorType = null
      for (const quad of dataset.match(node, ns.rdf.type)) {
        processorType = quad.object
        break
      }

      // Find settings node
      let settingsNode = null
      for (const quad of dataset.match(node, ns.trn.settings)) {
        settingsNode = quad.object
        break
      }

      // Get comments
      const nodeComments = []
      for (const quad of dataset.match(node, ns.rdfs.comment)) {
        nodeComments.push(quad.object.value)
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