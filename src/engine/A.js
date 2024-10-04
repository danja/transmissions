// A.js
import { ModuleLoader } from './ModuleLoader.js';

// Assume this array comes from parsing command line arguments
const cp = ['/over/there/', '/over/here/'];

async function main() {
    const loader = new ModuleLoader(cp);

    try {
        // Load B as a CommonJS module
        const moduleB = loader.loadModule('B');

        // Load C as an ES module
        const moduleC = await loader.loadESModule('C');

        // Use the loaded modules
        moduleB.someFunction();
        moduleC.anotherFunction();

        // Try to load B again - it will be loaded from cache
        const moduleBAgain = loader.loadModule('B');

        console.log(moduleB === moduleBAgain);  // true
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();