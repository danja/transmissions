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

      // Position nodes in a grid
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
          // Find available ports
          const outputPort = fromNode.outputs() > 0 ? 0 : null
          const inputPort = toNode.inputs() > 0 ? 0 : null

          if (outputPort !== null && inputPort !== null) {
            // Try to connect nodes
            try {
              this.graph.connectNodes(fromNode, outputPort, toNode, inputPort)
              logger.debug(`Connected ${connection.from} to ${connection.to}`)
            } catch (error) {
              logger.error(`Failed to connect nodes: ${error.message}`)

              // Try alternative connection method if available
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
      // Create processor identifier and info text
      const shortId = processor.shortId || ns.getShortname(processor.id)
      const shortType = processor.shortType || (processor.type ? ns.getShortname(processor.type) : "Unknown")
      const title = `:${shortId} a :${shortType}`

      // Create info text that includes settings
      let infoText = processor.comments && processor.comments.length ? processor.comments.join("\n") : ""

      // Add settings information to the node info when available
      if (processor.settingsData) {
        if (infoText) infoText += "\n\n"
        infoText += "Settings (:settings :" + processor.shortSettings + "):\n"

        for (const [key, values] of Object.entries(processor.settingsData)) {
          if (key === 'type') continue // Skip type property as it's redundant

          // Format the values for display
          const displayValues = Array.isArray(values)
            ? values.map(v => this.formatSettingValue(v)).join(", ")
            : this.formatSettingValue(values)

          infoText += `  :${key}: ${displayValues}\n`
        }
      } else if (processor.shortSettings) {
        if (infoText) infoText += "\n\n"
        infoText += `Settings: :${processor.shortSettings}\n`
      }

      // Create node config
      const config = {
        title: title,
        position: position,
        info: infoText,
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

      // Ensure node has metadata object
      if (!node.metadata) {
        node.metadata = {}
      }

      // Helper to set metadata properties
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

      // Set essential metadata
      setMetadata('processorId', processor.id)
      setMetadata('processorType', processor.type)
      setMetadata('shortType', processor.shortType)
      setMetadata('shortId', processor.shortId)

      // Set settings metadata
      if (processor.settings) {
        setMetadata('settings', processor.settings)
        setMetadata('shortSettings', processor.shortSettings)
        setMetadata('settingsData', processor.settingsData)
      }

      // Set comment metadata
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

  // Helper to format setting values for display
  formatSettingValue(value) {
    if (value === null || value === undefined) return "null"

    // Handle URIs by showing just the short name
    if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
      return `:${this.getShortName(value)}`
    }

    return value.toString()
  }

  // Helper to get the short name from a URI
  getShortName(uri) {
    if (!uri) return ''

    const lastSlashIndex = uri.lastIndexOf('/')
    const lastHashIndex = uri.lastIndexOf('#')
    const splitIndex = Math.max(lastSlashIndex, lastHashIndex)

    if (splitIndex >= 0 && splitIndex < uri.length - 1) {
      return uri.substring(splitIndex + 1)
    }

    return uri
  }
}

export default TransmissionsGraphBuilder