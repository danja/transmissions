// ModuleLoader.js
//   ./trans ../trans-apps/applications/module-load-test 
/*

ModuleLoader.js contains a ModuleLoader class that encapsulates the module loading logic. It provides methods for loading both CommonJS (loadModule) and ES modules (loadESModule).
The ModuleLoader class maintains its own cache, allowing different instances to have separate caches if needed.
A.js and B.js can independently create instances of ModuleLoader with their own classpaths.
The loadESModule method is asynchronous, so it needs to be awaited when used.

This structure allows for more flexibility:

Each file can have its own ModuleLoader instance with a different classpaths if needed.
The module loading logic is encapsulated and reusable.
It's easier to maintain and extend the module loading functionality in one place.

Remember to run Node.js with the --experimental-modules flag if you're using an older version of Node.js that doesn't support ES modules by default. Also, you may need to add .js extensions to your import statements depending on your Node.js version and configuration.
*/
import { createRequire } from 'module';
import { join } from 'path';
import logger from '../utils/Logger.js'
import { fileURLToPath } from 'url';
import { Readable } from 'stream';
import { promises as fs } from 'fs';
import fetch from 'node-fetch';

export class ModuleLoader {

    constructor(classpaths) {
        logger.log(`ModuleLoader constructor, classpaths = ${classpaths}`);
        this.classpaths = classpaths
        classpaths.push("fucker");
        logger.log('constructor(classpaths) this.classpaths = ' + this.classpaths)
        this.moduleCache = new Map();
    }

    async loadModule(source, type = 'path') {
        if (this.moduleCache.has(source)) {
            console.log(`Module ${source} loaded from cache`);
            return this.moduleCache.get(source);
        }

        let module;
        switch (type) {
            case 'path':
                module = await this.loadModuleFromPath(source);
                break;
            case 'string':
                module = await this.loadModuleFromString(source);
                break;
            case 'url':
                module = await this.loadModuleFromURL(source);
                break;
            default:
                throw new Error(`Unsupported module type: ${type}`);
        }

        this.moduleCache.set(source, module);
        return module;
    }

    async loadModuleFromPath(moduleName) {
        logger.log(`ModuleLoader.loadModuleFromPath(moduleName), moduleName = ${moduleName}`)
        logger.log('this.classpaths = ' + this.classpaths)
        for (const path of this.classpaths) {
            logger.log('A')
            logger.log(`ModuleLoader.loadModule, path = : ${path}`);
            //        try {
            logger.debug('process.cwd() = ' + process.cwd())
            const modulePath = join(process.cwd(), path, moduleName) + '.js' // TODO move
            logger.log('B')
            logger.log(`ModuleLoader.loadModule, modulePath = : ${modulePath}`)
            const moduleURL = new URL(`file://${modulePath}`).href
            logger.log('C')
            logger.log(`ModuleLoader.loadModule, moduleURL  = : ${moduleURL}`)

            try {
                await fs.access(modulePath, fs.constants.R_OK);
                logger.log('File is readable');
            } catch (error) {
                logger.error('File permission error:' + error.message);
            }

            logger.log('After access check');
            const fileContent = await fs.readFile(modulePath, 'utf8');
            logger.log('File content:' + fileContent);

            //            const fileContent = await fs.readFile(modulePath, 'utf8');
            logger.log('File starts with:' + fileContent.slice(0, 100));
            logger.log('File contains "export":' + fileContent.includes('export'));

            const relativePath = path.relative(process.cwd(), modulePath);
            require(relativePath);
            logger.log('ESM mode:' + process.execArgv.includes('--experimental-modules'));
            try {
                require(modulePath);
                logger.log('Module can be required successfully');
            } catch (error) {
                logger.error('Require error:' + error);
                logger.error('Require error name:' + error.name);
                logger.error('Require error message:' + error.message);
                logger.error('Require error stack:' + error.stack);
            }
            logger.log('After require attempt');
            try {
                const module = await import(moduleURL);
                logger.log('Module imported successfully:' + module);
            } catch (error) {
                logger.error('Error importing module:' + error.message);
                logger.error('Stack trace:' + error.stack);
            }
            logger.log('After import attempt');

            logger.log('ModuleLoader.loadModule, module = ')
            logger.reveal(module)
            logger.log(`ES Module ${moduleName} loaded from ${path} and cached`);
            //    process.exit()
            return module;
            //      } catch (error) {
            //        if (error.code !== 'ERR_MODULE_NOT_FOUND') {
            //          throw error;
            //    }
        }
        //}
        //  throw new Error(`Module ${moduleName} not found in provided classpaths`);
    }

    async loadModuleFromString(moduleString) {
        logger.log(`ModuleLoader.loadModuleFromString()`)
        const blob = new Blob([moduleString], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        try {
            return await import(url);
        } finally {
            URL.revokeObjectURL(url);
        }
    }

    async loadModuleFromURL(url) {
        logger.log(`ModuleLoader.loadModuleFromURL(url), url = ${url}`)
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch module from ${url}: ${response.statusText}`);
        }
        const moduleString = await response.text();
        return this.loadModuleFromString(moduleString);
    }

    /*
    loadCJSModule(moduleName) {
        if (this.moduleCache.has(moduleName)) {
            logger.log(`Module ${moduleName} loaded from cache`);
            return this.moduleCache.get(moduleName);
        }

        for (const path of this.classpaths) {
            const require = createRequire(join(path, 'dummy.js'));
            try {
                const module = require(`./${moduleName}`);
                this.moduleCache.set(moduleName, module);
                logger.log(`Module ${moduleName} loaded from ${path} and cached`);
                return module;
            } catch (error) {
                if (error.code !== 'MODULE_NOT_FOUND') {
                    throw error;
                }
                // Module not found in this path, continue to next
            }
        }
        throw new Error(`Module ${moduleName} not found in provided classpaths`);
    }
*/
}