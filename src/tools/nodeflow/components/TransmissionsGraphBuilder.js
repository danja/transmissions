// TransmissionsGraphBuilder.js
// Builds node-flow graphs from transmission data

import { FlowNode } from '@elicdavis/node-flow'
import ns from '../../../utils/ns.js'
import logger from '../../../utils/Logger.js'

class TransmissionsGraphBuilder {
  /**
   * Creates a graph builder for transmission data
   * @param {NodeFlowGraph} graph - The node-flow graph
   */
  constructor(graph) {
    this.graph = graph
  }

  /**
   * Builds a graph from transmission data
   * @param {Array} transmissions - Array of transmission data objects
   */
  buildGraph(transmissions) {
    logger.debug(`TransmissionsGraphBuilder: Building graph from ${transmissions.length} transmissions`)

    // Process each transmission
    for (const transmission of transmissions) {
      this.buildTransmission(transmission)
    }
  }

  /**
   * Builds a single transmission in the graph
   * @param {Object} transmission - Transmission data object
   */
  buildTransmission(transmission) {
    logger.debug(`TransmissionsGraphBuilder: Building transmission: ${transmission.label}`)

    // Create nodes for each processor
    const nodes = new Map()
    for (let i = 0; i < transmission.processors.length; i++) {
      const processor = transmission.processors[i]

      // Calculate position (simple horizontal layout)
      const position = {
        x: 200 + (i * 250),
        y: 200
      }

      // Create node
      const node = this.createProcessorNode(processor, position, transmission)

      // Add to graph
      this.graph.addNode(node)
      nodes.set(processor.id, node)
    }

    // Create connections
    for (const connection of transmission.connections) {
      const fromNode = nodes.get(connection.from)
      const toNode = nodes.get(connection.to)

      if (fromNode && toNode) {
        this.graph.connectNodes(fromNode, 0, toNode, 0)
      }
    }
  }

  /**
   * Creates a node for a processor
   * @param {Object} processor - Processor data
   * @param {Object} position - Position coordinates
   * @param {Object} transmission - Parent transmission data
   * @returns {FlowNode} - The created flow node
   */
  createProcessorNode(processor, position, transmission) {
    // Create node configuration
    const config = {
      title: processor.shortId || processor.id,
      position: position,
      info: processor.comments.join("\n") || "",
      canEditInfo: true,
      locked: false,
      data: {} // Will be set via metadata
    }

    // Create node
    const node = new FlowNode(config)

    // Set metadata properties
    node.setMetadataProperty('processorId', processor.id)
    node.setMetadataProperty('processorType', processor.type)
    node.setMetadataProperty('shortType', processor.shortType)

    if (processor.settings) {
      node.setMetadataProperty('settings', processor.settings)
      node.setMetadataProperty('shortSettings', processor.shortSettings)
    }

    // Add comments as metadata
    if (processor.comments.length > 0) {
      node.setMetadataProperty('comment', processor.comments.join('\n'))
    }

    // Add transmission information
    node.setMetadataProperty('transmissionId', transmission.id)
    node.setMetadataProperty('transmissionLabel', transmission.label)

    if (transmission.comment) {
      node.setMetadataProperty('transmissionComment', transmission.comment)
    }

    return node
  }

  /**
   * Clears the current graph
   */
  clearGraph() {
    // Node-flow doesn't have a built-in clear method,
    // so we track and remove each node
    const nodes = this.graph.getNodes()
    for (const node of nodes) {
      // We would need to implement node removal if node-flow provides this API
      // For now, we can warn about this limitation
      logger.warn('TransmissionsGraphBuilder: Node-flow API does not provide a way to remove nodes')
    }
  }
}

export default TransmissionsGraphBuilder