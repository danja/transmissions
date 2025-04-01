// TransmissionsLoader.js
// Loads transmission TTL files into node-flow format

import RDFUtils from '../../utils/RDFUtils.js'
import grapoi from 'grapoi'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'

class TransmissionsLoader {
  /**
   * Loads a transmission TTL file and converts it to a format suitable for node-flow
   * @param {string} filePath - Path to the TTL file
   * @returns {Promise<Array>} - Array of transmission data objects
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
   * Parses an RDF dataset and extracts transmission information
   * @param {Dataset} dataset - RDF dataset containing transmission data
   * @param {string} filePath - Original file path (for reference)
   * @returns {Array} - Array of transmission data objects
   */
  parseDataset(dataset, filePath) {
    const transmissions = []
    const poi = grapoi({ dataset })
    
    // Find all transmissions
    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.trn.Transmission)) {
        const transmissionID = q.subject
        const transmission = this.extractTransmission(dataset, transmissionID)
        transmission.filePath = filePath
        transmissions.push(transmission)
      }
    }
    
    logger.debug(`TransmissionsLoader: Found ${transmissions.length} transmissions`)
    return transmissions
  }

  /**
   * Extracts information about a specific transmission
   * @param {Dataset} dataset - RDF dataset
   * @param {Term} transmissionID - RDF term for the transmission ID
   * @returns {Object} - Transmission data object
   */
  extractTransmission(dataset, transmissionID) {
    const transPoi = grapoi({ dataset, term: transmissionID })
    
    // Get transmission label
    let label = ''
    let comment = ''
    
    for (const quad of transPoi.out(ns.rdfs.label).quads()) {
      label = quad.object.value
    }
    
    for (const quad of transPoi.out(ns.rdfs.comment).quads()) {
      comment = quad.object.value
    }
    
    // Get pipe nodes
    const pipeNodes = GrapoiHelpers.listToArray(dataset, transmissionID, ns.trn.pipe)
    
    // Extract processor details
    const processors = []
    for (const node of pipeNodes) {
      const np = grapoi({ dataset, term: node })
      const processorType = np.out(ns.rdf.type).term
      const settingsNode = np.out(ns.trn.settings).term
      
      // Extract comments for this processor node
      const nodeComments = []
      for (const quad of np.quads()) {
        if (quad.predicate.equals(ns.rdfs.comment)) {
          nodeComments.push(quad.object.value)
        }
      }
      
      processors.push({
        id: node.value,
        shortId: ns.shortName(node.value),
        type: processorType ? processorType.value : null,
        shortType: processorType ? ns.shortName(processorType.value) : null,
        settings: settingsNode ? settingsNode.value : null,
        shortSettings: settingsNode ? ns.shortName(settingsNode.value) : null,
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
    
    return {
      id: transmissionID.value,
      shortId: ns.shortName(transmissionID.value),
      label,
      comment,
      processors,
      connections
    }
  }
}

export default TransmissionsLoader