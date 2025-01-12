import logger from "../../utils/Logger.js";
import ns from "../../utils/ns.js";

import ProcessorTemplate from "./XmppClient.js";

// ref needed in transmissions/src/processors/base/AbstractProcessorFactory.js

class XmppProcessorsFactory {
  static createProcessor(type, config) {
    if (type.equals(ns.trn.XmppClient)) {
      return new XmppClient(config)
    }
    return false
  }
}
export default XmppProcessorsFactory
