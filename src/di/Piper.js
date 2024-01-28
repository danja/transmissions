
import { Injectable } from './Injectable.js';

export class Piper extends Injectable {
  static services = ['source', 'connector', 'process', 'sink']
  run(inputFilePath, outputFilePath) {
    // Setting up the pipeline
    this.connector.connect(this.source, this.process)
    this.connector.connect(this.process, this.sink)

    // Execute the pipeline
    let input = this.source.read(inputFilePath)
    this.connector.executePipeline(this.source, input)

    // Assuming the sink service handles the writing to output file
  }
}
