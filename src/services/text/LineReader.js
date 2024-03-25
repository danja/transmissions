
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

    async execute(data) {
        const text = data.content.toString();

        text.split('\n').forEach(line => {
            if (line.trim() && !line.startsWith('#')) {
                //  console.log(line);
                this.emit('data', line)
            }
        })
    }
}

export default LineReader