// TransmissionsExporter.js
// Exports node-flow graphs back to TTL format

import RDFUtils from '../../utils/RDFUtils.js'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import rdf from 'rdf-ext'

class TransmissionsExporter {
  /**
   * Creates an exporter for converting node-flow graphs to TTL
   * @param {NodeFlowGraph} graph - The node-flow graph
   */
  constructor(graph) {
    this.graph = graph
  }
  
  /**
   * Creates an RDF dataset from the graph
   * @param {string} transmissionId - ID of the transmission to export (or null for all)
   * @returns {Dataset} - RDF dataset
   */
  createDataset(transmissionId = null) {
    const dataset = rdf.dataset()
    const nodes = this.graph.getNodes()
    
    // Group nodes by transmission
    const transmissions = this.organizeNodesByTransmission(nodes)
    
    // Filter to a specific transmission if requested
    if (transmissionId) {
      const filtered = new Map()
      if (transmissions.has(transmissionId)) {
        filtered.set(transmissionId, transmissions.get(transmissionId))
      }
      return this.buildDatasetFromTransmissions(filtered, dataset)
    }
    
    return this.buildDatasetFromTransmissions(transmissions, dataset)
  }
  
  /**
   * Builds an RDF dataset from organized transmission data
   * @param {Map} transmissions - Map of transmission ID to processors
   * @param {Dataset} dataset - RDF dataset to add to
   * @returns {Dataset} - The updated dataset
   */
  buildDatasetFromTransmissions(transmissions, dataset) {
    // Create TTL for each transmission
    for (const [transmissionId, transmissionData] of transmissions.entries()) {
      const { label, comment, processors } = transmissionData
      this.addTransmissionToDataset(dataset, transmissionId, label, comment, processors)
    }
    
    return dataset
  }
  
  /**
   * Organizes nodes into transmission groups
   * @param {Array} nodes - Array of flow nodes
   * @returns {Map} - Map of transmission ID to transmission data
   */
  organizeNodesByTransmission(nodes) {
    const transmissions = new Map()
    
    // Default transmission if none specified
    const defaultId = 'http://purl.org/stuff/transmissions/main'
    let defaultLabel = 'main'
    
    for (const node of nodes) {
      // Get transmission data from node (if available)
      const transmissionId = node.getMetadataProperty('transmissionId') || defaultId
      const transmissionLabel = node.getMetadataProperty('transmissionLabel') || defaultLabel
      
      // Create transmission entry if it doesn't exist
      if (!transmissions.has(transmissionId)) {
        transmissions.set(transmissionId, {
          label: transmissionLabel,
          comment: node.getMetadataProperty('transmissionComment') || '',
          processors: []
        })
      }
      
      // Add node to transmission
      transmissions.get(transmissionId).processors.push(node)
    }
    
    // Sort processors in each transmission based on connections
    for (const [id, transmission] of transmissions.entries()) {
      transmission.processors = this.sortProcessorsByConnections(transmission.processors)
    }
    
    return transmissions
  }
  
  /**
   * Sorts processors based on connection order
   * @param {Array} processors - Array of processor nodes
   * @returns {Array} - Sorted array of processors
   */
  sortProcessorsByConnections(processors) {
    if (processors.length <= 1) {
      return processors
    }
    
    // Create a map of node output connections
    const outputMap = new Map()
    const inputMap = new Map()
    
    for (const node of processors) {
      for (const outputPort of node.outputs()) {
        for (const connection of outputPort.connections()) {
          const toNode = connection.inNode()
          if (toNode) {
            if (!outputMap.has(node.title())) {
              outputMap.set(node.title(), [])
            }
            outputMap.get(node.title()).push(toNode.title())
            
            if (!inputMap.has(toNode.title())) {
              inputMap.set(toNode.title(), [])
            }
            inputMap.get(toNode.title()).push(node.title())
          }
        }
      }
    }
    
    // Find start nodes (no inputs)
    const startNodes = processors.filter(node => 
      !inputMap.has(node.title()) || inputMap.get(node.title()).length === 0
    )
    
    if (startNodes.length === 0) {
      // No clear starting point, return as-is
      return processors
    }
    
    // Build ordered list
    const ordered = []
    const visited = new Set()
    
    const visit = (node) => {
      if (visited.has(node.title())) return
      visited.add(node.title())
      ordered.push(node)
      
      const outputs = outputMap.get(node.title()) || []
      for (const outputTitle of outputs) {
        const outputNode = processors.find(n => n.title() === outputTitle)
        if (outputNode) {
          visit(outputNode)
        }
      }
    }
    
    // Visit from each start node
    for (const startNode of startNodes) {
      visit(startNode)
    }
    
    // Add any remaining nodes
    for (const node of processors) {
      if (!visited.has(node.title())) {
        ordered.push(node)
      }
    }
    
    return ordered
  }
  
  /**
   * Adds a transmission to the dataset
   * @param {Dataset} dataset - RDF dataset
   * @param {string} transmissionId - Transmission ID
   * @param {string} label - Transmission label
   * @param {string} comment - Transmission comment
   * @param {Array} processors - Array of processor nodes
   */
  addTransmissionToDataset(dataset, transmissionId, label, comment, processors) {
    const transmissionNode = rdf.namedNode(transmissionId)
    
    // Add transmission type
    dataset.add(rdf.quad(
      transmissionNode,
      ns.rdf.type,
      ns.trn.Transmission
    ))
    
    // Add label
    dataset.add(rdf.quad(
      transmissionNode,
      ns.rdfs.label,
      rdf.literal(label)
    ))
    
    // Add comment if present
    if (comment) {
      dataset.add(rdf.quad(
        transmissionNode,
        ns.rdfs.comment,
        rdf.literal(comment)
      ))
    }
    
    // Create pipe list
    const pipeNodes = processors.map(node => {
      // Use the node's processorId if available, otherwise generate one
      const nodeId = node.getMetadataProperty('processorId') || 
                    `http://purl.org/stuff/transmissions/${node.title()}`
      return rdf.namedNode(nodeId)
    })
    
    // Add pipe list to dataset
    this.addListToDataset(dataset, transmissionNode, ns.trn.pipe, pipeNodes)
    
    // Add processor definitions
    for (let i = 0; i < processors.length; i++) {
      const node = processors[i]
      const nodeId = node.getMetadataProperty('processorId') || 
                    `http://purl.org/stuff/transmissions/${node.title()}`
      const processorId = rdf.namedNode(nodeId)
      
      // Get processor type
      const processorType = node.getMetadataProperty('processorType') || node.title()
      const processorTypeNode = rdf.namedNode(`http://purl.org/stuff/transmissions/${processorType}`)
      
      // Add processor type
      dataset.add(rdf.quad(
        processorId,
        ns.rdf.type,
        processorTypeNode
      ))
      
      // Add settings if present
      const settings = node.getMetadataProperty('settings')
      if (settings) {
        const settingsNode = rdf.namedNode(settings)
        dataset.add(rdf.quad(
          processorId,
          ns.trn.settings,
          settingsNode
        ))
      }
      
      // Add comment if present
      const comment = node.getMetadataProperty('comment')
      if (comment) {
        dataset.add(rdf.quad(
          processorId,
          ns.rdfs.comment,
          rdf.literal(comment)
        ))
      }
    }
  }
  
  /**
   * Adds an RDF list to the dataset
   * @param {Dataset} dataset - RDF dataset
   * @param {Term} subject - Subject term
   * @param {Term} predicate - Predicate term
   * @param {Array} items - Array of list items
   */
  addListToDataset(dataset, subject, predicate, items) {
    if (items.length === 0) {
      // Empty list
      dataset.add(rdf.quad(
        subject,
        predicate,
        ns.rdf.nil
      ))
      return
    }
    
    // Create list
    let listNode = rdf.blankNode()
    dataset.add(rdf.quad(
      subject,
      predicate,
      listNode
    ))
    
    // Add items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      // Add first item
      dataset.add(rdf.quad(
        listNode,
        ns.rdf.first,
        item
      ))
      
      // Add rest link
      if (i < items.length - 1) {
        const nextNode = rdf.blankNode()
        dataset.add(rdf.quad(
          listNode,
          ns.rdf.rest,
          nextNode
        ))
        listNode = nextNode
      } else {
        // End of list
        dataset.add(rdf.quad(
          listNode,
          ns.rdf.rest,
          ns.rdf.nil
        ))
      }
    }
  }
  
  /**
   * Saves the RDF dataset to a TTL file
   * @param {string} filePath - Path to save to
   * @param {string} transmissionId - Optional ID of specific transmission to save
   * @returns {Promise<void>}
   */
  async saveToFile(filePath, transmissionId = null) {
    try {
      const dataset = this.createDataset(transmissionId)
      await RDFUtils.writeDataset(dataset, filePath)
      logger.info(`TransmissionsExporter: Saved to ${filePath}`)
    } catch (error) {
      logger.error(`TransmissionsExporter: Error saving file: ${error.message}`)
      throw error
    }
  }
}

export default TransmissionsExporter