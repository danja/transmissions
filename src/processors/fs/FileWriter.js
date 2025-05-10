import path from 'path'
import { access, constants, writeFileSync } from 'node:fs'
import ns from '../../utils/ns.js'
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { mkdir, mkdirSync } from 'node:fs'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import JSONUtils from '../../utils/JSONUtils.js'
/**
 * FileWriter class that extends Processor
 * Write data to a file.
 *
 * First checks `message.targetFilepath` and if not set, uses the value from `processors.ttl` using `settings` for this processor instance.
 *
 * #### __*Input*__
 * * message.filepath
 * * message.content
 * #### __*Output*__
 * * as Input
 *
 * if message.loadContext is set, that is used as a name in the message for the file content
 */
class FileWriter extends Processor {

    /**
     * Constructs a new FileWriter object.
     * @param {Object} config - The configuration object for the FileWriter.
     */
    constructor(config) {
        super(config)
        this.defaultFilePath = 'output/output.md'
    }

    /**
     * Executes the write operation.
     * @param {Object} message - The execution message.
     */
    async process(message) {
        logger.trace(`\n\nFileWriter.process, message.done = ${message.done}`)
        logger.trace(`FileWriter.process, count = ${message.eachCount}`)
        if (message.done) { // TODO fix this bloody thing
            logger.trace(`\n\nFileWriter.process, message.done = ${message.done} SKIPPING!!`)
            return
        }

        if (message.dump) {
            // TODO make optional (on done?) - is a pain for multi
            //    const filename = `message_${new Date().toISOString()}.json`
            const filename = 'message.json'
            const f = path.join(message.workingDir, filename)
            const content = JSON.stringify(message)
            // Check if the file is readable.
            access(f, constants.W_OK, (err) => {
                if (err) {
                    logger.error(`FileWriter error : ${f} is not writable.`)
                    logger.reveal(message)
                }
            })
            return this.doWrite(f, content, message)
        }

        var filePath = await this.getProperty(ns.trn.destinationFile)
        if (!filePath) {
            filePath = await this.getProperty(ns.trn.workingDir)
        }

        // Resolve relative to targetPath or rootDir
        if (!path.isAbsolute(filePath)) {
            filePath = path.join(message.targetPath || this.app.workingDir, filePath)
        }

        logger.trace(`Filewriter, filepath = ${filePath}`)
        const dirName = dirname(filePath)
        logger.trace("Filewriter, dirName = " + dirName)

        const contentPath = super.getProperty(ns.trn.contentField, 'content')
        //  var content = message.content // generalise, see above
        logger.trace(`Filewriter, contentPath = ${contentPath}`)
        const content = JSONUtils.get(message, contentPath)
        logger.trace(`Filewriter, content = ${content}`)


        this.mkdirs(dirName) // sync - see below
        await this.doWrite(filePath, content, message)
        return this.emit('message', message)
    }

    async doWrite(f, content, message) {
        logger.trace(`FileWriter.doWrite, file = ${f}`)
        logger.trace(`typeof content = ${typeof content}`)
        if (typeof content != 'string') {
            content = JSON.stringify(content)
        }
        logger.log(' - FileWriter writing : ' + f)

        /*
                if (f.includes(`[object Object]`)) {
                    logger.reveal(message)

                }
        */
logger.trace(`content = ${content}`)
        // maybe stat first, check validity - the intended target dir was blocked by a of the same name
        await writeFile(f, content)
        //writeFileSync(f, content)
        logger.trace(' - FileWriter written : ' + f)
    }

    mkdirs(dir) {
        logger.trace(`FileWriter.mkdirs, dir = ${dir}`)
        try {
            mkdirSync(dir, { recursive: true })
        }
        catch (e) {
            logger.warn(`Warn: FileWriter.mkdirs, maybe dir exists : ${dir} ?`)
        }
    }
}

export default FileWriter
