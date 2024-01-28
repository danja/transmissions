import { Injectable } from './Injectable.js';

export class Piper extends Injectable {
  static services = ['source', 'connector', 'process', 'sink']
  run() {
    this.connector.connect(source, process)
    this.connector.connect(process, sink)
    let input = this.source.read('test.txt')
    let output = this.process.process(input)
    this.sink.write('./output.txt', output)
  }
}

