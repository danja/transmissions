import axios from 'axios'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class HttpGet extends ProcessService {

    constructor(config) {
        super(config)
    }

    async execute(url, context) {
        if (url === '~~done~~') {
            logger.log('HG DONE*****************')
            this.emit('message', url, context)
            return
        }
        try {
            logger.log('HG GETTING*****************')
            const response = await axios.get(url)
            const content = response.data

            context.sourceURL = url
            this.emit('message', content, context)
        } catch (error) {
            logger.error("HttpGet.execute error\n" + error)
        }
    }
}

export default HttpGet