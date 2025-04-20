// CustomNodeRenderer.js - Add to src/tools/nodeflow/components/

class CustomNodeRenderer {
  constructor(graph) {
    this.graph = graph
    this.originalRenderFunction = null
    this.setupCustomRenderer()
  }

  setupCustomRenderer() {
    /*
    if (!this.graph || !this.graph.nodeRenderer) {
      console.log(`graph = ${this.graph}`)
      console.log(`graph.nodeRenderer = ${this.graph.nodeRenderer}`)
      console.error('Cannot access graph or node renderer')
      return
    }
*/
    try {
      // Store the original render function

      this.originalRenderFunction = this.graph.nodeRenderer.renderNode

      // Replace with our custom render function
      this.graph.nodeRenderer.renderNode = this.customRenderNode.bind(this)

      console.log('Custom node renderer installed')
    } catch (error) {
      console.error('Failed to setup custom renderer:', error)
    }
  }

  customRenderNode(node, ctx) {
    try {
      // Call the original render function first to draw the basic node
      if (this.originalRenderFunction) {
        this.originalRenderFunction.call(this.graph.nodeRenderer, node, ctx)
      }

      // Now add our custom rendering for settings
      this.renderSettingsSection(node, ctx)
    } catch (error) {
      console.error('Error in custom node rendering:', error)

      // Fallback to original render if available
      if (this.originalRenderFunction) {
        this.originalRenderFunction.call(this.graph.nodeRenderer, node, ctx)
      }
    }
  }

  renderSettingsSection(node, ctx) {
    // Get settings data from node metadata or data
    const settingsData = node.getMetadataProperty ?
      node.getMetadataProperty('settingsData') :
      (node.data && node.data.settingsData)

    if (!settingsData) return

    // Get node position and dimensions
    const pos = node.position()
    const size = node.size()

    // Calculate settings section position (below the title)
    const titleHeight = 30 // Approximate height of title
    const settingsY = pos.y + titleHeight

    // Set up text properties
    ctx.save()
    ctx.font = '10px Arial'
    ctx.fillStyle = '#afb9bb'
    ctx.textAlign = 'left'

    // Draw settings background
    ctx.fillStyle = 'rgba(7, 33, 42, 0.6)'
    ctx.fillRect(pos.x, settingsY, size.width, size.height - titleHeight)

    // Draw border between title and settings
    ctx.strokeStyle = 'rgba(175, 185, 187, 0.2)'
    ctx.beginPath()
    ctx.moveTo(pos.x, settingsY)
    ctx.lineTo(pos.x + size.width, settingsY)
    ctx.stroke()

    // Draw settings text
    ctx.fillStyle = '#afb9bb'
    let textY = settingsY + 15 // Start position for text
    const lineHeight = 12
    const padding = 8

    // Render each setting as a line of text
    Object.entries(settingsData)
      .filter(([key]) => key !== 'type')
      .forEach(([key, values], index) => {
        const text = `${key}: ${Array.isArray(values) ?
          values.join(', ') :
          values}`

        // Check if we should truncate for long settings lists
        if (textY + lineHeight <= pos.y + size.height - 5) {
          ctx.fillText(text, pos.x + padding, textY)
          textY += lineHeight
        } else if (index === Object.keys(settingsData).length - 1) {
          // Show "..." if we have more settings than can fit
          ctx.fillText('...', pos.x + padding, textY)
        }
      })

    ctx.restore()
  }

  // Call this to restore the original renderer
  restoreOriginalRenderer() {
    if (this.graph && this.graph.nodeRenderer && this.originalRenderFunction) {
      this.graph.nodeRenderer.renderNode = this.originalRenderFunction
      console.log('Restored original node renderer')
    }
  }
}

export default CustomNodeRenderer