
import { readFile } from 'node:fs/promises'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class LineReader extends ProcessService {

    constructor(config) {
        super(config)
    }

    async execute(context) {

        const text = data.toString()

        /*
        text.split('\n').forEach(line => {
            if (line.trim() && !line.startsWith('#')) {
                logger.debug('Line = [[[' + line + ']]]')
                this.emit('message', line, context)
            }
        })
*/
        const lines = text.split('\n')
        for await (let line of lines) {
            if (line.trim() && !line.startsWith('#')) {
                logger.debug('Line = [[[' + line + ']]]')
                this.emit('message', line, context)
            }
        }

        this.emit('message', '~~done~~', context)
    }
}

export default LineReader