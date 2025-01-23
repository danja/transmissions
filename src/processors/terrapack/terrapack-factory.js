import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';
import FileContainer from './FileContainer.js';

class PackerProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.FileContainer)) {
            logger.debug('PackerProcessorsFactory: Creating FileContainer processor');
            return new FileContainer(config);
        }
        return false;
    }
}

export default PackerProcessorsFactory;