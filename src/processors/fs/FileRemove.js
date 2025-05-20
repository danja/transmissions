// src/processors/fs/FileRemove.js
/**
 * @class FileRemove
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Removes files or directory contents on the local filesystem.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.target`** - The target path to remove (relative to `applicationRootDir` or absolute)
 *
 * #### __*Input*__
 * * **`message`** - The message object
 * * **`message.applicationRootDir`** (optional) - The root directory of the application
 * * **`message.target`** - The path of the file or directory to remove (if not using `ns.trn.target`)
 *
 * #### __*Output*__
 * * **`message`** - The input message, unmodified
 *
 * #### __*Behavior*__
 * * Removes individual files directly using `fs.unlink`
 * * Recursively removes directory contents while preserving the directory itself
 * * Skips dotfiles by default (configurable via `ignoreDotfiles`)
 * * Gracefully handles already-removed files
 * * Logs debug information about the removal process
 *
 * #### __*Side Effects*__
 * * Deletes files and directories from the filesystem
 *
 * #### __*Tests*__
 * * `./run file-copy-remove-test`
 * * `npm test -- tests/integration/file-copy-remove-test.spec.js`
 *
 * @example
 * // Remove a file
 * const remover = new FileRemove({});
 * await remover.process({ target: '/path/to/file.txt' });
 *
 * // Remove a directory's contents
 * await remover.process({ target: '/path/to/directory' });
 */

import { unlink, readdir, stat, rm } from 'node:fs/promises'
import path from 'path'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import PathResolver from '../../utils/PathResolver.js'

class FileRemove extends Processor {
    /**
     * Creates a new FileRemove processor instance.
     * @param {Object} config - Processor configuration object
     */
    constructor(config) {
        super(config)
        /** @private */
        this.ignoreDotfiles = true // Controls whether to ignore dotfiles during removal
    }

    /**
     * Executes the file or directory removal operation
     * @param {Object} message - The input message
     */
    async process(message) {
        //  logger.setLogLevel('debug')
        this.ignoreDotfiles = true // default, simplify ".gitinclude"

        // Use PathResolver for file path resolution (consistent with FileReader/FileWriter)
        const target = await PathResolver.resolveFilePath({
            message,
            app: this.app,
            getProperty: (prop, def) => this.getProperty(prop, def),
            defaultFilePath: null, // No default, must be provided
            sourceOrDest: ns.trn.target
        })
        logger.debug('FileRemove, target = ' + target)

        try {
            const removeStat = await stat(target)

            if (removeStat.isFile()) {
                await this.removeFile(target)
            } else if (removeStat.isDirectory()) {
                await this.removeDirectoryContents(target)
            }
        } catch (err) {
            // probably already gone
            logger.debug('FileRemove, target stat caused err : ' + target)
        }

        return this.emit('message', message)
    }

    /**
     * Removes a file
     * @param {string} filePath - The path to the file to remove
     */
    /**
     * Removes a single file.
     * @param {string} filePath - The absolute path to the file to remove
     * @returns {Promise<void>} Resolves when the file is removed
     * @private
     */
    async removeFile(filePath) {
        await unlink(filePath)
    }

    /**
     * Recursively removes the contents of a directory
     * @param {string} dirPath - The path to the directory
     */
    /**
     * Recursively removes all contents of a directory.
     * @param {string} dirPath - The absolute path to the directory
     * @returns {Promise<void>} Resolves when all contents are removed
     * @private
     */
    async removeDirectoryContents(dirPath) {
        logger.debug('FileRemove, dirPath = ' + dirPath)
        const entries = await readdir(dirPath, { withFileTypes: true })

        for (const entry of entries) {
            if (this.ignoreDotfiles && (entry.name.charAt(0) === ".")) {
                continue
            }
            const entryPath = path.join(dirPath, entry.name)

            if (entry.isDirectory()) {
                await this.removeDirectoryContents(entryPath)
            } else {
                await unlink(entryPath)
            }
        }
    }
}

export default FileRemove