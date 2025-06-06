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

    const options = {
      backgroundColor: '#07212a',

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
        minHeight: 80
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

    this.loader = new TransmissionsLoader()
    this.builder = new TransmissionsGraphBuilder(this.graph)
    this.exporter = new TransmissionsExporter(this.graph)
    this.publisher = new ProcessorNodePublisher()

    this.graph.addPublisher('transmissions', this.publisher)

    this.currentFile = null
    this.loadedTransmissions = []

    this.setupEvents()

    // Delay custom renderer setup until graph is ready
    setTimeout(() => {
      try {
        this.customRenderer = new CustomNodeRenderer(this.graph)
      } catch (error) {
        console.warn('CustomNodeRenderer initialization delayed:', error.message)
        // Try again later if it fails
        setTimeout(() => {
          try {
            this.customRenderer = new CustomNodeRenderer(this.graph)
          } catch (retryError) {
            console.warn('CustomNodeRenderer initialization failed:', retryError.message)
          }
        }, 500)
      }
    }, 100)

    console.log('TransmissionEditor: Initialized')
  }

  setupEvents() {

    try {
      this.graph.addOnNodeCreatedListener((publisher, nodeType, node) => {
        console.log(`TransmissionEditor: Node created - ${nodeType}`)

        if (this.loadedTransmissions.length > 0) {
          const transmission = this.loadedTransmissions[0]
          node.setMetadataProperty('transmissionId', transmission.id)
          node.setMetadataProperty('transmissionLabel', transmission.label)
          node.setMetadataProperty('processorType', `http://purl.org/stuff/transmissions/${nodeType}`)

          node.setMetadataProperty('settingsData', {})
        }
      })

      if (this.graph.onNodeSelected) {
        this.graph.onNodeSelected((node) => {

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

      this.reinitializeGraph()

      let transmissions = []
      try {
        transmissions = await this.loader.loadFromFile(fileUrl)

        if (!transmissions || transmissions.length === 0) {
          throw new Error('No transmissions found in file')
        }
      } catch (error) {
        console.error(`Error loading from file: ${error.message}`)
        console.warn('Falling back to sample data')

        const sampleTransmission = this.createSampleTransmission()
        transmissions = [sampleTransmission]
      }

      this.loadedTransmissions = transmissions

      this.publisher.registerProcessorsFromTransmissions(transmissions)

      await this.builder.buildGraph(transmissions)

      this.currentFile = fileUrl

      await this.safeRedrawGraph()

      console.log(`TransmissionEditor: Loaded ${transmissions.length} transmissions from ${fileUrl}`)
      return transmissions
    } catch (error) {
      console.error(`TransmissionEditor: Error loading file: ${error.message}`)
      throw error
    }
  }

  async safeRedrawGraph() {
    try {
      const nodes = this.graph.getNodes()
      if (Array.isArray(nodes)) {
        nodes.forEach(node => {
          if (node && typeof node.update === 'function') {

            node.render()
          }
        })
      }

      // Skip organize to preserve our initial centered positioning
      // organize() tends to reposition nodes and break our centering
      console.log('Skipping organize to preserve centering - connections should still work')
      
      // Give the graph a moment to settle and render
      setTimeout(() => {
        console.log('Graph should be rendered and centered')
      }, 100)
    } catch (error) {
      console.error('Error redrawing graph:', error)
    }
  }

  repositionNodesAfterOrganize() {
    try {
      console.log('Repositioning nodes to center after organize')
      
      const canvas = this.canvas
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      const canvasCenterX = canvasWidth / 2
      const canvasCenterY = canvasHeight / 2
      
      const nodes = this.graph.getNodes()
      if (!nodes || nodes.length === 0) {
        console.log('No nodes to reposition')
        return
      }
      
      console.log(`Centering ${nodes.length} nodes in ${canvasWidth}x${canvasHeight} canvas`)
      
      // Calculate new centered positions
      const totalWidth = nodes.length * 250
      const startX = canvasCenterX - (totalWidth / 2) + 125
      const centerY = canvasCenterY
      
      console.log(`New start position: (${startX}, ${centerY})`)
      
      // Reposition each node to be centered
      nodes.forEach((node, index) => {
        const newX = startX + (index * 250)
        const newY = centerY
        
        console.log(`Repositioning node ${index} to (${newX}, ${newY})`)
        
        // Try multiple approaches to set node position
        try {
          // Method 1: Direct property access (if available)
          if (node.x !== undefined) {
            node.x = newX
            node.y = newY
          }
          
          // Method 2: Position property
          if (node.position) {
            node.position.x = newX
            node.position.y = newY
          }
          
          // Method 3: setPosition method (if available)
          if (typeof node.setPosition === 'function') {
            node.setPosition(newX, newY)
          }
          
          // Method 4: moveTo method (if available)
          if (typeof node.moveTo === 'function') {
            node.moveTo(newX, newY)
          }
          
          // Force a re-render if possible
          if (typeof node.render === 'function') {
            node.render()
          }
          
        } catch (nodeError) {
          console.log(`Failed to reposition node ${index}:`, nodeError.message)
        }
      })
      
      // Force graph redraw
      try {
        if (typeof this.graph.render === 'function') {
          this.graph.render()
        }
        if (typeof this.graph.redraw === 'function') {
          this.graph.redraw()
        }
      } catch (redrawError) {
        console.log('Could not force graph redraw:', redrawError.message)
      }
      
      console.log('Node repositioning completed')
      
    } catch (error) {
      console.error('Error repositioning nodes after organize:', error)
    }
  }

  centerViewportWithOffset(offsetX, offsetY) {
    try {
      console.log(`Applying viewport offset: (${offsetX}, ${offsetY})`)
      
      // Try various methods to pan the viewport
      if (this.graph.camera) {
        console.log('Using graph.camera to apply offset')
        this.graph.camera.x = offsetX
        this.graph.camera.y = offsetY
      } else if (this.graph.viewport) {
        console.log('Using graph.viewport to apply offset')
        this.graph.viewport.x = -offsetX
        this.graph.viewport.y = -offsetY
      } else {
        console.log('No viewport control found for offset')
      }
    } catch (error) {
      console.error('Error applying viewport offset:', error)
    }
  }

  centerViewport() {
    try {
      console.log('Attempting to center viewport')
      
      // Simple approach: try to pan the graph to show centered content
      const canvas = this.canvas
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      
      // Estimate where nodes are positioned (around canvas center)
      const nodesCenterX = canvasWidth / 2
      const nodesCenterY = canvasHeight / 2
      
      // Check for various pan/transform methods
      if (this.graph.camera) {
        console.log('Using graph.camera to center viewport')
        this.graph.camera.x = -nodesCenterX + canvasWidth / 2
        this.graph.camera.y = -nodesCenterY + canvasHeight / 2
      } else if (this.graph.viewport) {
        console.log('Using graph.viewport to center')
        this.graph.viewport.x = nodesCenterX - canvasWidth / 2
        this.graph.viewport.y = nodesCenterY - canvasHeight / 2
      } else {
        console.log('No viewport control found, nodes should be visible at their positions')
      }
    } catch (error) {
      console.error('Error centering viewport:', error)
    }
  }

  centerGraph() {
    try {
      const nodes = this.graph.getNodes()
      if (!nodes || nodes.length === 0) return

      console.log('Attempting to center graph with', nodes.length, 'nodes')
      
      // Try using the graph's built-in panning capabilities first
      try {
        // Check if the graph has a viewport or camera that can be moved
        if (this.graph.pan) {
          console.log('Using graph.pan to center')
          // Get canvas dimensions
          const canvas = this.canvas
          const canvasCenterX = canvas.width / 2
          const canvasCenterY = canvas.height / 2
          
          // Pan to center the view on the typical node positions
          // Nodes are placed at y: 200, so center around that
          this.graph.pan(canvasCenterX - 450, canvasCenterY - 200)
          return
        }
        
        // Try graph transform methods
        if (this.graph.setTransform) {
          console.log('Using graph.setTransform to center')
          const canvas = this.canvas
          const canvasCenterX = canvas.width / 2
          const canvasCenterY = canvas.height / 2
          
          this.graph.setTransform(canvasCenterX - 450, canvasCenterY - 200, 1)
          return
        }
        
        // Try graph translation
        if (this.graph.translate) {
          console.log('Using graph.translate to center')
          const canvas = this.canvas
          const canvasCenterX = canvas.width / 2
          const canvasCenterY = canvas.height / 2
          
          this.graph.translate(canvasCenterX - 450, canvasCenterY - 200)
          return
        }
      } catch (graphError) {
        console.log('Graph-level centering failed, trying node-level:', graphError.message)
      }

      // Fallback: force re-layout with centered positions
      console.log('Using manual node repositioning to center')
      
      // Get canvas dimensions
      const canvas = this.canvas
      const canvasCenterX = canvas.width / 2
      const canvasCenterY = canvas.height / 2
      
      // Re-position nodes manually centered around canvas
      const startX = canvasCenterX - (nodes.length * 125) // Center the sequence
      const centerY = canvasCenterY
      
      nodes.forEach((node, index) => {
        const newX = startX + (index * 250)
        const newY = centerY
        
        console.log(`Repositioning node ${index} to (${newX}, ${newY})`)
        
        // Try to access internal position data
        try {
          if (node._data) {
            node._data.x = newX
            node._data.y = newY
          }
          if (node.data) {
            node.data.x = newX
            node.data.y = newY
          }
          // Force a re-render
          if (typeof node.render === 'function') {
            node.render()
          }
        } catch (nodeError) {
          console.log(`Failed to reposition node ${index}:`, nodeError.message)
        }
      })
      
      // Force graph redraw
      if (typeof this.graph.render === 'function') {
        this.graph.render()
      }
      
      console.log('Manual centering completed')
    } catch (error) {
      console.error('Error centering graph:', error)
    }
  }

  async prepareTTLContent() {
    try {

      if (this.loadedTransmissions.length > 0) {
        const transmission = this.loadedTransmissions[0]

        let ttl = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n`
        ttl += `@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n`
        ttl += `@prefix : <http://purl.org/stuff/transmissions/> .\n\n`

        ttl += `:${transmission.shortId} a :Transmission ;\n`
        if (transmission.label) {
          ttl += `    rdfs:label "${transmission.label}" ;\n`
        }
        if (transmission.comment) {
          ttl += `    rdfs:comment "${transmission.comment}" ;\n`
        }

        ttl += `    :pipe (`
        transmission.processors.forEach(p => {
          ttl += `:${p.shortId} `
        })
        ttl += `) .\n\n`

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

      const ttlContent = await this.prepareTTLContent()

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

    const options = {
      backgroundColor: '#07212a',

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
        minHeight: 80
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

    this.builder = new TransmissionsGraphBuilder(this.graph)
    this.exporter = new TransmissionsExporter(this.graph)

    this.graph.addPublisher('transmissions', this.publisher)

    this.setupEvents()

    // Delay custom renderer setup until graph is ready
    setTimeout(() => {
      this.customRenderer = new CustomNodeRenderer(this.graph)
    }, 100)

    console.log('TransmissionEditor: Graph reinitialized.')
  }

  createNewTransmission(label = 'New Transmission') {

    this.reinitializeGraph()

    const transmissionId = `http://purl.org/stuff/transmissions/${label.replace(/\s+/g, '_')}`.toLowerCase()

    const transmission = {
      id: transmissionId,
      shortId: label.replace(/\s+/g, '_').toLowerCase(),
      label: label,
      comment: 'Created with Node Flow Editor',
      processors: [],
      connections: []
    }

    this.loadedTransmissions = [transmission]

    const nodeType = 'ShowMessage'
    const node = new FlowNode({
      title: 'SM',
      position: { x: 200, y: 200 },
      data: {}
    })

    if (typeof node.setMetadataProperty === 'function') {
      node.setMetadataProperty('transmissionId', transmissionId)
      node.setMetadataProperty('transmissionLabel', label)
      node.setMetadataProperty('processorType', `http://purl.org/stuff/transmissions/${nodeType}`)

      node.setMetadataProperty('settingsData', {
        example: 'New setting value'
      })
    } else {

      node.metadata = node.metadata || {}
      node.metadata.transmissionId = transmissionId
      node.metadata.transmissionLabel = label
      node.metadata.processorType = `http://purl.org/stuff/transmissions/${nodeType}`
      node.metadata.settingsData = {
        example: 'New setting value'
      }

      if (node.data) {
        node.data.transmissionId = transmissionId
        node.data.transmissionLabel = label
        node.data.processorType = `http://purl.org/stuff/transmissions/${nodeType}`
        node.data.settingsData = {
          example: 'New setting value'
        }
      }
    }

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