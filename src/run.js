import logger from './utils/Logger.js'
import { Reveal } from './utils/Reveal.js'

import { NodeInjector } from './di/NodeInjector.js'
import { SimplePipe } from './transmissions/SimplePipe.js'

import simplepipe from './simplepipe.json' assert { type: 'json' };

logger.setLogLevel("debug")
logger.log("Hello, logger!")

const inputFilePath = './input.txt';
const outputFilePath = './output.txt';

const injector = new NodeInjector(simplepipe.pipe)

logger.log("injector : " + Reveal.asMarkdown(injector))

const app = injector.make(SimplePipe)

logger.log("app : " + Reveal.asMarkdown(app))


app.run(inputFilePath, outputFilePath);
/*
(async () => {
    const result = await app.runTransmission();
    console.log('Transmission result:', result);
})();
*/