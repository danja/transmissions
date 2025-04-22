import logger from "../../utils/Logger.js"
import ns from "../../utils/ns.js"
import Processor from "../../model/Processor.js"
import { NodeMermaidRender } from "node-mermaid-render"

class MermaidRenderer extends Processor {
  constructor(config) {
    super(config)
    //   this.defaultSourcePath = 'input/flowchart.mermaid'
    //   this.defaultDestinationPath = 'output/flowchart.png'
  }

  /**
   * Does something with the message and emits a 'message' event with the processed message.
   * @param {Object} message - The message object.
   */
  async process(message) {
    logger.debug(`\n\nExampleProcessor.process`)

    // TODO figure this out better
    // may be needed if preceded by a spawning processor, eg. fs/DirWalker
    if (message.done) {
      return this.emit("message", message)
      // or simply return
    }

    const sourceField = await this.getProperty(ns.trn.sourceField, "content")
    const destinationField = await this.getProperty(
      ns.trn.destinationField,
      "content"
    )

    const mermaidRender = new NodeMermaidRender()

    await mermaidRender.launch()
    //initialize()

    const svg = await mermaidRender
      .renderToSVG(message[sourceField])
    //   .data.toString()

    message[destinationField]

    return this.emit("message", message)
  }

  renderer() {
    if (!this.renderer) {
      this.renderer = new NodeMermaidRender()
    }
    return this.renderer
  }
}
export default MermaidRenderer
