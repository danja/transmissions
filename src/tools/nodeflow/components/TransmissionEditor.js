import { NodeFlowGraph, FlowNode } from '@elicdavis/node-flow'
import TransmissionsLoader from './TransmissionsLoader.js'
import TransmissionsGraphBuilder from './TransmissionsGraphBuilder.js'
import TransmissionsExporter from './TransmissionsExporter.js'
import ProcessorNodePublisher from './ProcessorNodePublisher.js'

/**
 * Main editor component for transmission pipelines
 */
class TransmissionEditor {
  /**
   * Initialize the transmission editor
   * @param {HTMLCanvasElement} canvas - Canvas element for the graph
   */
  constructor(canvas) {
    // Initialize graph with the canvas
    this.graph = new NodeFlowGraph(canvas, {
      backgroundColor: '#07212a'
    })

    // Initialize helper components
    this.loader = new TransmissionsLoader()
    this.builder = new TransmissionsGraphBuilder(this.graph)
    this.exporter = new TransmissionsExporter(this.graph)
    this.publisher = new ProcessorNodePublisher()

    // Add processor types to the graph
    this.graph.addPublisher('transmissions', this.publisher)

    // Initialize state variables
    this.currentFile = null
    this.loadedTransmissions = []

    // Set up event listeners
    this.setupEvents()

    console.log('TransmissionEditor: Initialized')
  }

  /**
   * Set up event listeners for the graph
   */
  setupEvents() {
    this.graph.addOnNodeCreatedListener((publisher, nodeType, node) => {
      console.log(`TransmissionEditor: Node created - ${nodeType}`)

      // Set transmission metadata on new nodes
      if (this.loadedTransmissions.length > 0) {
        const transmission = this.loadedTransmissions[0]
        node.setMetadataProperty('transmissionId', transmission.id)
        node.setMetadataProperty('transmissionLabel', transmission.label)
        node.setMetadataProperty('processorType', `http://purl.org/stuff/transmissions/${nodeType}`)
      }
    })
  }

  /**
   * Load a transmission from a file
   * @param {string} fileUrl - URL of the file to load
   * @returns {Promise<Array>} - Loaded transmissions
   */
  async loadFromFile(fileUrl) {
    try {
      console.log(`TransmissionEditor: Loading from ${fileUrl}`)

      // Load transmissions from the file
      const transmissions = await this.loader.loadFromFile(fileUrl)
      this.loadedTransmissions = transmissions

      // Register additional processor types
      this.publisher.registerProcessorsFromTransmissions(transmissions)

      // Build the graph
      this.builder.buildGraph(transmissions)

      // Store the current file
      this.currentFile = fileUrl

      console.log(`TransmissionEditor: Loaded ${transmissions.length} transmissions from ${fileUrl}`)
      return transmissions
    } catch (error) {
      console.error(`TransmissionEditor: Error loading file: ${error.message}`)
      throw error
    }
  }

  /**
   * Prepare TTL content for saving
   * @returns {Promise<string>} - TTL content
   */
  async prepareTTLContent() {
    try {
      const dataset = this.exporter.createDataset()

      // Convert dataset to TTL string
      // This is a simple version that would need to be replaced with actual TTL serialization
      const serializer = new TurtleSerializer()
      const ttlContent = await serializer.serialize(dataset)

      return ttlContent
    } catch (error) {
      console.error(`TransmissionEditor: Error preparing TTL: ${error.message}`)
      throw error
    }
  }

  /**
   * Save to a file
   * @param {string} filePath - Path to save to (not used in browser)
   * @param {string} transmissionId - ID of transmission to save
   */
  async saveToFile(filePath = null, transmissionId = null) {
    try {
      const targetFile = filePath || this.currentFile
      if (!targetFile) {
        throw new Error('No file specified and no current file loaded')
      }

      // In browser context, we don't directly save to file
      // Instead, prepareTTLContent() should be used and handled by the UI
      console.log(`TransmissionEditor: Saved TTL content ready`)
    } catch (error) {
      console.error(`TransmissionEditor: Error saving file: ${error.message}`)
      throw error
    }
  }

  /**
   * Create a new transmission
   * @param {string} label - Label for the new transmission
   * @returns {Object} - The created transmission object
   */
  createNewTransmission(label = 'New Transmission') {
    const transmissionId = `http://purl.org/stuff/transmissions/${label.replace(/\s+/g, '_')}`.toLowerCase()

    const transmission = {
      id: transmissionId,
      shortId: label.replace(/\s+/g, '_').toLowerCase(),
      label: label,
      comment: 'Created with Node Flow Editor',
      processors: [],
      connections: []
    }

    this.loadedTransmissions = [transmission]

    // Create an initial node
    const nodeType = 'ShowMessage'
    const node = new FlowNode({
      title: 'SM',
      position: { x: 200, y: 200 },
      data: {}
    })

    node.setMetadataProperty('transmissionId', transmissionId)
    node.setMetadataProperty('transmissionLabel', label)
    node.setMetadataProperty('processorType', `http://purl.org/stuff/transmissions/${nodeType}`)

    this.graph.addNode(node)

    return transmission
  }

  /**
   * Get the graph instance
   * @returns {NodeFlowGraph} - The graph instance
   */
  getGraph() {
    return this.graph
  }
}

// Simple placeholder for TTL serialization
class TurtleSerializer {
  async serialize(dataset) {
    // This would be replaced with actual serialization logic
    // using the RDF-Ext library or similar
    return `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix : <http://purl.org/stuff/transmissions/> .

:example a :Transmission ;
    :pipe (:p10 :p20) .

:p10 a :ShowMessage .
:p20 a :DeadEnd .
`
  }
}

export default TransmissionEditor