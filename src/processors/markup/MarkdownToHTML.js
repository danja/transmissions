import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'
// import { parse } from 'marked'
import { marked } from 'marked'

// marked extensions
import markedFootnote from 'marked-footnote'
import markedCodeFormat from 'marked-code-format'
// import customHeadingId from "marked-custom-heading-id";

class MarkdownToHTML extends Processor {


    async process(message) {
        logger.trace(`\n\nMarkdownToHTML.process`)
        if (message.done) return

        // logger.reveal(message)

        // TODO use config to point to I/O fields, add sensible defaults
        var input
        if (message.contentBlocks) { // using templating
            input = message.contentBlocks.content
        } else { // default
            input = message.content
        }
        if (!input) { // shouldn't get here TODO double-check MESSAGE.DONE
            logger.debug(`MarkdownToHTML.process, no input`)
            return this.emit('message', message)
        }

        // new Marked()
        message.content = await
            marked
                //                .use(customHeadingId())
                .use(markedFootnote())
                .use(
                    markedCodeFormat({
                        /* Prettier options */
                    })
                )
                .parse(input.toString())

        return this.emit('message', message)
    }
}

export default MarkdownToHTML