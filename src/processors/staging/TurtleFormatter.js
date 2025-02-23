import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

class TurtleFormatter extends Processor {
    constructor(config) {
        super(config)
        this.baseURI = config.baseURI || 'http://example.org/'
    }

    async process(message) {
        try {
            const item = message.currentItem
            if (!item) {
                return
            }

            // Convert item to Turtle
            const turtle = this.formatTurtle(item)
            message.content = turtle
            message.targetFile = `${item.id}.ttl`

            this.emit('message', message)
        } catch (err) {
            logger.error("TurtleFormatter.execute error: " + err.message)
            throw err
        }
    }

    formatTurtle(item) {
        const lines = []
        lines.push('@prefix : <http://example.org/ns#> .')
        lines.push('@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .')
        lines.push('')

        const subject = `<${this.baseURI}${item.id}>`
        lines.push(`${subject} a :Item ;`)

        const entries = Object.entries(item)
        entries.forEach(([key, value], index) => {
            if (value !== null) {
                const isLast = index === entries.length - 1
                const literal = typeof value === 'string' ?
                    `"${value.replace(/"/g, '\\"')}"` :
                    `"${JSON.stringify(value)}"`
                lines.push(`    :${key} ${literal}${isLast ? ' .' : ' ;'}`)
            }
        })

        return lines.join('\n')
    }
}

export default TurtleFormatter
