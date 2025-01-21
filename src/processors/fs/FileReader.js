import { readFile } from 'node:fs/promises';
import { access, constants, statSync } from 'node:fs';
import path from 'path';
import mime from 'node-mime-types'
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
            const filename = path.basename(filePath)
            return {
                filename: filename,
                mediaType: mime.getMIMEType(filename),
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
        logger.log(`FileReader.process, done=${message.done}`)

        if (message.done) return this.emit('message', message);

        let filePath;

        // First try deriving path from message properties
        if (message.fullPath) {
            filePath = message.fullPath;
        } else if (message.filepath) {
            if (message.targetPath && !path.isAbsolute(message.filepath)) {
                filePath = path.join(message.targetPath, message.filepath);
            } else {
                filePath = message.filepath;
            }
        } else {
            // Fall back to getting path from config
            filePath = await this.getProperty(ns.trn.sourceFile);
            if (!filePath) {
                throw new Error('No file path provided in message or config');
            }

            // Resolve relative to targetPath or rootDir
            if (!path.isAbsolute(filePath)) {
                filePath = path.join(message.targetPath || message.rootDir, filePath);
            }
        }

        logger.debug(`FileReader.process(), reading file: ${filePath}`);
        logger.debug(`FileReader.process(), process.cwd() = ${process.cwd()}`);

        // Verify file is readable
        await new Promise((resolve, reject) => {
            access(filePath, constants.R_OK, (err) => {
                if (err) {
                    reject(new Error(`File ${filePath} is not readable: ${err.message}`));
                }
                resolve();
            });
        });

        // Handle metadata if requested
        const metaField = await this.getProperty(ns.trn.metaField);
        if (metaField) {
            const metadata = this.getFileMetadata(filePath);
            message[metaField] = metadata;
        }

        // Read and return file content
        const content = await readFile(filePath, 'utf8');
        message.content = content;

        logger.debug(`FileReader successfully read file: ${filePath}`);
        return this.emit('message', message);
    }
}

export default FileReader;