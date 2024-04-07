import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'
import { parse } from 'marked'

class MarkdownToHTML extends ProcessService {

    async execute(input, context) {
        const output = await parse(input);
        this.emit('message', output, context)
    }
}

export default MarkdownToHTML 