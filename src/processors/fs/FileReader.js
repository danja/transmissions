import { readFile } from 'node:fs/promises';
import { access, constants } from 'node:fs';
import path from 'path';
import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';
import Processor from '../base/Processor.js';

class FileReader extends Processor {
    constructor(config) {
        super(config);
    }

    async process(message) {
        logger.setLogLevel('debug')
        //    logger.setLogLevel('info')
        logger.debug(`\n\nFileReader.process(), message.fullPath =  ${message.fullPath}`);
        logger.debug(`FileReader.process(), message.filepath = ${message.filepath}`);
        logger.debug(`FileReader.process(), message.targetPath = ${message.targetPath}`);

        try {
            /*             const filePath = message.fullPath || message.filepath;
                       if (!filePath) {
                           logger.warn('FileReader: No file path provided');
                           return;
                       }

           */
            var filePath = message.fullPath
            if (!filePath) {
                if (message.targetPath) {
                    logger.debug(`FileReader.process(), message.filepath = ${message.filepath}`);
                    logger.debug(`FileReader.process(), message.targetPath = ${message.targetPath}`);
                    filePath = path.join(message.targetPath, message.filepath)
                } else {
                    filePath = message.filePath
                }
            }

            logger.debug(`FileReader.process(), reading file: ${filePath}`);
            logger.debug(`FileReader.process(), process.cwd() = ${process.cwd()}`)
            // Check file accessibility
            await new Promise((resolve, reject) => {
                access(filePath, constants.R_OK, (err) => {
                    if (err) {
                        reject(new Error(`File ${filePath} is not readable: ${err.message}`));
                    }
                    resolve();
                });
            });

            // Read file content
            const content = await readFile(filePath, 'utf8');
            message.content = content;

            logger.debug(`FileReader successfully read file: ${filePath}`);
            return this.emit('message', message);

        } catch (err) {
            logger.error('FileReader error:', err);
            throw err;
        }
    }
}

export default FileReader;