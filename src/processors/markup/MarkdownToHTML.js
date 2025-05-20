// src/processors/markup/MarkdownToHTML.js
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import JSONUtils from '../../utils/JSONUtils.js'
import Processor from '../../model/Processor.js'
// import { parse } from 'marked'
import { marked } from 'marked'

// marked extensions
import markedFootnote from 'marked-footnote'
import markedCodeFormat from 'marked-code-format'
// import customHeadingId from "marked-custom-heading-id";

/**
 * @class MarkdownToHTML
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Converts Markdown content in the message to HTML using the `marked` library and relevant extensions.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * None specific (uses message fields and optional config for input/output fields)
 *
 * #### __*Input*__
 * * **`message`** - The message object containing Markdown content (e.g., `contentBlocks.content` or other fields)
 *
 * #### __*Output*__
 * * **`message`** - The message object with new/updated HTML content fields
 *
 * #### __*Behavior*__
 * * Reads Markdown from the message (supports templated and direct content)
 * * Converts Markdown to HTML using `marked` and its extensions
 * * Attaches the resulting HTML to the message
 * * Logs key actions for debugging
 *
 * #### __*Side Effects*__
 * * Mutates the message object in place
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Use config to control input/output fields
 * * Add tests for edge cases and custom extensions
 */

class MarkdownToHTML extends Processor {


    async process(message) {
        logger.debug(`\n\nMarkdownToHTML.process`)
        if (message.done) return

        // logger.reveal(message)
        // TODO use config to point to I/O fields, add sensible defaults
        var input
        if (message.contentBlocks) { // using templating
            input = message.contentBlocks.content
            logger.debug(`MarkdownToHTML.process, using contentBlocks: ${input}`)
        } else { // default
            input = message.content
        }
        var html = ''
        // new Marked()
        try {
            html = await
                marked
                    .use(markedFootnote())
                    .use(
                        markedCodeFormat({
                        })
                    )
                    .setOptions({
                        gfm: true,  // GitHub-Flavored Markdown
                        breaks: false,  // Disable line breaks
                        sanitize: false,  // Ensure raw HTML is allowed (sanitization disables this)
                        smartypants: false, // Disable smart quotes
                        headerIds: true, // Optional: prevent auto generation of header ids
                        mangle: false, // Optional: disable mangle for links and email
                    })
                    .parse(input.toString())
        } catch (e) {
            logger.warn(`Error reported by marked in MarkdownToHTML :\n${e.message}\n[[\n${input}\n]]`)
            return
            //  process.exit(1)
        }
        const outputFieldPath = this.getProperty(ns.trn.outputField, 'content')
        logger.debug(`\nMarkdownToHTML.process, outputField = ${outputFieldPath}`)
        message = JSONUtils.set(message, outputFieldPath, html)

        logger.debug(`message.content = ${message.content}`)
        return this.emit('message', message)
    }
}

export default MarkdownToHTML