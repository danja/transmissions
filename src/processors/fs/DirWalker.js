import { readdir } from 'fs/promises';
import path from 'path';
import ns from '../../utils/ns.js';
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';

class DirWalker extends Processor {
    constructor(config) {
        super(config);
        this.includeExtensions = ['.md'];
        this.excludePrefixes = ['_', '.'];
        this.fileCount = 0
    }

    async process(message) {
        logger.debug('\nDirWalker.process');

        message.counter = 0;
        message.slugs = [];
        message.done = false;

        const sourceDir = this.getProperty(ns.trn.sourceDir);
        logger.debug(`DirWalker sourceDir from config = ${sourceDir}`);

        if (!sourceDir) {
            throw new Error('sourceDir property not found in configuration');
        }

        var includeExtensions = this.getProperty(ns.trn.includeExtensions);
        if (includeExtensions) {
            includeExtensions = includeExtensions.replaceAll('\'', '"');
            this.includeExtensions = JSON.parse(includeExtensions);
        }

        if (!message.sourceDir) {
            message.sourceDir = sourceDir;
        }

        logger.debug('\n\nDirWalker, message.targetPath = ' + message.targetPath)
        logger.debug('DirWalker, message.rootDir = ' + message.rootDir)
        logger.debug('DirWalker, message.sourceDir = ' + message.sourceDir)

        let dirPath;
        if (path.isAbsolute(sourceDir)) {
            dirPath = sourceDir;
        } else {
            if (message.targetPath) {
                dirPath = path.join(message.targetPath, sourceDir);
            } else {
                dirPath = path.join(message.rootDir, sourceDir);
            }
        }
        logger.debug(`DirWalker resolved dirPath = ${dirPath}`);

        await this.walkDirectory(dirPath, message);

        const finalMessage = structuredClone(message);
        finalMessage.done = true;
        logger.debug("DirWalker emitting final done=true message");
        return this.emit('message', finalMessage);
    }

    async walkDirectory(dir, baseMessage) {
        logger.debug(`DirWalker.walkDirectory, dir = ${dir}`);
        logger.reveal(this.message)
        const entries = await readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && !this.excludePrefixes.includes(entry.name[0])) {
                await this.walkDirectory(fullPath, baseMessage);
            } else if (entry.isFile()) {
                const extension = path.extname(entry.name);
                const prefix = entry.name[0];

                if (!this.excludePrefixes.includes(prefix) &&
                    this.includeExtensions.includes(extension)) {
                    const message = structuredClone(baseMessage);
                    message.filename = entry.name;
                    message.subdir = path.dirname(path.relative(message.targetPath, fullPath)).split(path.sep)[1];
                    message.fullPath = fullPath;
                    message.filepath = path.relative(baseMessage.targetPath || baseMessage.rootDir, fullPath);
                    message.done = false;
                    message.counter++;

                    const slug = message.filename.split('.')[0]
                    message.slugs.push(slug)

                    logger.debug(`DirWalker emitting :
                        message.targetPath: ${message.targetPath}
                        message.filename: ${message.filename}
                        message.fullPath: ${message.fullPath}
                        message.subdir: ${message.subdir}
                        message.filepath: ${message.filepath}
                        message.slugs: ${message.slugs}`);
                    //        process.exit()
                    message.fileCount++
                    this.emit('message', message);
                }
            }
        }
    }
}

export default DirWalker;