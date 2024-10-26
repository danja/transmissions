
import { readFile } from 'node:fs/promises'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'

class LineReader extends ProcessProcessor {

    constructor(config) {
        super(config)
    }

    async process(message) {

        const text = data.toString()

        /*
        text.split('\n').forEach(line => {
            if (line.trim() && !line.startsWith('#')) {
                logger.debug('Line = [[[' + line + ']]]')
                this.emit('message', line, message)
            }
        })
*/
        const lines = text.split('\n')
        for await (let line of lines) {
            if (line.trim() && !line.startsWith('#')) {
                logger.debug('Line = [[[' + line + ']]]')
                this.emit('message', line, message)
            }
        }

        this.emit('message', '~~done~~', message)
    }
}

export default LineReader