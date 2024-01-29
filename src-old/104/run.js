
import { NodeInjector } from './di/NodeInjector.js'
import simplepipe from './simplepipe.json' assert { type: 'json' };

const di = new NodeInjector(simplepipe.pipe)

import { SimplePipe } from './transmissions/SimplePipe.js'
const app = di.make(SimplePipe)

const inputFilePath = './input.txt';
const outputFilePath = './output.txt';

app.run(inputFilePath, outputFilePath);
/*
(async () => {
    const result = await app.runTransmission();
    console.log('Transmission result:', result);
})();
*/