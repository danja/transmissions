import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';
import FileContainer from './FileContainer.js';

class ContainerProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.t.FileContainer)) {
            return new FileContainer(config);
        }
        return false;
    }
}

export default ContainerProcessorsFactory;