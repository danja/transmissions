

import logger from './utils/Logger.js'
import { Reveal } from './utils/Reveal.js'

import { Injector } from './mill/Injector.js'


// import simplepipe from './simplepipe.json' assert { type: 'json' };
import { Transmission } from './mill/Transmission.js';
import { TransmissionBuilder } from './mill/TransmissionBuilder.js'
// import { Executor } from './mill/Executor.js';
logger.setLogLevel("debug")
logger.log("Hello, logger!")

const transmissionFile = 'transmissions/string-pipe.ttl'

// const inputFilePath = './input.txt';
// const outputFilePath = './output.txt';

const stringPipe = TransmissionBuilder.build(transmissionFile)

// logger.log("AAA simplePipe : " + Reveal.asMarkdown(simplePipe))

//const app = injector.inject(SimplePipe)simplePipe.build()

// logger.log("BBB simplePipe : " + Reveal.asMarkdown(simplePipe))

// stringPipe.execute(simplePipe)



// app.run(inputFilePath, outputFilePath);
/*
(async () => {
    const result = await app.runTransmission();
    console.log('Transmission result:', result);
})();
*/