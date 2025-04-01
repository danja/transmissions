// TransmissionEditor.js
// Main component that provides transmission editing functionality

import { NodeFlowGraph } from '@elicdavis/node-flow'
import TransmissionsLoader from './TransmissionsLoader.js'
import TransmissionsGraphBuilder from './TransmissionsGraphBuilder.js'
import TransmissionsExporter from './TransmissionsExporter.js'
import ProcessorNodePublisher from './ProcessorNodePublisher.js'
import logger from '../../utils/Logger.js'

class TransmissionEditor {
  /**
   * Creates a transmission editor
   * @param {HTMLCanvasElement} canvas - Canvas element for the editor
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
    
    // Register publisher
    this.graph.addPublisher('transmissions', this.publisher)
    
    // Track loaded file
    this.currentFile = null
    this.loadedTransmissions = []
    
    // Set up event handlers
    this.setupEvents()
    
    logger.info('TransmissionEditor: Initialized')
  }
  
  /**
   * Sets up event handlers for the editor
   */
  setupEvents() {
    // Set up node creation handler
    this.graph.addOnNodeCreatedListener((publisher, nodeType, node) => {
      logger.debug(`TransmissionEditor: Node created - ${nodeType}`)
      
      // Set default metadata
      if (this.loadedTransmissions.length > 0) {
        const transmission = this.loadedTransmissions[0]
        node.setMetadataProperty('transmissionId', transmission.id)
        node.setMetadataProperty('transmissionLabel', transmission.label)
        node.setMetadataProperty('processorType', `http://purl.org/stuff/transmissions/${nodeType}`)
      }
    })
  }
  
  /**
   * Loads transmissions from a TTL file
   * @param {string} filePath - Path to the TTL file
   * @returns {Promise<void>}
   */
  async loadFromFile(filePath) {
    try {
      logger.info(`TransmissionEditor: Loading from ${filePath}`)
      
      // Load transmissions from file
      const transmissions = await this.loader.loadFromFile(filePath)
      this.loadedTransmissions = transmissions
      
      // Register processor types discovered in the file
      this.publisher.registerProcessorsFromTransmissions(transmissions)
      
      // Build the graph
      this.builder.buildGraph(transmissions)
      
      // Store current file
      this.currentFile = filePath
      
      logger.info(`TransmissionEditor: Loaded ${transmissions.length} transmissions from ${filePath}`)
      return transmissions
    } catch (error) {
      logger.error(`TransmissionEditor: Error loading file: ${error.message}`)
      throw error
    }
  }
  
  /**
   * Saves the current graph to a TTL file
   * @param {string} filePath - Path to save to (defaults to the loaded file)
   * @param {string} transmissionId - Optional ID of specific transmission to save
   * @returns {Promise<void>}
   */
  async saveToFile(filePath = null, transmissionId = null) {
    try {
      const targetFile = filePath || this.currentFile
      if (!targetFile) {
        throw new Error('No file specified and no current file loaded')
      }
      
      await this.exporter.saveToFile(targetFile, transmissionId)
      logger.info(`TransmissionEditor: Saved to ${targetFile}`)
    } catch (error) {
      logger.error(`TransmissionEditor: Error saving file: ${error.message}`)
      throw error
    }
  }
  
  /**
   * Creates a new transmission with a default node
   * @param {string} label - Transmission label
   * @returns {Object} - The created transmission data
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
    
    // Add default node
    const nodeType = 'ShowMessage' // Default processor type
    const node = this.graph.addNode(new FlowNode({
      title: 'SM',
      position: { x: 200, y: 200 },
      data: {}
    }))
    
    node.setMetadataProperty('transmissionId', transmissionId)
    node.setMetadataProperty('transmissionLabel', label)
    node.setMetadataProperty('processorType', `http://purl.org/stuff/transmissions/${nodeType}`)
    
    return transmission
  }
  
  /**
   * Gets the current node-flow graph
   * @returns {NodeFlowGraph} - The graph
   */
  getGraph() {
    return this.graph
  }
}

export default TransmissionEditor