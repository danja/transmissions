import Processor from '../base/Processor.js';
import path from 'path';
import logger from '../../utils/Logger.js';

class FilenameMapper extends Processor {
    constructor(config) {
        super(config);
        this.extensions = {
            html: '.mm.html',
            svg: '.mm.svg'
        };
    }

    async process(message) {
        const format = message.format || 'html';
        const extension = this.extensions[format];

        if (!extension) {
            throw new Error(`Unknown format: ${format}`);
        }

        const parsedPath = path.parse(message.filepath);
        message.filepath = path.join(
            parsedPath.dir,
            parsedPath.name + extension
        );

        return this.emit('message', message);
    }
}

export default FilenameMapper;
