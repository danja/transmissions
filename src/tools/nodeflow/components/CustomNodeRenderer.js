class CustomNodeRenderer {
  constructor(graph) {
    this.graph = graph
    this.originalRenderFunction = null
    this.setupCustomRenderer()
  }

  setupCustomRenderer() {
    try {
      // Check if graph exists
      if (!this.graph) {
        console.warn('CustomNodeRenderer: Graph is undefined')
        return
      }

      // Check if nodeRenderer exists
      if (!this.graph.nodeRenderer) {
        console.warn('CustomNodeRenderer: Graph nodeRenderer is undefined')
        return
      }

      // Check if renderNode method exists
      if (!this.graph.nodeRenderer.renderNode || typeof this.graph.nodeRenderer.renderNode !== 'function') {
        console.warn('CustomNodeRenderer: Graph nodeRenderer.renderNode is not available')
        return
      }

      // Store original render function
      this.originalRenderFunction = this.graph.nodeRenderer.renderNode

      // Override with custom renderer
      this.graph.nodeRenderer.renderNode = this.customRenderNode.bind(this)

      console.log('Custom node renderer installed')
    } catch (error) {
      console.error('Failed to setup custom renderer:', error)
    }
  }

  customRenderNode(node, ctx) {
    try {
      // Call original renderer first
      if (this.originalRenderFunction) {
        this.originalRenderFunction.call(this.graph.nodeRenderer, node, ctx)
      }

      // Add custom settings section
      this.renderSettingsSection(node, ctx)
    } catch (error) {
      console.error('Error in custom node rendering:', error)

      // Fallback to original renderer only
      if (this.originalRenderFunction) {
        this.originalRenderFunction.call(this.graph.nodeRenderer, node, ctx)
      }
    }
  }

  renderSettingsSection(node, ctx) {
    // Get settings data
    const settingsData = node.getMetadataProperty ?
      node.getMetadataProperty('settingsData') :
      (node.data && node.data.settingsData)

    if (!settingsData) return

    // Get node position and size
    const pos = node.position()
    const size = node.size()

    // Settings area positioning
    const titleHeight = 30
    const settingsY = pos.y + titleHeight

    ctx.save()
    ctx.font = '10px Arial'
    ctx.fillStyle = '#afb9bb'
    ctx.textAlign = 'left'

    // Background for settings
    ctx.fillStyle = 'rgba(7, 33, 42, 0.6)'
    ctx.fillRect(pos.x, settingsY, size.width, size.height - titleHeight)

    // Border line
    ctx.strokeStyle = 'rgba(175, 185, 187, 0.2)'
    ctx.beginPath()
    ctx.moveTo(pos.x, settingsY)
    ctx.lineTo(pos.x + size.width, settingsY)
    ctx.stroke()

    // Render settings text
    ctx.fillStyle = '#afb9bb'
    let textY = settingsY + 15
    const lineHeight = 12
    const padding = 8

    Object.entries(settingsData)
      .filter(([key]) => key !== 'type')
      .forEach(([key, values], index) => {
        const text = `${key}: ${Array.isArray(values) ?
          values.join(', ') :
          values}`

        if (textY + lineHeight <= pos.y + size.height - 5) {
          ctx.fillText(text, pos.x + padding, textY)
          textY += lineHeight
        } else if (index === Object.keys(settingsData).length - 1) {
          ctx.fillText('...', pos.x + padding, textY)
        }
      })

    ctx.restore()
  }

  // Restore original renderer
  restoreOriginalRenderer() {
    if (this.graph && this.graph.nodeRenderer && this.originalRenderFunction) {
      this.graph.nodeRenderer.renderNode = this.originalRenderFunction
      console.log('Restored original node renderer')
    }
  }
}

export default CustomNodeRenderer