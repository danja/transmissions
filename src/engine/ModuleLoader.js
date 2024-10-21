import { createRequire } from 'module';
import { join } from 'path';
import logger from '../utils/Logger.js';

export class ModuleLoader {
    constructor(classpath) {
        this.classpath = classpath;
        this.moduleCache = new Map();
    }

    async loadModule(moduleName) {
        logger.debug(`ModuleLoader, checking cache for ${moduleName}`);

        if (this.moduleCache.has(moduleName)) {
            return this.moduleCache.get(moduleName);
        }

        for (const path of this.classpath) {
            try {
                moduleName = moduleName + ".js"
                const modulePath = join(process.cwd(), path, moduleName);
                logger.debug(`Attempting to load module from: ${modulePath}`);
                const module = await import(modulePath);
                this.moduleCache.set(moduleName, module);
                logger.debug(`Module ${moduleName} loaded and cached`);
                return module;
            } catch (error) {
                if (error.code !== 'MODULE_NOT_FOUND') {
                    logger.error(`Error loading module ${moduleName}: ${error.message}`);
                }
            }
        }
        throw new Error(`Module ${moduleName} not found in provided classpath`);
    }
}