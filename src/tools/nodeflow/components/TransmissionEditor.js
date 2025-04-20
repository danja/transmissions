import { NodeFlowGraph, FlowNode } from '@elicdavis/node-flow'
import TransmissionsLoader from './TransmissionsLoader.js'
import TransmissionsGraphBuilder from './TransmissionsGraphBuilder.js'
import TransmissionsExporter from './TransmissionsExporter.js'
import ProcessorNodePublisher from './ProcessorNodePublisher.js'
import CustomNodeRenderer from './CustomNodeRenderer.js'
import RDFUtils from '../../../utils/RDFUtils.js'
import logger from '../../../utils/Logger.js'

class TransmissionEditor {
  constructor(canvas) {
    this.canvas = canvas

    // Default options for the graph
    const options = {
      backgroundColor: '#07212a',
      // Configure node appearance
      nodeDefaults: {
        style: {
          title: {
            color: '#154050',
            textStyle: {
              color: '#afb9bb'
            }
          },
          subTitle: {
            color: 'rgba(7, 33, 42, 0.6)',
            textStyle: {
              color: '#afb9bb',
              fontSize: '10px'
            }
          }
        },
        minHeight: 80 // Ensure nodes have minimum height for settings
      },
      navigation: {
        enabled: true,
        zoom: {
          min: 0.1,
          max: 2,
          default: 1
        }
      }
    }

    this.graph = new NodeFlowGraph(canvas, options)

    // Add custom renderer
    this.customRenderer = new CustomNodeRenderer(this.graph)

    // Initialize components
    this.loader = new TransmissionsLoader()
    this.builder = new TransmissionsGraphBuilder(this.graph)
    this.exporter = new TransmissionsExporter(this.graph)
    this.publisher = new ProcessorNodePublisher()

    // Add the processor publisher to the graph
    this.graph.addPublisher('transmissions', this.publisher)

    // State tracking
    this.currentFile = null
    this.loadedTransmissions = []

    // Set up event handlers
    this.setupEvents()

    console.log('TransmissionEditor: Initialized')
  }

  setupEvents() {
    // Set up event listeners for the graph
    try {
      this.graph.addOnNodeCreatedListener((publisher, nodeType, node) => {
        console.log(`TransmissionEditor: Node created - ${nodeType}`)

        // Add transmission metadata to newly created nodes
        if (this.loadedTransmissions.length > 0) {
          const transmission = this.loadedTransmissions[0]
          node.setMetadataProperty('transmissionId', transmission.id)
          node.setMetadataProperty('transmissionLabel', transmission.label)
          node.setMetadataProperty('processorType', `http://purl.org/stuff/transmissions/${nodeType}`)

          // Add default empty settings
          node.setMetadataProperty('settingsData', {})
        }
      })

      // Add select event to show settings in info box
      if (this.graph.onNodeSelected) {
        this.graph.onNodeSelected((node) => {
          // Update info display with settings
          const settingsData = node.getMetadataProperty('settingsData')
          if (settingsData) {
            const infoText = Object.entries(settingsData)
              .filter(([key]) => key !== 'type')
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n')

            if (node.setInfo) {
              node.setInfo(infoText)
            }
          }
        })
      }
    } catch (error) {
      console.error('Error setting up event listeners:', error)
    }
  }

  createSampleTransmission() {
    const transmission = {
      id: 'http://purl.org/stuff/transmissions/example',
      shortId: 'example',
      label: 'Example Transmission',
      comment: 'A simple transmission pipeline for testing',
      processors: [
        {
          id: 'http://purl.org/stuff/transmissions/p10',
          shortId: 'p10',
          type: 'http://purl.org/stuff/transmissions/ShowMessage',
          shortType: 'ShowMessage',
          comments: ['Displays message contents and continues'],
          settingsData: {
            'exampleSetting': ['value1', 'value2'],
            'anotherSetting': ['sample']
          }
        },
        {
          id: 'http://purl.org/stuff/transmissions/p20',
          shortId: 'p20',
          type: 'http://purl.org/stuff/transmissions/NOP',
          shortType: 'NOP',
          comments: ['No operation, just passes message through']
        },
        {
          id: 'http://purl.org/stuff/transmissions/p30',
          shortId: 'p30',
          type: 'http://purl.org/stuff/transmissions/DeadEnd',
          shortType: 'DeadEnd',
          comments: ['Ends the current pipe quietly']
        }
      ],
      connections: [
        {
          from: 'http://purl.org/stuff/transmissions/p10',
          to: 'http://purl.org/stuff/transmissions/p20'
        },
        {
          from: 'http://purl.org/stuff/transmissions/p20',
          to: 'http://purl.org/stuff/transmissions/p30'
        }
      ]
    }

    this.loadedTransmissions = [transmission]
    return transmission
  }

  async loadFromFile(fileUrl) {
    try {
      console.log(`TransmissionEditor: Loading from ${fileUrl}`)

      // Clear the existing graph
      this.reinitializeGraph()

      // Load the transmission data
      let transmissions = []
      try {
        transmissions = await this.loader.loadFromFile(fileUrl)

        if (!transmissions || transmissions.length === 0) {
          throw new Error('No transmissions found in file')
        }
      } catch (error) {
        console.error(`Error loading from file: ${error.message}`)
        console.warn('Falling back to sample data')

        // Fall back to sample data
        const sampleTransmission = this.createSampleTransmission()
        transmissions = [sampleTransmission]
      }

      this.loadedTransmissions = transmissions

      // Register processor types from the loaded transmissions
      this.publisher.registerProcessorsFromTransmissions(transmissions)

      // Build the graph from the transmissions
      await this.builder.buildGraph(transmissions)

      // Store the current file
      this.currentFile = fileUrl

      // Ensure the graph is correctly displayed
      await this.safeRedrawGraph()

      console.log(`TransmissionEditor: Loaded ${transmissions.length} transmissions from ${fileUrl}`)
      return transmissions
    } catch (error) {
      console.error(`TransmissionEditor: Error loading file: ${error.message}`)
      throw error
    }
  }

  // Safely redraw the graph, handling errors
  async safeRedrawGraph() {
    try {
      const nodes = this.graph.getNodes()
      if (Array.isArray(nodes)) {
        nodes.forEach(node => {
          if (node && typeof node.update === 'function') {
            // Ensure node is rendered
            node.render()
          }
        })
      }

      // Organize the graph layout if possible
      if (typeof this.graph.organize === 'function') {
        this.graph.organize()
      }
    } catch (error) {
      console.error('Error redrawing graph:', error)
    }
  }

  async prepareTTLContent() {
    try {
      // Generate TTL content from the current graph
      if (this.loadedTransmissions.length > 0) {
        const transmission = this.loadedTransmissions[0]

        let ttl = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n`
        ttl += `@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n`
        ttl += `@prefix : <http://purl.org/stuff/transmissions/> .\n\n`

        // Transmission declaration
        ttl += `:${transmission.shortId} a :Transmission ;\n`
        if (transmission.label) {
          ttl += `    rdfs:label "${transmission.label}" ;\n`
        }
        if (transmission.comment) {
          ttl += `    rdfs:comment "${transmission.comment}" ;\n`
        }

        // Pipe list
        ttl += `    :pipe (`
        transmission.processors.forEach(p => {
          ttl += `:${p.shortId} `
        })
        ttl += `) .\n\n`

        // Processor declarations
        transmission.processors.forEach(p => {
          ttl += `:${p.shortId} a :${p.shortType} `
          if (p.comments && p.comments.length > 0) {
            ttl += `;\n    rdfs:comment "${p.comments[0]}" `
          }
          if (p.shortSettings) {
            ttl += `;\n    :settings :${p.shortSettings} `
          }
          ttl += `.\n`
        })

        // Settings declarations
        transmission.processors.forEach(p => {
          if (p.settingsData && p.shortSettings) {
            ttl += `\n:${p.shortSettings} a :ConfigSet`

            for (const [key, values] of Object.entries(p.settingsData)) {
              if (key === 'type') continue

              if (Array.isArray(values)) {
                values.forEach(value => {
                  ttl += ` ;\n    :${key} "${value}"`
                })
              } else {
                ttl += ` ;\n    :${key} "${values}"`
              }
            }

            ttl += ` .\n`
          }
        })

        return ttl
      }

      // Default template if no transmission is loaded
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

  async saveToFile(filePath = null, transmissionId = null) {
    try {
      // Generate the TTL content
      const ttlContent = await this.prepareTTLContent()

      // Create a download
      const blob = new Blob([ttlContent], { type: 'text/turtle' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filePath || 'transmission.ttl'
      document.body.appendChild(a)
      a.click()

      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 0)

      console.log(`TransmissionEditor: Saved TTL content`)
    } catch (error) {
      console.error(`TransmissionEditor: Error saving file: ${error.message}`)
      throw error
    }
  }

  reinitializeGraph() {
    console.log('TransmissionEditor: Reinitializing graph...')

    // Create new graph with the same options
    const options = {
      backgroundColor: '#07212a',
      // Configure node appearance
      nodeDefaults: {
        style: {
          title: {
            color: '#154050',
            textStyle: {
              color: '#afb9bb'
            }
          },
          subTitle: {
            color: 'rgba(7, 33, 42, 0.6)',
            textStyle: {
              color: '#afb9bb',
              fontSize: '10px'
            }
          }
        },
        minHeight: 80 // Ensure nodes have minimum height for settings
      },
      navigation: {
        enabled: true,
        zoom: {
          min: 0.1,
          max: 2,
          default: 1
        }
      }
    }

    this.graph = new NodeFlowGraph(this.canvas, options)


    // Create a new custom renderer
    // TODO figure out HERE
    this.customRenderer = new CustomNodeRenderer(this.graph)

    // Reinitialize components
    this.builder = new TransmissionsGraphBuilder(this.graph)
    this.exporter = new TransmissionsExporter(this.graph)

    // Add the publisher to the graph
    this.graph.addPublisher('transmissions', this.publisher)

    // Set up events
    this.setupEvents()
    console.log('TransmissionEditor: Graph reinitialized.')
  }

  createNewTransmission(label = 'New Transmission') {
    // Reinitialize the graph
    this.reinitializeGraph()

    // Create a new transmission ID based on the label
    const transmissionId = `http://purl.org/stuff/transmissions/${label.replace(/\s+/g, '_')}`.toLowerCase()

    // Create a basic transmission structure
    const transmission = {
      id: transmissionId,
      shortId: label.replace(/\s+/g, '_').toLowerCase(),
      label: label,
      comment: 'Created with Node Flow Editor',
      processors: [],
      connections: []
    }

    this.loadedTransmissions = [transmission]

    // Add an initial ShowMessage node
    const nodeType = 'ShowMessage'
    const node = new FlowNode({
      title: 'SM',
      position: { x: 200, y: 200 },
      data: {}
    })

    // Set metadata on the node
    if (typeof node.setMetadataProperty === 'function') {
      node.setMetadataProperty('transmissionId', transmissionId)
      node.setMetadataProperty('transmissionLabel', label)
      node.setMetadataProperty('processorType', `http://purl.org/stuff/transmissions/${nodeType}`)

      // Add settings data
      node.setMetadataProperty('settingsData', {
        example: 'New setting value'
      })
    } else {
      // Fallback for older node-flow versions
      node.metadata = node.metadata || {}
      node.metadata.transmissionId = transmissionId
      node.metadata.transmissionLabel = label
      node.metadata.processorType = `http://purl.org/stuff/transmissions/${nodeType}`
      node.metadata.settingsData = {
        example: 'New setting value'
      }

      // Also set on data for compatibility
      if (node.data) {
        node.data.transmissionId = transmissionId
        node.data.transmissionLabel = label
        node.data.processorType = `http://purl.org/stuff/transmissions/${nodeType}`
        node.data.settingsData = {
          example: 'New setting value'
        }
      }
    }

    // Add the node to the graph
    try {
      this.graph.addNode(node)
    } catch (error) {
      console.error('Error adding node to graph:', error)
    }

    return transmission
  }

  getGraph() {
    return this.graph
  }
}

export default TransmissionEditor