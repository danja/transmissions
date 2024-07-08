import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'
import { parse } from 'marked'

class MarkdownToHTML extends ProcessService {

    async execute(message) {
        const input = message.content
        message.content = await parse(input.toString())
        //  const output =  
        // { articles: html }
        //      logger.log("=UTPUT = " + output)
        this.emit('message', message)
    }
}

export default MarkdownToHTML 