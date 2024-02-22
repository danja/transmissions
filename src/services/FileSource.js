
import logger from '../utils/Logger.js'
import Source from './Source.js';

class FileSource extends Source {

    read(sourceID) {
        return this.readFile(sourceID)
    }

    readFile(filename) {
        let text = fs.readFileSync(filename, 'utf8')
        return text;
    }
}

export default FileSource




