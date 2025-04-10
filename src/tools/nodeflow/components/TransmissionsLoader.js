import { isBrowser } from '../../../utils/BrowserUtils.js'
import RDFUtils from '../../../utils/RDFUtils.js'
import logger from '../../../utils/Logger.js'
import ns from '../../../utils/ns.js'
import grapoi from 'grapoi'

class TransmissionsLoader {
  async loadFromFile(filePath) {
    try {
      logger.debug(`TransmissionsLoader: Loading from ${filePath}`)
      const dataset = await RDFUtils.readDataset(filePath)
      return this.parseDataset(dataset)
    } catch (error) {
      logger.error(`TransmissionsLoader: Error loading file: ${error.message}`)
      throw error
    }
  }

  parseDataset(dataset) {
    try {
      // Get all quads as array for safety
      //  const quads = this.getAllQuads(dataset)
      const poi = grapoi({ dataset: transmissionConfig })
      const transmissions = []

      for (const q of poi.out(ns.rdf.type).quads()) {
        if (q.object.equals(ns.trn.Transmission)) {
          const transmissionID = q.subject
          logger.debug(`\ntransmissionID = ${transmissionID.value}`)

          const transmission = await this.constructTransmission(
            transmissionConfig,
            transmissionID,
            configModel
          )
          // logger.reveal(app)
          transmission.app = app
          transmissions.push(transmission)
        }
      }
      return transmissions
    }

  extractTransmission(quads, transmissionID) {
      let label = ''
      let comment = ''

      // Get label
      const labelQuads = quads.filter(quad =>
        this.equalTerms(quad.subject, transmissionID) &&
        this.equalTerms(quad.predicate, ns.rdfs.label)
      )
      if (labelQuads.length > 0) {
        label = labelQuads[0].object.value
      }

      // Get comment
      const commentQuads = quads.filter(quad =>
        this.equalTerms(quad.subject, transmissionID) &&
        this.equalTerms(quad.predicate, ns.rdfs.comment)
      )
      if (commentQuads.length > 0) {
        comment = commentQuads[0].object.value
      }

      // Get pipe nodes
      const pipeNodes = this.getPipeNodes(quads, transmissionID)

      // Extract processor details
      const processors = []
      for (const node of pipeNodes) {
        let processorType = null
        let settingsNode = null
        const nodeComments = []

        // Get processor type
        const typeQuads = quads.filter(quad =>
          this.equalTerms(quad.subject, node) &&
          this.equalTerms(quad.predicate, ns.rdf.type)
        )
        if (typeQuads.length > 0) {
          processorType = typeQuads[0].object
        }

        // Get settings
        const settingsQuads = quads.filter(quad =>
          this.equalTerms(quad.subject, node) &&
          this.equalTerms(quad.predicate, ns.trn.settings)
        )
        if (settingsQuads.length > 0) {
          settingsNode = settingsQuads[0].object
        }

        // Get comments
        const processorCommentQuads = quads.filter(quad =>
          this.equalTerms(quad.subject, node) &&
          this.equalTerms(quad.predicate, ns.rdfs.comment)
        )
        for (const quad of processorCommentQuads) {
          nodeComments.push(quad.object.value)
        }

        // Add processor
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

      // Create connections
      const connections = []
      for (let i = 0; i < processors.length - 1; i++) {
        connections.push({
          from: processors[i].id,
          to: processors[i + 1].id
        })
      }

      return {
        id: transmissionID.value,
        shortId: this.getShortName(transmissionID.value),
        label,
        comment,
        processors,
        connections
      }
    }

    getPipeNodes(quads, transmissionID) {
      // Find pipe head
      const pipeQuads = quads.filter(quad =>
        this.equalTerms(quad.subject, transmissionID) &&
        this.equalTerms(quad.predicate, ns.trn.pipe)
      )

      if (pipeQuads.length === 0) {
        return []
      }

      const listHead = pipeQuads[0].object
      const nodes = []

      // Manual RDF list traversal
      this.traverseList(quads, listHead, nodes)
      return nodes
    }

    traverseList(quads, currentNode, result) {
      // Check if we're at the end of the list
      if (this.equalTerms(currentNode, ns.rdf.nil)) {
        return
      }

      // Get first element
      const firstQuads = quads.filter(quad =>
        this.equalTerms(quad.subject, currentNode) &&
        this.equalTerms(quad.predicate, ns.rdf.first)
      )

      if (firstQuads.length > 0) {
        result.push(firstQuads[0].object)
      }

      // Get rest of the list
      const restQuads = quads.filter(quad =>
        this.equalTerms(quad.subject, currentNode) &&
        this.equalTerms(quad.predicate, ns.rdf.rest)
      )

      if (restQuads.length > 0) {
        this.traverseList(quads, restQuads[0].object, result)
      }
    }

    getAllQuads(dataset) {
      // Convert dataset to array of quads in a way that works in any environment
      const quads = []

      console.log(JSON.stringify(dataset))
      // Handle different dataset implementations
      /*
      if (typeof dataset.forEach === 'function') {
        dataset.forEach(quad => quads.push(quad))
      } else if (dataset.toArray && typeof dataset.toArray === 'function') {
        return dataset.toArray()
      } else if (dataset.quads) {
        // Browser RDF-Ext sometimes has quads property
        return Array.isArray(dataset.quads) ? dataset.quads : Array.from(dataset.quads)
      } else {
        // Last resort, try different iteration approaches
        try {
          return [...dataset]
        } catch (e) {
          logger.error(`Cannot iterate dataset: ${e.message}`)
          return []
        }
      }
        */

      return quads
    }

    equalTerms(term1, term2) {
      // Simple equality check that works with any implementation
      if (!term1 || !term2) return false

      // Use equals method if available
      if (term1.equals && typeof term1.equals === 'function') {
        return term1.equals(term2)
      }

      // Compare values as fallback
      return term1.value === term2.value
    }

    getShortName(uri) {
      if (!uri) return ''

      // Get the last part after / or #
      const lastSlashIndex = uri.lastIndexOf('/')
      const lastHashIndex = uri.lastIndexIndex('#')
      const splitIndex = Math.max(lastSlashIndex, lastHashIndex)

      if (splitIndex >= 0 && splitIndex < uri.length - 1) {
        return uri.substring(splitIndex + 1)
      }

      return uri
    }
  }

export default TransmissionsLoader