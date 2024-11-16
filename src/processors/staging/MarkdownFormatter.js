import path from 'path'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class MarkdownFormatter extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {

        // logger.reveal(message)
        if (message.done) return

        const filename = `${message.content.created_at.substring(0, 10)}_${message.content.uuid.substring(0, 3)}.md`

        //   message.filepath = path.join('output', 'temp', message.meta.conv_uuid.substring(0, 4), filename) // message.dataDir,
        message.filepath = path.join('/home/danny/github-danny/hyperdata/docs/chat-archives/md', message.meta.conv_uuid.substring(0, 4), filename)
        message.content = this.extractMarkdown(message)

        return this.emit('message', message)
    }

    extractMarkdown(message) {
        const lines = []
        lines.push(`# ${message.meta.conv_name}\n`)
        lines.push(`${message.meta.conv_uuid}\n`)
        lines.push(`${message.content.uuid}\n`)
        // lines.push('')
        lines.push(message.content.text)
        lines.push('\n---\n')

        for (const [key, value] of Object.entries(message)) {
            if (key !== 'content' && value !== null) {
                const v = typeof value === 'object' ? JSON.stringify(value, null, 2) : value.toString()
                lines.push(`* **${key}** : ${v}`)
            }
        }

        return lines.join('\n')
    }

}

export default MarkdownFormatter
