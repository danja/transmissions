
import { DependencyInjector } from './di/DependencyInjector.js'
import simplepipe from './simplepipe.json' assert { type: 'json' };

const di = new DependencyInjector(simplepipe.pipe)

import { Piper } from './di/Piper.js'
const app = di.make(Piper)

const inputFilePath = './input.txt';
const outputFilePath = './output.txt';

app.run(inputFilePath, outputFilePath);
/*
(async () => {
    const result = await app.runPipeline();
    console.log('Pipeline result:', result);
})();
*/