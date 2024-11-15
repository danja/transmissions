import path from 'path'
import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'

class MarkdownFormatter extends ProcessProcessor {
    constructor(config) {
        super(config)
    }

    async process(message) {


        ///  var dir = path.join(message.dataDir, message.meta.conv_uuid.substring(0, 4))
        //    if (!message.content) {
        // logger.log(`messyage = ${message.content}`)
        //  }
        if (message.content) {
            const filename = `${message.content.created_at.substring(0, 10)}_${message.content.uuid.substring(0, 3)}.md`

            message.filepath = path.join('output', message.meta.conv_uuid.substring(0, 4), filename) // message.dataDir,

            message.content = this.formatMarkdown(message.content)
        } else {
            logger.log('UNDEFINED CONTENT')
            return {}
        }

        return this.emit('message', message)
    }

    /*
    walkItem(item) {
        //  logger.reveal(item)
        //  for (const key of item) { // [key, value] 
        var content = ""
        for (const [key, value] of Object.entries(item)) {
            content = content + '\n' +  formatMarkdown(key)
     
        }
        return content
    }
    */

    formatMarkdown(item) {
        logger.reveal(item)
        const lines = []
        lines.push(`# ${item.title || 'Untitled'}`)
        lines.push('')

        for (const [key, value] of Object.entries(item)) {
            if (key !== 'title' && value !== null) {
                lines.push(`## ${key}`)
                lines.push('')
                lines.push(typeof value === 'object' ? JSON.stringify(value, null, 2) : value.toString())
                lines.push('')
            }
        }

        return lines.join('\n')
    }
}

export default MarkdownFormatter
