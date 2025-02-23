
import { readFile } from 'node:fs/promises'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

class LineReader extends Processor {

    constructor(config) {
        super(config)
    }

    async process(message) {

        const text = data.toString()


        const lines = text.split('\n')
        for await (let line of lines) {
            if (line.trim() && !line.startsWith('#')) {
                logger.debug('Line = [[[' + line + ']]]')
                return this.emit('message', line, message)
            }
        }

        return this.emit('message', '~~done~~', message)
    }
}

export default LineReader