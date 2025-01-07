import { readdir } from 'fs/promises';
import { join, extname, relative, resolve, isAbsolute } from 'path';
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';

class DirWalker extends Processor {
    constructor(config) {
        super(config);
        this.includeExtensions = ['.md'];
        //    this.includeExtensions = ['.md', '.js', '.json', '.txt', '.html', '.css'];
        this.excludePrefixes = ['_', '.'];
    }

    async process(message) {
        logger.setLogLevel('debug')
        logger.debug('DirWalker.process start');

        // Initialize message state
        message.counter = 0;
        message.slugs = [];
        message.done = false;

        // Resolve the root directory to scan
        let rootDir = message.targetPath || message.rootDir;
        rootDir = isAbsolute(rootDir) ? rootDir : resolve(process.cwd(), rootDir);

        logger.debug(`DirWalker root directory: ${rootDir}`);

        // process.exit() ////////////////////////////////////////////////////////////////////////

        await this.walkDirectory(rootDir, message);

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
                        message.fullPath = fullPath; // Absolute path
                        message.filepath = relative(baseMessage.targetPath || baseMessage.rootDir, fullPath); // Relative path
                        message.done = false;
                        message.counter++;

                        logger.debug(`DirWalker emitting file:
                            filename: ${message.filename}
                            fullPath: ${message.fullPath}
                            filepath: ${message.filepath}`);

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