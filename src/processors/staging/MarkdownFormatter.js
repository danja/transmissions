import path from 'path'
import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'

class MarkdownFormatter extends ProcessProcessor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        try {
            /*
            const item = message.currentItem
            if (!item) {
                return
            }
*/
            const item = message.item

            const dt = item.updated_at.substring(0, 19)
            message.sessionID = `CC_${dt}`
            message.sessionName = item.name

            // TODO is in config
            const dir = '/home/danny/github-danny/hyperdata/docs/postcraft/content-raw/claude-chat'

            message.filepath = path.join(dir, `CC_${dt}.md`) // message.dataDir,


            message.content = this.formatMarkdown(message.content)

            return this.emit('message', message)
        } catch (err) {
            logger.error("MarkdownFormatter.execute error: " + err.message)
            throw err
        }
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
    /*
    for (const [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
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
