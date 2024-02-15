import logger from '../utils/Logger.js'
import { Reveal } from '../utils/Reveal.js'
import { ServiceFactory } from "./ServiceFactory.js";


/*
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
  */

/*
  constructor(source, connector, process, sink) {
  super();
  this.source = source;
  this.connector = new Connector();
  this.process = process;
  this.sink = sink;
}
*/

export class Transmission {
  constructor() {
    this.services = {}
    this.connectors = {}
    logger.log("Transmission constructor")
  }
}
