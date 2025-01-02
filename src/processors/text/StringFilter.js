import { readFileSync } from 'fs';
import ignore from 'ignore';
import path from 'path';
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';
import ns from '../../utils/ns.js';

class StringFilter extends Processor {
    constructor(config) {
        super(config);
        this.ig = ignore();
        this.loadGitignore(config);
    }

    loadGitignore(config) {
        try {
            const gitignorePath = this.getPropertyFromMyConfig(ns.trm.excludeFile) || '.gitignore';
            const gitignoreContent = readFileSync(gitignorePath, 'utf8');
            this.ig.add(gitignoreContent.split('\n').filter(line => line.trim() && !line.startsWith('#')));
        } catch (err) {
            logger.debug(`No ${gitignorePath} file found or unable to read it`);
        }
    }

    async process(message) {
        if (!message.filepath || message.done) {
            return this.emit('message', message);
        }

        /*
        const relativePath = path.relative(message.rootDir, message.filepath);

        logger.log('StringFilter, relative path = ' + relativePath)
        if (!this.ig.ignores(relativePath)) {
            return this.emit('message', message);
        }
*/

        // #:todo recognising about.md for an application got broken

        const cleanPath = path.normalize(
            path.relative(message.rootDir, path.resolve(message.rootDir, message.filepath))
        );

        logger.log('StringFilter, relative path = ' + cleanPath);


        if (!this.ig.ignores(cleanPath)) {
            return this.emit('message', message);
        }
        logger.debug(`Filtered out: ${relativePath}`);
    }
}

export default StringFilter;