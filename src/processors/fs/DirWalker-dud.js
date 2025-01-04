import { readdir } from 'fs/promises';
import { join, extname, relative } from 'path';
import grapoi from 'grapoi';
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';

class DirWalker extends Processor {
    constructor(config) {
        super(config);
        this.includeExtensions = ['.md', '.js', '.json', '.txt', '.html', '.css'];
        this.excludePrefixes = ['_', '.'];
    }

    async process(message) {
        logger.debug('DirWalker.process');
        message.counter = 0;
        message.slugs = [];
        message.done = false;

        if (!message.sourceDir) {
            message.sourceDir = ".";
        }

        let dirPath;
        if (message.targetPath) {
            dirPath = join(message.targetPath, message.sourceDir);
        } else {
            dirPath = join(message.rootDir, message.sourceDir);
        }
        logger.debug('DirWalker, dirPath = ' + dirPath);

        await this.walkDirectory(dirPath, message);

        // Send final done message
        const finalMessage = structuredClone(message);
        finalMessage.done = true;
        return this.emit('message', finalMessage);
    }

    async walkDirectory(dir, baseMessage) {
        try {
            const entries = await readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = join(dir, entry.name);

                if (entry.isDirectory() && !this.excludePrefixes.includes(entry.name[0])) {
                    await this.walkDirectory(fullPath, baseMessage);
                } else if (entry.isFile()) {
                    const extension = extname(entry.name);
                    const prefix = entry.name[0];

                    if (!this.excludePrefixes.includes(prefix) &&
                        this.includeExtensions.includes(extension)) {

                        const message = structuredClone(baseMessage);
                        message.filename = entry.name;
                        message.filepath = fullPath;
                        message.relativePath = relative(message.targetPath || message.rootDir, fullPath);
                        message.done = false;
                        message.counter++;

                        logger.debug(`DirWalker emitting file: ${message.filepath}`);
                        this.emit('message', message);
                    }
                }
            }
        } catch (err) {
            logger.error(`Error walking directory ${dir}:`, err);
        }
    }
}

export default DirWalker;