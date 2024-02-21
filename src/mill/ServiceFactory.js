import logger from '../utils/Logger.js'
import ns from '../utils/ns.js'
import { Connector } from './Connector.js';
import { Source } from '../services/Source.js';
import { Sink } from '../services/Sink.js';
import { Process } from '../services/Process.js';
import { StringSource } from '../services/StringSource.js';
import { StringSink } from '../services/StringSink.js';
import { AppendProcess } from '../services/AppendProcess.js';
import { ServiceBase } from '../services/ServiceBase.js';

class ServiceFactory {
    static createService(type, config) {
        logger.log("ServiceFactory.createService : " + type.value)

        if (type.equals(ns.t.StringSource)) {
            return new StringSource(config);
        }
        if (type.equals(ns.t.StringSink)) {
            return new StringSink(config);
        }
        if (type.equals(ns.t.AppendProcess)) {
            return new AppendProcess(config);
        }
        throw new Error("Unknown service type: " + type.value);
    }
}

export default ServiceFactory