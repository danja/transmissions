import Processor from '../base/Processor.js';
import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';
import path from 'path';

class FileContainer extends Processor {
    constructor(config) {
        super(config);
        this.container = {
            files: {},
            summary: {
                totalFiles: 0,
                fileTypes: {},
                timestamp: new Date().toISOString()
            }
        };
    }

    async process(message) {
        message.filepath = await this.getProperty(ns.trn.destination);
        if (message.done) {

            // TODO FIX ME
            message.filepath = message.filepath + '_done.txt'

            message.content = JSON.stringify(this.container, null, 2);
            //   message.filepath = this.getPropertyFromMyConfig(ns.trn.destination);

            return this.emit('message', message);
        }

        if (!message.filepath || !message.content) {
            logger.warn('FileContainer: Missing filepath or content');
            // this.emit('message', message);
            return
        }

        // Store relative path from target directory
        const targetDir = message.targetPath || message.rootDir;
        const relativePath = path.relative(targetDir, message.filepath);

        // Add file to container
        this.container.files[relativePath] = {
            content: message.content,
            type: path.extname(message.filepath),
            timestamp: new Date().toISOString()
        };

        // Update summary
        this.container.summary.totalFiles++;
        const fileType = path.extname(message.filepath) || 'unknown';
        this.container.summary.fileTypes[fileType] = (this.container.summary.fileTypes[fileType] || 0) + 1;

        return this.emit('message', message);
    }
}

export default FileContainer;