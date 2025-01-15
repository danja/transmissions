import { readFile } from 'node:fs/promises';
import { access, constants } from 'node:fs';
import path from 'path';
import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';
import Processor from '../base/Processor.js';

/* SIGNATURE FOR JSDOC GOES HERE */

class ExampleProcessor extends Processor {
    constructor(config) {
        super(config);
    }

    async process(message) {
        logger.debug(`\n\nExampleProcessor.process`)

        // may be needed if preceded by a spawning processor, eg. fs/DirWalker
        if (message.done) {
            return this.emit('message', message)
        }

        // message is processed here

        // property values pulled from message | config settings | fallback
        const me = this.getProperty(ns.trn.me)
        logger.log(`\nI am ${me}`)

        message.common = this.getProperty(ns.trn.common)
        message.something1 = this.getProperty(ns.trn.something1)

        message.something2 = this.getProperty(ns.trn.something2)

        var added = this.getProperty(ns.trn.added, '')
        message.something1 = message.something1 + added

        message.notavalue = this.getProperty(ns.trn.notavalue, 'fallback value')

        // message forwarded
        return this.emit('message', message);
    }
}
export default ExampleProcessor;