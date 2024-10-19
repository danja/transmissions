// ModuleLoader.js
/*
ModuleLoader.js contains a ModuleLoader class that encapsulates the module loading logic. It provides methods for loading both CommonJS (loadModule) and ES modules (loadESModule).
The ModuleLoader class maintains its own cache, allowing different instances to have separate caches if needed.
A.js and B.js can independently create instances of ModuleLoader with their own classpaths.
The loadESModule method is asynchronous, so it needs to be awaited when used.

This structure allows for more flexibility:

Each file can have its own ModuleLoader instance with a different classpath if needed.
The module loading logic is encapsulated and reusable.
It's easier to maintain and extend the module loading functionality in one place.

Remember to run Node.js with the --experimental-modules flag if you're using an older version of Node.js that doesn't support ES modules by default. Also, you may need to add .js extensions to your import statements depending on your Node.js version and configuration.
*/
import { createRequire } from 'module';
import { join } from 'path';
// import { fileURLToPath } from 'url';
import logger from '../utils/Logger.js'

export class ModuleLoader {
    constructor(classpath) {
        logger.log(`ModuleLoader constructor, classpath = ${classpath}`);
        this.classpath = classpath;
        this.moduleCache = new Map();
    }

    loadCJSModule(moduleName) {
        if (this.moduleCache.has(moduleName)) {
            logger.log(`Module ${moduleName} loaded from cache`);
            return this.moduleCache.get(moduleName);
        }

        for (const path of this.classpath) {
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
        throw new Error(`Module ${moduleName} not found in provided classpath`);
    }

    // from TB const ProcessorClass = this.moduleLoader.loadModule(type.value); // was await

    async loadModule(moduleName) {
        logger.log(`ModuleLoader, checking cache for ${moduleName}`);
        //    process.exit()
        if (this.moduleCache.has(moduleName)) {
            logger.log(`Module ${moduleName} loaded from cache`);
            return this.moduleCache.get(moduleName);
        }

        for (const path of this.classpath) {
            logger.log(`path of this.classpath : ${path}`);
            try {
                const modulePath = new URL(`file://${join(path, moduleName)}.js`).href;
                const module = await import(modulePath);
                this.moduleCache.set(moduleName, module);
                logger.log(`ES Module ${moduleName} loaded from ${path} and cached`);
                return module;
            } catch (error) {
                if (error.code !== 'ERR_MODULE_NOT_FOUND') {
                    throw error;
                }
                // Module not found in this path, continue to next
            }
        }
        throw new Error(`ES Module ${moduleName} not found in provided classpath`);
    }
}