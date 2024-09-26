import axios from 'axios'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'

class HttpGet extends ProcessProcessor {

    constructor(config) {
        super(config)
    }

    async execute(url, message) {
        if (url === '~~done~~') {
            logger.log('HG DONE*****************')
            this.emit('message', url, message)
            return
        }
        try {
            logger.log('HG GETTING*****************')
            const response = await axios.get(url)
            const content = response.data

            message.sourceURL = url
            this.emit('message', content, message)
        } catch (error) {
            logger.error("HttpGet.execute error\n" + error)
        }
    }
}

export default HttpGet