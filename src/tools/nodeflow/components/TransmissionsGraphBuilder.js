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

      // Position nodes in a sensible layout
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

    // Connect nodes based on the connections defined in the transmission
    for (const connection of transmission.connections) {
      try {
        const fromNode = nodes.get(connection.from)
        const toNode = nodes.get(connection.to)

        if (fromNode && toNode) {
          // Get the first output port from the first node and the first input port from the second node
          const outputPort = fromNode.outputs() > 0 ? 0 : null
          const inputPort = toNode.inputs() > 0 ? 0 : null

          if (outputPort !== null && inputPort !== null) {
            // Try primary connection method
            try {
              this.graph.connectNodes(fromNode, outputPort, toNode, inputPort)
              logger.debug(`Connected ${connection.from} to ${connection.to}`)
            } catch (error) {
              logger.error(`Failed to connect nodes: ${error.message}`)

              // Try fallback connection method
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
      // Create short names for display
      const shortId = processor.shortId || ns.getShortname(processor.id)
      const shortType = processor.shortType || (processor.type ? ns.getShortname(processor.type) : "Unknown")

      // Format settings for display in the node body
      let settingsDisplay = ''
      if (processor.settingsData) {
        settingsDisplay = Object.entries(processor.settingsData)
          .filter(([key]) => key !== 'type')
          .map(([key, values]) => {
            const displayValues = Array.isArray(values)
              ? values.map(v => this.formatSettingValue(v)).join(", ")
              : this.formatSettingValue(values)
            return `${key}: ${displayValues}`
          })
          .join("\n")
      }

      // Create node title and subtitle
      const title = `:${shortId} a :${shortType}`

      // Store the original comments for the info popup
      let infoText = processor.comments && processor.comments.length ? processor.comments.join("\n") : ""

      // Add settings information to the node info when available
      if (processor.settingsData) {
        if (infoText) infoText += "\n\n"
        infoText += "Settings (:settings :" + processor.shortSettings + "):\n"

        for (const [key, values] of Object.entries(processor.settingsData)) {
          if (key === 'type') continue

          const displayValues = Array.isArray(values)
            ? values.map(v => this.formatSettingValue(v)).join(", ")
            : this.formatSettingValue(values)

          infoText += `  :${key}: ${displayValues}\n`
        }
      } else if (processor.shortSettings) {
        if (infoText) infoText += "\n\n"
        infoText += `Settings: :${processor.shortSettings}\n`
      }

      // Configure the node
      const config = {
        title: title,
        subTitle: settingsDisplay, // Display settings in the node body
        position: position,
        info: infoText, // Keep the detailed info for the popup
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
        }],
        style: {
          subTitle: {
            fontSize: '10px', // Smaller font for settings
            textAlign: 'left',
            padding: '4px',
            whiteSpace: 'pre-wrap' // Preserve line breaks
          }
        }
      }

      // Create the node
      const node = new FlowNode(config)

      // Make sure we have a metadata object
      if (!node.metadata) {
        node.metadata = {}
      }

      // Helper function to set metadata on the node
      const setMetadata = (key, value) => {
        if (typeof node.setMetadataProperty === 'function') {
          node.setMetadataProperty(key, value)
        } else {
          node.metadata[key] = value
          // Also set on data for backward compatibility
          if (node.data) node.data[key] = value
        }
      }

      // Custom getter for metadata
      node.getMetadataProperty = node.getMetadataProperty || function (key) {
        return this.metadata[key] || (this.data ? this.data[key] : undefined)
      }

      // Set processor metadata
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

  // Helper to format setting values appropriately
  formatSettingValue(value) {
    if (value === null || value === undefined) return "null"

    // Handle URIs specially
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