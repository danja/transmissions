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

        // new Marked()
        const html = await
            marked
                //                .use(customHeadingId())
                .use(markedFootnote())
                .use(
                    markedCodeFormat({
                        /* Prettier options */
                    })
                )
                .parse(input.toString())

        const outputFieldPath = await this.getProperty(ns.trn.outputField, 'content')
        logger.debug(`\nMarkdownToHTML.process, outputField = ${outputFieldPath}`)
        message = JSONUtils.set(message, outputFieldPath, html)

        logger.debug(`message.content = ${message.content}`)
        return this.emit('message', message)
    }
}

export default MarkdownToHTML