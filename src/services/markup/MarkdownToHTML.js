import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'
// import { parse } from 'marked'
import { marked } from 'marked'

// marked extensions
import markedFootnote from 'marked-footnote'
import markedCodeFormat from 'marked-code-format'
// import customHeadingId from "marked-custom-heading-id";

class MarkdownToHTML extends ProcessService {


    async execute(message) {
        const input = message.content

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

        this.emit('message', message)
    }
}

export default MarkdownToHTML 