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
        if (message.done) {
            message.content = JSON.stringify(this.container, null, 2);
            message.filepath = this.getPropertyFromMyConfig(ns.trm.destination);
            return this.emit('message', message);
        }

        if (!message.filepath || !message.content) {
            logger.warn('FileContainer: Missing filepath or content');
            return;
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