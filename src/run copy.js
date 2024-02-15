import logger from './utils/Logger.js'
import { Reveal } from './utils/Reveal.js'

import { Injector } from './mill/Injector.js'


import simplepipe from './simplepipe.json' assert { type: 'json' };
import { Transmission } from './mill/Transmission.js';
import { Executor } from './mill/Executor.js';
logger.setLogLevel("debug")
logger.log("Hello, logger!")

const inputFilePath = './input.txt';
const outputFilePath = './output.txt';

// const injector = new Injector(simplepipe.pipe)

const simplePipe = new Transmission(simplepipe.pipe)

logger.log("AAA simplePipe : " + Reveal.asMarkdown(simplePipe))

//const app = injector.inject(SimplePipe)
simplePipe.build()

logger.log("BBB simplePipe : " + Reveal.asMarkdown(simplePipe))

const executor = new Executor(simplePipe)

executor.execute()

// app.run(inputFilePath, outputFilePath);
/*
(async () => {
    const result = await app.runTransmission();
    console.log('Transmission result:', result);
})();
*/