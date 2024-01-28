
// Import the modified DependencyInjector
import { DependencyInjector } from './di/DependencyInjectorDeclarative.js'

// Pipeline configuration
const simplepipe = [
    "source",
    "process",
    "sink",
]

// Service definitions
const serviceDefinitions = {
    source: StringSource,
    connector: Connector,
    sink: StringSink,
    process: AppendProcess,
}

const di = new DependencyInjector(simplepipe, serviceDefinitions)

import { Piper } from './di/Piper.js'
// Create the instance of our application using the DI to inject services
const app = di.make(Piper) // Has access to the service

// Example file paths (these can be changed as needed)
const inputFilePath = './input.txt';
const outputFilePath = './output.txt';

// Running the pipeline
app.run(inputFilePath, outputFilePath);
