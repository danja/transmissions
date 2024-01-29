
import {Connector} from '../services/Connector.js';
import {Source} from '../services/Source.js';
import {Sink} from '../services/Sink.js';
import {Process} from '../services/Process.js';
import {StringSource} from '../services/StringSource.js';
import {StringSink} from '../services/StringSink.js';
import {AppendProcess} from '../services/AppendProcess.js';
import {ServiceBase} from '../services/ServiceBase.js';

export class ServiceFactory {
    static createService(type, config) {

        if (type === 'Connector') {
            return new Connector(config);
        }
        if (type === 'Source') {
            return new Source(config);
        }
        if (type === 'Sink') {
            return new Sink(config);
        }
        if (type === 'Process') {
            return new Process(config);
        }
        if (type === 'StringSource') {
            return new StringSource(config);
        }
        if (type === 'StringSink') {
            return new StringSink(config);
        }
        if (type === 'AppendProcess') {
            return new AppendProcess(config);
        }
        if (type === 'ServiceBase') {
            return new ServiceBase(config);
        }

        return null;

    }
}
