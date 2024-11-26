import path from 'path'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class MarkdownFormatter extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {

        if (message.done) return

        // TODO move to config
        const dir = '/home/danny/github-danny/hyperdata/docs/postcraft/content-raw/chat-archives/md'

        const filename = `${message.content.created_at.substring(0, 10)}_${message.content.uuid.substring(0, 3)}.md`

        message.filepath = path.join(dir, message.meta.conv_uuid.substring(0, 4), filename)
        message.content = this.extractMarkdown(message)

        return this.emit('message', message)
    }

    // https://claude.ai/chat/be3ae4a9-51cd-42f6-a903-3193af00fed8

    extractMarkdown(message) {
        // TODO move to config
        const urlBase = 'https://claude.ai/chat/'

        const lines = []
        lines.push(`# [${message.meta.conv_name}](${urlBase}${message.meta.conv_uuid})\n`)
        //   lines.push(`${message.meta.conv_uuid}\n`)
        lines.push(`${message.content.uuid}\n`)
        // lines.push('')
        lines.push(message.content.text)
        lines.push('\n---\n')

        for (const [key, value] of Object.entries(message)) {
            if (key !== 'content' && value !== null) {
                if (value) {
                    const v = typeof value === 'object' ? JSON.stringify(value, null, 2) : value.toString()
                    lines.push(`* **${key}** : ${v}`)
                } else {
                    lines.push(`* **${key}** : [undefined]`)
                }
            }
        }

        return lines.join('\n')
    }

}

export default MarkdownFormatter
