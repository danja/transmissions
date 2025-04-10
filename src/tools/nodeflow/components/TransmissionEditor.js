// src/tools/nodeflow/components/TransmissionEditor.js
import { NodeFlowGraph, FlowNode } from '@elicdavis/node-flow'
import TransmissionsLoader from './TransmissionsLoader.js'
import TransmissionsGraphBuilder from './TransmissionsGraphBuilder.js'
import TransmissionsExporter from './TransmissionsExporter.js'
import ProcessorNodePublisher from './ProcessorNodePublisher.js'
import RDFUtils from '../../../utils/RDFUtils.js'
import logger from '../../../utils/Logger.js'

class TransmissionEditor {
  /**
   * Creates a new transmission editor
   */
  constructor(canvas) {
    // Initialize the graph
    this.graph = new NodeFlowGraph(canvas, {
      backgroundColor: '#07212a'
    })

    // Create component instances
    this.loader = new TransmissionsLoader()
    this.builder = new TransmissionsGraphBuilder(this.graph)
    this.exporter = new TransmissionsExporter(this.graph)
    this.publisher = new ProcessorNodePublisher()

    // Register the publisher with the graph
    this.graph.addPublisher('transmissions', this.publisher)

    // Initialize state
    this.currentFile = null
    this.loadedTransmissions = []

    // Set up event listeners
    this.setupEvents()

    console.log('TransmissionEditor: Initialized')
  }

  /**
   * Sets up event listeners
   */
  setupEvents() {
    this.graph.addOnNodeCreatedListener((publisher, nodeType, node) => {
      console.log(`TransmissionEditor: Node created - ${nodeType}`)

      // Associate the node with the current transmission
      if (this.loadedTransmissions.length > 0) {
        const transmission = this.loadedTransmissions[0]
        node.setMetadataProperty('transmissionId', transmission.id)
        node.setMetadataProperty('transmissionLabel', transmission.label)
        node.setMetadataProperty('processorType', `http://purl.org/stuff/transmissions/${nodeType}`)
      }
    })
  }

  /**
   * Loads a transmission file
   */
  async loadFromFile(fileUrl) {
    try {
      console.log(`TransmissionEditor: Loading from ${fileUrl}`)

      // Load the transmissions
      const transmissions = await this.loader.loadFromFile(fileUrl)
      this.loadedTransmissions = transmissions

      // Register processor types from the loaded transmissions
      this.publisher.registerProcessorsFromTransmissions(transmissions)

      // Build the graph from the transmissions
      this.builder.buildGraph(transmissions)

      // Update current file
      this.currentFile = fileUrl

      console.log(`TransmissionEditor: Loaded ${transmissions.length} transmissions from ${fileUrl}`)
      return transmissions
    } catch (error) {
      console.error(`TransmissionEditor: Error loading file: ${error.message}`)
      throw error
    }
  }

  /**
   * Prepares TTL content for saving
   */
  async prepareTTLContent() {
    try {
      // Create a dataset from the graph
      const dataset = this.exporter.createDataset()

      // For now, return a simple TTL representation
      return `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix : <http://purl.org/stuff/transmissions/> .

:example a :Transmission ;
    :pipe (:p10 :p20) .

:p10 a :ShowMessage .
:p20 a :DeadEnd .
`
    } catch (error) {
      console.error(`TransmissionEditor: Error preparing TTL: ${error.message}`)
      throw error
    }
  }

  /**
   * Saves the current transmissions to a file
   */
  async saveToFile(filePath = null, transmissionId = null) {
    try {
      const targetFile = filePath || this.currentFile
      if (!targetFile) {
        throw new Error('No file specified and no current file loaded')
      }

      // Get the dataset
      const dataset = this.exporter.createDataset(transmissionId)

      // Write to file (in Node.js) or trigger download (in browser)
      await RDFUtils.writeDataset(dataset, targetFile)

      console.log(`TransmissionEditor: Saved to ${targetFile}`)
    } catch (error) {
      console.error(`TransmissionEditor: Error saving file: ${error.message}`)
      throw error
    }
  }

  /**
   * Creates a new transmission
   */
  createNewTransmission(label = 'New Transmission') {
    const transmissionId = `http://purl.org/stuff/transmissions/${label.replace(/\s+/g, '_')}`.toLowerCase()

    // Create a transmission object
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

    // Set node metadata
    node.setMetadataProperty('transmissionId', transmissionId)
    node.setMetadataProperty('transmissionLabel', label)
    node.setMetadataProperty('processorType', `http://purl.org/stuff/transmissions/${nodeType}`)

    // Add the node to the graph
    this.graph.addNode(node)

    return transmission
  }

  /**
   * Gets the graph instance
   */
  getGraph() {
    return this.graph
  }
}

export default TransmissionEditor