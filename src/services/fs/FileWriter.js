import { writeFile } from 'node:fs/promises'
import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import SinkService from '../base/SinkService.js'

class FileWriter extends SinkService {

    constructor(config) {
        super(config)
    }

    async execute(data, context) {
        var filename = context.targetFile

        if (!filename) {
            filename = this.locateConfig().value
        }
        logger.debug("Filewriter.targetFile = " + filename)

        const f = footpath.resolve(context.runScript, './data/', filename)
        try {
            await writeFile(f, data)

        } catch (err) {
            logger.error("FileWriter.execute error : " + err.message)
        }

        this.emit('message', data, context)
    }
}

export default FileWriter
