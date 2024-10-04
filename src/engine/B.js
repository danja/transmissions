// B.js
import { ModuleLoader } from './ModuleLoader.js';

// B.js might have a different classpath
const cp = ['/some/other/path/', '/over/here/'];

async function someFunction() {
    const loader = new ModuleLoader(cp);

    try {
        // Load D as a CommonJS module
        const moduleD = loader.loadModule('D');

        // Load E as an ES module
        const moduleE = await loader.loadESModule('E');

        // Use the loaded modules
        moduleD.doSomething();
        moduleE.doSomethingElse();
    } catch (error) {
        console.error('Error in B.js:', error.message);
    }
}

export { someFunction };