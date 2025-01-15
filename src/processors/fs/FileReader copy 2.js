import { readFile } from 'node:fs/promises';
import { access, constants, statSync } from 'node:fs';
import path from 'path';
import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';
import Processor from '../base/Processor.js';

class FileReader extends Processor {
    constructor(config) {
        super(config);
    }

    getFileMetadata(filePath) {
        try {
            const stats = statSync(filePath);
            return {
                filename: path.basename(filePath),
                filepath: filePath,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                accessed: stats.atime,
                isDirectory: stats.isDirectory(),
                isFile: stats.isFile(),
                permissions: stats.mode,
                owner: stats.uid,
                group: stats.gid
            };
        } catch (error) {
            logger.error(`Error getting file metadata: ${error.message}`);
            return null;
        }
    }

    async process(message) {
        logger.setLogLevel('debug')
        if (message.done) {
            return this.emit('message', message);
        }


        logger.debug(`\n\nFileReader.process(), this.getTag() = ${this.getTag()}`);
        logger.debug(`\n\n1 FileReader.process(), message.fullPath = ${message.fullPath}`);
        logger.debug(`FileReader.process(), message.filepath = ${message.filepath}`);
        logger.debug(`FileReader.process(), message.targetPath = ${message.targetPath}`);

        let filePath;
        if (!message.fullPath) {
            if (!message.filepath) return;
            if (message.targetPath && !path.isAbsolute(message.filepath)) {
                filePath = path.join(message.targetPath, message.filepath);
            } else {
                filePath = message.filepath;
            }
        } else {
            filePath = message.fullPath;
        }

        logger.debug(`\n\n3 FileReader.process(), reading file: ${filePath}`);
        logger.debug(`FileReader.process(), process.cwd() = ${process.cwd()}`);

        // Check file accessibility
        await new Promise((resolve, reject) => {
            access(filePath, constants.R_OK, (err) => {
                if (err) {
                    reject(new Error(`File ${filePath} is not readable: ${err.message}`));
                }
                resolve();
            });
        });

        // Get metadata
        const metaField = this.getProperty(ns.trn.metaField);
        if (metaField) {
            const metadata = this.getFileMetadata(filePath);
            message[metaField] = metadata;
        }

        // Read file content
        const content = await readFile(filePath, 'utf8');
        message.content = content;
        logger.log('--------------------------------------------')
        logger.reveal(message)
        logger.log('--------------------------------------------')
        logger.debug(`FileReader successfully read file: ${filePath}`);
        return this.emit('message', message);
    }
}

export default FileReader;