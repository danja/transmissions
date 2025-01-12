import { readdir } from 'fs/promises';
// import { join, extname, relative, resolve, isAbsolute } from 'path';
import path from 'path';
import ns from '../../utils/ns.js'
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
        logger.debug('\nDirWalker.process');

        // Initialize message state
        message.counter = 0;
        message.slugs = [];
        message.done = false;

        const sourceDirProperty = this.getProperty(ns.trn.sourceDir)
        var sourceDir = sourceDirProperty

        var includeExtensions = this.getProperty(ns.trn.includeExtensions)
        if (includeExtensions) {
            logger.debug(`includeExtensions = ${includeExtensions}`)
            includeExtensions = includeExtensions.replaceAll('\'', '"')
            logger.debug(`includeExtensions = ${includeExtensions}`)
            this.includeExtensions = JSON.parse(includeExtensions);
        }
        // process.exit()
        // hacky, but need it later
        if (!message.sourceDir) message.sourceDir = sourceDir
        logger.log(sourceDir)

        /*
        var this.getPropertyFromMyConfig(ns.trn.source)
        this.getPropertyFromMyConfig(n)
        this.showMyConfig()
*/

        /*
        // Resolve the root directory to scan
        let rootDir = message.targetPath || message.rootDir;
        rootDir = isAbsolute(rootDir) ? rootDir : resolve(process.cwd(), rootDir);

        logger.debug(`DirWalker root directory: ${rootDir}`);
*/
        //  if (!message.sourceDir) {
        //    message.sourceDir = "."
        // }
        //    logger.reveal(message)
        logger.debug('\n\nDirWalker, message.targetPath = ' + message.targetPath)
        logger.debug('DirWalker, message.rootDir = ' + message.rootDir)
        logger.debug('DirWalker, message.sourceDir = ' + message.sourceDir)

        let dirPath
        if (path.isAbsolute(sourceDir)) {
            dirPath = sourceDir
        } else {
            if (message.targetPath) {
                dirPath = path.join(message.targetPath, sourceDir)
            } else {
                dirPath = path.join(message.rootDir, sourceDir)
            }
        }
        logger.debug('DirWalker, dirPath = ' + dirPath)

        //  process.exit() ////////////////////////////////////////////////////////////////////////

        if (!message.sourceDir) {
            message.sourceDir = sourceDirProperty
        }

        await this.walkDirectory(dirPath, message);

        // maybe    await new Promise(resolve => setTimeout(resolve, 0));

        // Send final done message
        const finalMessage = structuredClone(message);
        finalMessage.done = true;
        logger.debug("DirWalker emitting final done=true message");
        return this.emit('message', finalMessage);
    }

    async walkDirectory(dir, baseMessage) {

        logger.debug(`DirWalker.walkDirectory, dir = ${dir}`)

        const entries = await readdir(dir, { withFileTypes: true });

        //   const processingPromises = [];

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            logger.debug(`DirWalker.walkDirectory, fullPath = ${fullPath}`)
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
                    message.fullPath = fullPath; // Absolute path
                    message.filepath = path.relative(baseMessage.targetPath || baseMessage.rootDir, fullPath); // Relative path
                    message.done = false;
                    message.counter++;

                    logger.debug(`DirWalker emitting file:
                            filename: ${message.filename}
                            fullPath: ${message.fullPath}
                            filepath: ${message.filepath}`);

                    //              processingPromises.push(this.emit('message', message));
                    this.emit('message', message);
                }
            }
        }
        //     await Promise.all(processingPromises);
        //   } catch (err) {
        //     logger.error(`Error walking directory ${dir}:`, err);
        // }
    }
}

export default DirWalker;