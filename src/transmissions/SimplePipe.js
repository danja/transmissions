
import logger from '../utils/Logger.js'
import { Injectable } from '../di/Injectable.js';
import { Transmission } from '../di/Transmission.js';
import { Connector } from '../services/Connector.js';

export class SimplePipe extends Injectable {
  static __inject(container) {
    logger.log("SimplePipe.__inject")
    //     container.getService('Connector'),
    return new this(
      container.getService('StringSource'),

      container.getService('AppendProcess'),
      container.getService('StringSink')
    );
  }

  constructor(source, connector, process, sink) {
    super();
    this.source = source;
    this.connector = new Connector();
    this.process = process;
    this.sink = sink;
  }

  static services = ['source', 'connector', 'process', 'sink']

  run(inputFilePath, outputFilePath) {
    logger.log("SimplePipe.run : " + inputFilePath + " to " + outputFilePath)
    // Setting up the transmission
    this.connector.connect(this.source, this.process)
    this.connector.connect(this.process, this.sink)

    // Execute the transmission
    let input = this.source.read(inputFilePath)
    let result = this.connector.executeTransmission(this.source, input);
    console.log('Transmission result:', result)

    // Assuming the sink service handles the writing to output file

  }
}