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
        logger.debug(`\n\nMarkdownToHTML.process`)
        logger.reveal(message)
        var input
        if (message.contentBlocks) { // using templating
            input = message.contentBlocks.content
        } else { // default
            input = message.content
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