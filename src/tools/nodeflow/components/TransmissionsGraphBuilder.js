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

      // Position nodes on grid
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

    // Create connections between nodes
    for (const connection of transmission.connections) {
      try {
        const fromNode = nodes.get(connection.from)
        const toNode = nodes.get(connection.to)

        if (fromNode && toNode) {
          // Get default ports (usually the first input/output)
          const outputPort = fromNode.outputs() > 0 ? 0 : null
          const inputPort = toNode.inputs() > 0 ? 0 : null

          if (outputPort !== null && inputPort !== null) {
            // Try modern API first
            try {
              this.graph.connectNodes(fromNode, outputPort, toNode, inputPort)
              logger.debug(`Connected ${connection.from} to ${connection.to}`)
            } catch (error) {
              logger.error(`Failed to connect nodes: ${error.message}`)

              // Try alternative API if available
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
      // Format the title in ":p10 a :NOP" style
      const shortId = processor.shortId || ns.getShortname(processor.id)
      const shortType = processor.shortType || (processor.type ? ns.getShortname(processor.type) : "Unknown")
      const title = `:${shortId} a :${shortType}`

      const config = {
        title: title,
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

      // Create node
      const node = new FlowNode(config)

      // Ensure metadata exists
      if (!node.metadata) {
        node.metadata = {}
      }

      // Helper function to set metadata
      const setMetadata = (key, value) => {
        if (typeof node.setMetadataProperty === 'function') {
          node.setMetadataProperty(key, value)
        } else {
          node.metadata[key] = value
          // Also set in data for compatibility
          if (node.data) node.data[key] = value
        }
      }

      // Ensure getMetadataProperty is available
      node.getMetadataProperty = node.getMetadataProperty || function (key) {
        return this.metadata[key] || (this.data ? this.data[key] : undefined)
      }

      // Set processor information in metadata
      setMetadata('processorId', processor.id)
      setMetadata('processorType', processor.type)
      setMetadata('shortType', processor.shortType)
      setMetadata('shortId', processor.shortId)

      if (processor.settings) {
        setMetadata('settings', processor.settings)
        setMetadata('shortSettings', processor.shortSettings)
      }

      // Set comments if available
      if (processor.comments && processor.comments.length > 0) {
        setMetadata('comment', processor.comments.join('\n'))
      }

      // Set transmission information
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
}

export default TransmissionsGraphBuilder