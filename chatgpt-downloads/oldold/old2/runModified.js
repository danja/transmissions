
// Import the modified DependencyInjector
import { DependencyInjector } from './di/DependencyInjectorModified.js'

const simplepipe = [
    "source",
    "process",
    "sink",
]

const di = new DependencyInjector(simplepipe)

import { Piper } from './di/Piper.js'
// Create the instance of our application using the DI to inject services
const app = di.make(Piper) // Has access to the service

// Example file paths (these can be changed as needed)
const inputFilePath = './input.txt';
const outputFilePath = './output.txt';

// Running the pipeline
const result = app.runPipeline();
console.log('Pipeline result:', result);
