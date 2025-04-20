import { NodeFlowGraph, FlowNode } from '@elicdavis/node-flow'
import TransmissionsLoader from './TransmissionsLoader.js'
import TransmissionsGraphBuilder from './TransmissionsGraphBuilder.js'
import TransmissionsExporter from './TransmissionsExporter.js'
import ProcessorNodePublisher from './ProcessorNodePublisher.js'
import RDFUtils from '../../../utils/RDFUtils.js'
import logger from '../../../utils/Logger.js'

class TransmissionEditor {
  constructor(canvas) {
    this.canvas = canvas

    // Initialize the graph with safe defaults
    const options = {
      backgroundColor: '#07212a',
      // Avoid zoom initialization issues
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

    // Create components
    this.loader = new TransmissionsLoader()
    this.builder = new TransmissionsGraphBuilder(this.graph)
    this.exporter = new TransmissionsExporter(this.graph)
    this.publisher = new ProcessorNodePublisher()

    // Register publishers
    this.graph.addPublisher('transmissions', this.publisher)

    // Initialize state
    this.currentFile = null
    this.loadedTransmissions = []

    // Set up event handlers
    this.setupEvents()

    console.log('TransmissionEditor: Initialized')
  }

  setupEvents() {
    // Safely add event listeners
    try {
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

      // Clear existing graph
      this.reinitializeGraph()

      // Load and parse transmission file
      let transmissions = []
      try {
        transmissions = await this.loader.loadFromFile(fileUrl)

        if (!transmissions || transmissions.length === 0) {
          throw new Error('No transmissions found in file')
        }
      } catch (error) {
        console.error(`Error loading from file: ${error.message}`)
        console.warn('Falling back to sample data')

        // Use sample data as fallback
        const sampleTransmission = this.createSampleTransmission()
        transmissions = [sampleTransmission]
      }

      this.loadedTransmissions = transmissions

      // Register processor types from loaded transmissions
      this.publisher.registerProcessorsFromTransmissions(transmissions)

      // Build the graph
      await this.builder.buildGraph(transmissions)

      // Update the current file reference
      this.currentFile = fileUrl

      // Ensure graph is rendered properly
      await this.safeRedrawGraph()

      console.log(`TransmissionEditor: Loaded ${transmissions.length} transmissions from ${fileUrl}`)
      return transmissions
    } catch (error) {
      console.error(`TransmissionEditor: Error loading file: ${error.message}`)
      throw error
    }
  }

  // Safer graph redraw method
  async safeRedrawGraph() {
    try {
      const nodes = this.graph.getNodes()
      if (Array.isArray(nodes)) {
        nodes.forEach(node => {
          if (node && typeof node.update === 'function') {
            //    node.update()
            node.render()
          }
        })
      }
      /*
            const edges = this.graph.getEdges()
            if (Array.isArray(edges)) {
              edges.forEach(edge => {
                if (edge && typeof edge.update === 'function') {
                  // edge.update()
                  edge.render()
                }
              })
            }
      */
      // Only call organize if it exists
      if (typeof this.graph.organize === 'function') {
        this.graph.organize()
      }
    } catch (error) {
      console.error('Error redrawing graph:', error)
    }
  }

  async prepareTTLContent() {
    try {
      // Create TTL representation of the current graph
      if (this.loadedTransmissions.length > 0) {
        const transmission = this.loadedTransmissions[0]

        let ttl = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n`
        ttl += `@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n`
        ttl += `@prefix : <http://purl.org/stuff/transmissions/> .\n\n`

        // Add transmission triple
        ttl += `:${transmission.shortId} a :Transmission ;\n`
        if (transmission.label) {
          ttl += `    rdfs:label "${transmission.label}" ;\n`
        }
        if (transmission.comment) {
          ttl += `    rdfs:comment "${transmission.comment}" ;\n`
        }

        // Add pipe listing
        ttl += `    :pipe (`
        transmission.processors.forEach(p => {
          ttl += `:${p.shortId} `
        })
        ttl += `) .\n\n`

        // Add processor definitions
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

        // Add settings definitions
        transmission.processors.forEach(p => {
          if (p.settingsData && p.shortSettings) {
            ttl += `\n:${p.shortSettings} a :ConfigSet`

            for (const [key, values] of Object.entries(p.settingsData)) {
              if (key === 'type') continue // Skip type property

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

      // Return default TTL if no transmissions are loaded
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
      // Generate TTL content
      const ttlContent = await this.prepareTTLContent()

      // Create and download blob
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

    // Create new graph instance with safe options
    const options = {
      backgroundColor: '#07212a',
      // Ensure navigation is properly initialized
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

    // Recreate components that need the graph
    this.builder = new TransmissionsGraphBuilder(this.graph)
    this.exporter = new TransmissionsExporter(this.graph)

    // Re-register the publisher
    this.graph.addPublisher('transmissions', this.publisher)

    // Set up event handlers again
    this.setupEvents()
    console.log('TransmissionEditor: Graph reinitialized.')
  }

  createNewTransmission(label = 'New Transmission') {
    // Reinitialize the graph
    this.reinitializeGraph()

    // Create a new transmission ID and object
    const transmissionId = `http://purl.org/stuff/transmissions/${label.replace(/\s+/g, '_')}`.toLowerCase()

    // Create new transmission object
    const transmission = {
      id: transmissionId,
      shortId: label.replace(/\s+/g, '_').toLowerCase(),
      label: label,
      comment: 'Created with Node Flow Editor',
      processors: [],
      connections: []
    }

    this.loadedTransmissions = [transmission]

    // Add a sample node to start with
    const nodeType = 'ShowMessage'
    const node = new FlowNode({
      title: 'SM',
      position: { x: 200, y: 200 },
      data: {}
    })

    // Set node metadata
    if (typeof node.setMetadataProperty === 'function') {
      node.setMetadataProperty('transmissionId', transmissionId)
      node.setMetadataProperty('transmissionLabel', label)
      node.setMetadataProperty('processorType', `http://purl.org/stuff/transmissions/${nodeType}`)
    } else {
      // Fallback if method not available
      node.metadata = node.metadata || {}
      node.metadata.transmissionId = transmissionId
      node.metadata.transmissionLabel = label
      node.metadata.processorType = `http://purl.org/stuff/transmissions/${nodeType}`

      // Also set in data for compatibility
      if (node.data) {
        node.data.transmissionId = transmissionId
        node.data.transmissionLabel = label
        node.data.processorType = `http://purl.org/stuff/transmissions/${nodeType}`
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