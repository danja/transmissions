// src/tools/nodeflow/components/TransmissionEditor.js
import { NodeFlowGraph, FlowNode } from '@elicdavis/node-flow'
import TransmissionsLoader from './TransmissionsLoader.js'
import TransmissionsGraphBuilder from './TransmissionsGraphBuilder.js'
import TransmissionsExporter from './TransmissionsExporter.js'
import ProcessorNodePublisher from './ProcessorNodePublisher.js'
import RDFUtils from '../../../utils/RDFUtils.js'
import logger from '../../../utils/Logger.js'

class TransmissionEditor {
  /**
   * Creates a new transmission editor
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

    // Register the publisher with the graph
    this.graph.addPublisher('transmissions', this.publisher)

    // Initialize state
    this.currentFile = null
    this.loadedTransmissions = []

    // Set up event listeners
    this.setupEvents()

    console.log('TransmissionEditor: Initialized')
  }

  /**
   * Sets up event listeners
   */
  setupEvents() {
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
  }

  /**
   * Create a sample transmission for fallback
   */
  createSampleTransmission() {
    // Create a sample transmission for testing
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
          comments: ['Displays message contents and continues']
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

  /**
   * Loads a transmission file
   */
  async loadFromFile(fileUrl) {
    try {
      console.log(`TransmissionEditor: Loading from ${fileUrl}`)

      // Try to load the transmissions
      let transmissions = []
      try {
        transmissions = await this.loader.loadFromFile(fileUrl)

        if (!transmissions || transmissions.length === 0) {
          throw new Error('TransmissionsEditorloadFromFile, No transmissions found in file')
        }
      } catch (error) {
        console.warn(`Error loading from file: ${error.message}`)
        console.warn('Falling back to sample data')

        // If loading fails, use the sample transmission
        const sampleTransmission = this.createSampleTransmission()
        transmissions = [sampleTransmission]
      }

      this.loadedTransmissions = transmissions

      // Register processor types from the loaded transmissions
      this.publisher.registerProcessorsFromTransmissions(transmissions)

      // Build the graph from the transmissions
      this.builder.buildGraph(transmissions)

      // Update current file
      this.currentFile = fileUrl

      console.log(`TransmissionEditor: Loaded ${transmissions.length} transmissions from ${fileUrl}`)
      return transmissions
    } catch (error) {
      console.error(`TransmissionEditor: Error loading file: ${error.message}`)
      throw error
    }
  }

  /**
   * Prepares TTL content for saving
   */
  async prepareTTLContent() {
    try {
      // For now, return a simple TTL representation of the loaded transmission
      if (this.loadedTransmissions.length > 0) {
        const transmission = this.loadedTransmissions[0]

        let ttl = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n`
        ttl += `@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n`
        ttl += `@prefix : <http://purl.org/stuff/transmissions/> .\n\n`

        // Transmission
        ttl += `:${transmission.shortId} a :Transmission ;\n`
        if (transmission.label) {
          ttl += `    rdfs:label "${transmission.label}" ;\n`
        }
        if (transmission.comment) {
          ttl += `    rdfs:comment "${transmission.comment}" ;\n`
        }

        // Pipe
        ttl += `    :pipe (`
        transmission.processors.forEach(p => {
          ttl += `:${p.shortId} `
        })
        ttl += `) .\n\n`

        // Processors
        transmission.processors.forEach(p => {
          ttl += `:${p.shortId} a :${p.shortType} `
          if (p.comments && p.comments.length > 0) {
            ttl += `;\n    rdfs:comment "${p.comments[0]}" `
          }
          ttl += `.\n`
        })

        return ttl
      }

      // Fallback to a default TTL
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

  /**
   * Saves the current transmissions to a file
   */
  async saveToFile(filePath = null, transmissionId = null) {
    try {
      // Get the TTL content
      const ttlContent = await this.prepareTTLContent()

      // Create a Blob and download
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

  /**
   * Creates a new transmission
   */
  createNewTransmission(label = 'New Transmission') {
    const transmissionId = `http://purl.org/stuff/transmissions/${label.replace(/\s+/g, '_')}`.toLowerCase()

    // Create a transmission object
    const transmission = {
      id: transmissionId,
      shortId: label.replace(/\s+/g, '_').toLowerCase(),
      label: label,
      comment: 'Created with Node Flow Editor',
      processors: [],
      connections: []
    }

    this.loadedTransmissions = [transmission]

    // Create an initial node
    const nodeType = 'ShowMessage'
    const node = new FlowNode({
      title: 'SM',
      position: { x: 200, y: 200 },
      data: {}
    })

    // Set node metadata
    node.setMetadataProperty('transmissionId', transmissionId)
    node.setMetadataProperty('transmissionLabel', label)
    node.setMetadataProperty('processorType', `http://purl.org/stuff/transmissions/${nodeType}`)

    // Add the node to the graph
    this.graph.addNode(node)

    return transmission
  }

  /**
   * Gets the graph instance
   */
  getGraph() {
    return this.graph
  }
}

export default TransmissionEditor