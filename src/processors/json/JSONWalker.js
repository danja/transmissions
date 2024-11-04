import path from 'path'
import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'
import ns from '../../utils/ns.js'

class JSONWalker extends ProcessProcessor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        try {
            // targetDir

            // TODO MOVE!
            var targetDir = this.getPropertyFromMyConfig(ns.trm.targetDir)
            targetDir = path.join(process.cwd(), targetDir)
            logger.debug(`JSONWalker:targetDir =  ${targetDir}`)

            const payload = structuredClone(message.payload)

            // SEEMS TO BE GETTING A STRING
            logger.log(payload)
            logger.log(typeof payload)
            if (!payload || typeof payload !== 'object') {
                throw new Error('Invalid JSON payload')
            }
            message.payload = {} // TODO option in config

            // Walk the JSON structure and emit message for each item
            for (const item of Object.values(payload)) { // payload
                const clonedMessage = structuredClone(message)
                clonedMessage.item = item
                message.item = item  // TODO refactor, grab the last
                //   clonedMessage.currentItem = item
                // this.emit('message', clonedMessage)
                this.emit('message', clonedMessage)
            }

            // Signal completion
            message.done = true
            this.emit('message', message) // TODO note value of payload & item
        } catch (err) {
            logger.error("JSONWalker.process error: " + err.message)
            throw err
        }
    }
}

export default JSONWalker
