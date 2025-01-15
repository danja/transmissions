// src/processors/fs/FileRemove.js
/**
 * FileRemove Processor
 *
 * Removes files or directory contents on the local filesystem.
 * @extends Processor
 *
 * #### __*Input*__
 * * message.applicationRootDir (optional) - The root directory of the application
 * * message.target (if no settings) - The path of the file or directory to remove
 *
 * #### __*Configuration*__
 * If a settings is provided in the transmission:
 * * ns.trn.target - The target path relative to applicationRootDir
 *
 * #### __*Output*__
 * * Removes the specified file or directory contents
 * * message (unmodified) - The input message is passed through
 *
 * #### __*Behavior*__
 * * Removes individual files directly
 * * Recursively removes directory contents
 * * Logs debug information about the removal process
 *
 * #### __Tests__
 * `./run file-copy-remove-test`
 * `npm test -- tests/integration/file-copy-remove-test.spec.js`
 *
 */

import { readFile } from 'node:fs/promises';
import { access, constants } from 'node:fs';
import path from 'path';
import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';
import Processor from '../base/Processor.js';


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