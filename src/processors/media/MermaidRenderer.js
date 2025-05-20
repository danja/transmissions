// src/processors/media/MermaidRenderer.js
import logger from "../../utils/Logger.js"
import ns from "../../utils/ns.js"
import Processor from "../../model/Processor.js"

/**
 * @class MermaidRenderer
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Converts Mermaid diagram definitions in the message to rendered output (e.g., SVG or PNG), using configuration for input/output paths when needed.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * Optional: source/destination paths for Mermaid files (e.g., via config or message fields)
 *
 * #### __*Input*__
 * * **`message`** - The message object containing Mermaid source (as string or file path)
 *
 * #### __*Output*__
 * * **`message`** - The message object with rendered diagram output (e.g., SVG/PNG content or file path)
 *
 * #### __*Behavior*__
 * * Reads Mermaid source from the message
 * * Renders diagram to the desired output format
 * * Emits the message with rendered output
 * * Logs key actions for debugging
 *
 * #### __*Side Effects*__
 * * May create or overwrite output files if configured
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Implement actual rendering logic
 * * Support multiple output formats and error handling
 */

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


    return this.emit("message", message)
  }

}
export default MermaidRenderer
