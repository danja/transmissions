import { isBrowser } from '../../../utils/BrowserUtils.js'
import RDFUtils from '../../../utils/RDFUtils.js'
import logger from '../../../utils/Logger.js'

class TransmissionsLoader {
  /**
   * Loads transmission definitions from a TTL file
   * @returns {Promise<Array>} Transmission definitions
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
   * Parses a dataset to extract transmission definitions
   * @param {Dataset} dataset - RDF dataset
   * @param {string} filePath - Source file path
   * @returns {Array} - Transmission definitions
   */
  parseDataset(dataset, filePath) {
    const transmissions = []

    // For browser compatibility during development:
    // Instead of using grapoi which may have compatibility issues,
    // let's return a mock transmission definition
    if (isBrowser() && !window.grapoiLoaded) {
      // Return a placeholder transmission for testing UI
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

    // In Node environment or if grapoi is properly loaded in browser,
    // use normal parsing logic with grapoi
    try {
      // Import grapoi and necessary utils
      let grapoi, GrapoiHelpers, ns

      if (isBrowser()) {
        // In browser, these should be available from global scope
        // or another mechanism
        grapoi = window.grapoi
        GrapoiHelpers = window.GrapoiHelpers
        ns = window.ns
      } else {
        // In Node.js, import normally
        import('grapoi').then(module => { grapoi = module.default })
        import('../../../utils/GrapoiHelpers.js').then(module => { GrapoiHelpers = module.default })
        import('../../../utils/ns.js').then(module => { ns = module.default })
      }

      const poi = grapoi({ dataset })

      // Find all transmissions in the dataset
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
    } catch (error) {
      logger.error(`Error parsing dataset: ${error.message}`)
      // Return empty array on error
      return []
    }
  }

  /**
   * Extracts a transmission definition from an RDF dataset
   * @param {Dataset} dataset - RDF dataset
   * @param {Term} transmissionID - Transmission node
   * @returns {Object} Transmission definition
   */
  extractTransmission(dataset, transmissionID) {
    // Placeholder for grapoi-based extraction in browser
    if (isBrowser() && !window.grapoiLoaded) {
      return {
        id: transmissionID.value,
        shortId: transmissionID.value.split('/').pop(),
        label: 'Transmission',
        comment: '',
        processors: [],
        connections: []
      }
    }

    // Real implementation for Node.js or browser with grapoi
    let grapoi, GrapoiHelpers, ns

    if (isBrowser()) {
      grapoi = window.grapoi
      GrapoiHelpers = window.GrapoiHelpers
      ns = window.ns
    } else {
      import('grapoi').then(module => { grapoi = module.default })
      import('../../../utils/GrapoiHelpers.js').then(module => { GrapoiHelpers = module.default })
      import('../../../utils/ns.js').then(module => { ns = module.default })
    }

    const transPoi = grapoi({ dataset, term: transmissionID })

    let label = ''
    let comment = ''

    for (const quad of transPoi.out(ns.rdfs.label).quads()) {
      label = quad.object.value
    }

    for (const quad of transPoi.out(ns.rdfs.comment).quads()) {
      comment = quad.object.value
    }

    const pipeNodes = GrapoiHelpers.listToArray(dataset, transmissionID, ns.trn.pipe)

    const processors = []
    for (const node of pipeNodes) {
      const np = grapoi({ dataset, term: node })
      const processorType = np.out(ns.rdf.type).term
      const settingsNode = np.out(ns.trn.settings).term

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