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

        if (message.done) { // may be needed if preceded by a spawning processor, eg. fs/DirWalker
            return this.emit('message', message)
        }

        //   const me = this.getProperty(ns.trn.me)
        // logger.log(`\nI am ${me}`)

        // property values pulled from message | config settings | fallback with
        // message.something = this.getProperty(ns.trn.something)

        var addedStuff = this.getProperty(ns.trn.addedStuff, '')

        // message.notFound = this.getProperty(ns.trn.nonExistent, 'fallback when property not found')

        // message is processed here

        message.addedStuff = message.addedStuff + addedStuff

        // and forwarded
        return this.emit('message', message);
    }
}
export default ExampleProcessor;