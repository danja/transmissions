
import { Injectable } from './Injectable.js';

export class Piper extends Injectable {
  static __inject(container) {
    return new this(
      container.getService('source'),
      container.getService('connector'),
      container.getService('process'),
      container.getService('sink')
    );
  }

  constructor(source, connector, process, sink) {
    super();
    this.source = source;
    this.connector = connector;
    this.process = process;
    this.sink = sink;
  }

  static services = ['source', 'connector', 'process', 'sink']
  run(inputFilePath, outputFilePath) {
    // Setting up the pipeline
    this.connector.connect(this.source, this.process)
    this.connector.connect(this.process, this.sink)

    // Execute the pipeline
    let input = this.source.read(inputFilePath)
    let result = this.connector.executePipeline(this.source, input);
    console.log('Pipeline result:', result)

    // Assuming the sink service handles the writing to output file

  }
}