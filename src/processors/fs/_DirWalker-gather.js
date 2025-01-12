import { readdir } from 'fs/promises';
import path from 'path';
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';

class DirWalker extends Processor {
    constructor(config) {
        super(config);
        this.includeExtensions = ['.md'];
        this.excludePrefixes = ['_', '.'];
        this.filePromises = [];
    }

    async gatherFiles(dir) {
        const entries = await readdir(dir, { withFileTypes: true });
        let files = [];

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && !this.excludePrefixes.includes(entry.name[0])) {
                files = files.concat(await this.gatherFiles(fullPath));
            } else if (entry.isFile()) {
                const extension = path.extname(entry.name);
                const prefix = entry.name[0];
                if (!this.excludePrefixes.includes(prefix) &&
                    this.includeExtensions.includes(extension)) {
                    files.push(fullPath);
                }
            }
        }
        return files;
    }

    async processFile(fullPath, baseMessage) {
        const message = structuredClone(baseMessage);
        message.filename = path.basename(fullPath);
        message.fullPath = fullPath;
        message.filepath = path.relative(baseMessage.targetPath || baseMessage.rootDir, fullPath);
        message.subdir = path.dirname(path.relative(message.targetPath, fullPath)).split(path.sep)[1];
        message.done = false;
        message.counter++;
        logger.debug(`DirWalker processing file: ${message.filepath}`);
        return this.emit('message', message);
    }

    async process(message) {
        logger.setLogLevel('debug')
        logger.debug('\nDirWalker.process');

        message.counter = 0;
        message.slugs = [];
        message.done = false;

        const sourceDirProperty = this.getProperty(ns.trm.sourceDir);
        let sourceDir = sourceDirProperty;

        let includeExtensions = this.getProperty(ns.trm.includeExtensions);
        if (includeExtensions) {
            includeExtensions = includeExtensions.replaceAll('\'', '"');
            this.includeExtensions = JSON.parse(includeExtensions);
        }

        if (!message.sourceDir) {
            message.sourceDir = sourceDir;
        }

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

        logger.debug(`DirWalker, dirPath = ${dirPath}`);

        const files = await this.gatherFiles(dirPath);

        // Process all files and wait for completion
        await Promise.all(
            files.map(file => this.processFile(file, message))
        );

        // Send completion message
        const finalMessage = structuredClone(message);
        finalMessage.done = true;
        logger.debug("DirWalker emitting final done=true message");
        return this.emit('message', finalMessage);
    }
}

export default DirWalker;