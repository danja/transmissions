
// Create the dependency injector instance for the application
import { DependencyInjector } from './di/DependencyInjector.js'

const simplepipe = {
    "name": "SimplePipe",
    "pipe": [
        {
            "node": "StringSource",
            "type": "source"
        },
        {
            "node": "AppendProcess",
            "type": "process"
        },
        {
            "node": "StringSink",
            "type": "sink"
        },
    ]
}

const di = new DependencyInjector(simplepipe)

import { Piper } from './di/Piper.js'
// Now, create the instance of our application using the DI to inject services
const app = di.make(Piper) // Has access to the service

// Example file paths (these can be changed as needed)
const inputFilePath = './input.txt';
const outputFilePath = './output.txt';

app.run(inputFilePath, outputFilePath);
