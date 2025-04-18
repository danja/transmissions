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

    // Create connections between processors based on pipeline order
    for (const connection of transmission.connections) {
      try {
        const fromNode = nodes.get(connection.from)
        const toNode = nodes.get(connection.to)

        if (fromNode && toNode) {
          // Get available output/input ports
          //    console.log(`fromNode.outputs() = ${JSON.stringify(fromNode.outputs())}`)
          // danny  const outputPort = fromNode.outputs().size() > 0 ? 0 : null
          // danny  const inputPort = toNode.inputs().size() > 0 ? 0 : null
          const outputPort = fromNode.outputs() > 0 ? 0 : null
          const inputPort = toNode.inputs() > 0 ? 0 : null

          if (outputPort !== null && inputPort !== null) {
            // Try to connect nodes safely
            try {
              this.graph.connectNodes(fromNode, outputPort, toNode, inputPort)
              logger.debug(`Connected ${connection.from} to ${connection.to}`)
            } catch (error) {
              logger.error(`Failed to connect nodes: ${error.message}`)
              // Try alternative method if available
              if (this.graph.connect) {
                try {
                  this.graph.connect(fromNode, outputPort, toNode, inputPort)
                  logger.debug(`Connected using alternative method: ${connection.from} to ${connection.to}`)
                } catch (innerError) {
                  logger.error(`Alternative connection also failed: ${innerError.message}`)
                }
              }
            }
          } else {
            logger.warn(`Cannot connect: missing ports on nodes ${connection.from} or ${connection.to}`)
          }
        } else {
          logger.warn(`Cannot connect: missing node ${!fromNode ? connection.from : connection.to}`)
        }
      } catch (error) {
        logger.error(`Error connecting nodes: ${error.message}`)
      }
    }
  }

  createProcessorNode(processor, position, transmission) {
    try {
      // Create node configuration
      const config = {
        title: processor.shortId || processor.id,
        position: position,
        info: processor.comments && processor.comments.length ? processor.comments.join("\n") : "",
        canEditInfo: true,
        locked: false,
        data: {},
        inputs: [{
          name: 'in',
          type: 'message'
        }],
        outputs: [{
          name: 'out',
          type: 'message'
        }]
      }

      // Create the node
      const node = new FlowNode(config)

      // Ensure metadata functionality
      if (!node.metadata) {
        node.metadata = {}
      }

      // Implement or use setMetadataProperty
      const setMetadata = (key, value) => {
        if (typeof node.setMetadataProperty === 'function') {
          node.setMetadataProperty(key, value)
        } else {
          node.metadata[key] = value
          // Also set in data for backup
          if (node.data) node.data[key] = value
        }
      }

      // Implement or use getMetadataProperty
      node.getMetadataProperty = node.getMetadataProperty || function (key) {
        return this.metadata[key] || (this.data ? this.data[key] : undefined)
      }

      // Set processor metadata
      setMetadata('processorId', processor.id)
      setMetadata('processorType', processor.type)
      setMetadata('shortType', processor.shortType)

      if (processor.settings) {
        setMetadata('settings', processor.settings)
        setMetadata('shortSettings', processor.shortSettings)
      }

      // Set comments
      if (processor.comments && processor.comments.length > 0) {
        setMetadata('comment', processor.comments.join('\n'))
      }

      // Set transmission metadata
      setMetadata('transmissionId', transmission.id)
      setMetadata('transmissionLabel', transmission.label)

      if (transmission.comment) {
        setMetadata('transmissionComment', transmission.comment)
      }

      return node
    } catch (error) {
      logger.error(`Error creating processor node: ${error.message}`)
      return null
    }
  }

  // TODO wtf - is used?
  /*
  clearGraph() {
    try {
      // Get all nodes
      const nodes = this.graph.getNodes()

      // Try different methods to remove nodes
      if (typeof this.graph.removeNode === 'function') {
        for (const node of nodes) {
          this.graph.removeNode(node)
        }
      } else if (typeof this.graph.remove === 'function') {
        for (const node of nodes) {
          this.graph.remove(node)
        }
      } else {
        logger.warn('TransmissionsGraphBuilder: No valid method to remove nodes found')
      }
    } catch (error) {
      logger.error(`Error clearing graph: ${error.message}`)
    }
  }
    */
}

export default TransmissionsGraphBuilder