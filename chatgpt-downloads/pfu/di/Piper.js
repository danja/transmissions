
import { Injectable } from './Injectable.js';

export class Piper extends Injectable {
  static services = ['source', 'connector', 'process', 'sink']
  run(inputFilePath, outputFilePath) {
    this.connector.connect(this.source, this.process)
    this.connector.connect(this.process, this.sink)
    let input = this.source.read(inputFilePath)
    let output = this.process.process(input)
    this.sink.write(outputFilePath, output)
  }
}
