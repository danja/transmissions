import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'
import { parse } from 'marked'

class MarkdownToHTML extends ProcessService {

    async execute(context) {
        const input = context.content
        context.content = await parse(input.toString())
        //  const output =  
        // { articles: html }
        //      logger.log("=UTPUT = " + output)
        this.emit('message', context)
    }
}

export default MarkdownToHTML 