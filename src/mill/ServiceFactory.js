import logger from '../utils/Logger.js'
import ns from '../utils/ns.js'

import StringSource from '../services/StringSource.js';
import StringSink from '../services/StringSink.js';
import AppendProcess from '../services/AppendProcess.js';
import FileSource from '../services/FileSource.js';
import FileSink from '../services/FileSink.js';

class ServiceFactory {
    static createService(type, config) {
        logger.debug("ServiceFactory.createService : " + type.value)

        if (type.equals(ns.t.StringSource)) {
            return new StringSource(config);
        }
        if (type.equals(ns.t.StringSink)) {
            return new StringSink(config);
        }
        if (type.equals(ns.t.AppendProcess)) {
            return new AppendProcess(config);
        }
        if (type.equals(ns.t.FileSource)) {
            return new FileSource(config);
        }
        if (type.equals(ns.t.FileSink)) {
            return new FileSink(config);
        }
        throw new Error("Unknown service type: " + type.value);
    }
}

export default ServiceFactory