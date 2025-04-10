import { FlowNode } from '@elicdavis/node-flow'
import ns from '../../../utils/ns.js'
import logger from '../../../utils/Logger.js'

class TransmissionsGraphBuilder {
  constructor(graph) {
    this.graph = graph
  }

  buildGraph(transmissions) {
    logger.debug(`TransmissionsGraphBuilder: Building graph from ${transmissions.length} transmissions`)

    for (const transmission of transmissions) {
      this.buildTransmission(transmission)
    }
  }

  buildTransmission(transmission) {
    logger.debug(`TransmissionsGraphBuilder: Building transmission: ${transmission.label}`)

    const nodes = new Map()
    for (let i = 0; i < transmission.processors.length; i++) {
      const processor = transmission.processors[i]

      // Position nodes in a grid layout
      const position = {
        x: 200 + (i * 250),
        y: 200
      }

      const node = this.createProcessorNode(processor, position, transmission)
      if (!node) {
        logger.error(`Failed to create node for processor: ${processor.id}`)
        continue
      }

      this.graph.addNode(node)
      nodes.set(processor.id, node)
    }

    // Create connections between processors
    for (const connection of transmission.connections) {
      const fromNode = nodes.get(connection.from)
      const toNode = nodes.get(connection.to)

      if (fromNode && toNode) {
        this.graph.connectNodes(fromNode, 0, toNode, 0)
      }
    }
  }

  createProcessorNode(processor, position, transmission) {
    try {
      const config = {
        title: processor.shortId || processor.id,
        position: position,
        info: processor.comments && processor.comments.length ? processor.comments.join("\n") : "",
        canEditInfo: true,
        locked: false,
        data: {}
      }

      // Create the node
      const node = new FlowNode(config)

      // Protect against missing methods
      if (!node.setMetadataProperty) {
        logger.error("FlowNode missing setMetadataProperty method, implementing workaround")
        // Create a fallback implementation
        node.metadata = node.metadata || {}
        node.setMetadataProperty = function (key, value) {
          this.metadata[key] = value
          return this
        }
      }

      // Set processor metadata
      node.setMetadataProperty('processorId', processor.id)
      node.setMetadataProperty('processorType', processor.type)
      node.setMetadataProperty('shortType', processor.shortType)

      if (processor.settings) {
        node.setMetadataProperty('settings', processor.settings)
        node.setMetadataProperty('shortSettings', processor.shortSettings)
      }

      // Set comments
      if (processor.comments && processor.comments.length > 0) {
        node.setMetadataProperty('comment', processor.comments.join('\n'))
      }

      // Set transmission metadata
      node.setMetadataProperty('transmissionId', transmission.id)
      node.setMetadataProperty('transmissionLabel', transmission.label)

      if (transmission.comment) {
        node.setMetadataProperty('transmissionComment', transmission.comment)
      }

      return node
    } catch (error) {
      logger.error(`Error creating processor node: ${error.message}`)
      return null
    }
  }

  clearGraph() {
    // Note: This is incomplete as node-flow API doesn't provide a way to remove nodes
    const nodes = this.graph.getNodes()
    for (const node of nodes) {
      logger.warn('TransmissionsGraphBuilder: Node-flow API does not provide a way to remove nodes')
    }
  }
}

export default TransmissionsGraphBuilder