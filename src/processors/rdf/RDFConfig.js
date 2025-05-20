// src/processors/rdf/RDFConfig.js

import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

/**
 * @class RDFConfig
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Extracts and maps configuration data from RDF datasets into structured message fields for further processing.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * None specific (may use config for mapping rules or vocabularies)
 *
 * #### __*Input*__
 * * **`message.dataset`** - The RDF dataset to extract configuration from (required)
 *
 * #### __*Output*__
 * * **`message`** - The message object with extracted configuration mappings
 *
 * #### __*Behavior*__
 * * Parses RDF dataset for configuration groups and property mappings
 * * Maps RDF properties to message fields using ConfigGroup logic
 * * Throws error if no dataset is provided
 * * Emits enriched message for downstream processors
 *
 * #### __*Side Effects*__
 * * None (operates in-memory)
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Add support for custom mapping vocabularies
 * * Improve error handling and validation
 */

class RDFConfig extends Processor {
  constructor(config) {
    super(config)
    this.configMap = new Map()
  }

  async process(message) {
    if (!message.dataset) {
      throw new Error('No RDF dataset provided')
    }

    const dataset = message.dataset
    const poi = grapoi({ dataset })

    // Find all ConfigGroup instances
    for (const configGroup of poi.out(ns.rdf.type, ns.trn.ConfigGroup).terms) {
      const groupPoi = grapoi({ dataset, term: configGroup })

      // Extract property mappings
      const mappings = {}
      for (const quad of groupPoi.quads()) {
        if (!quad.predicate.equals(ns.rdf.type)) {
          mappings[quad.predicate.value] = this.resolveValue(quad.object)
        }
      }

      this.configMap.set(configGroup.value, mappings)
      message.configMap = this.configMap
    }

    // Apply configuration patterns
    if (message.configPatterns) {
      for (const pattern of message.configPatterns) {
        const config = this.configMap.get(pattern)
        if (config) {
          Object.assign(message, config)
        }
      }
    }

    return this.emit('message', message)
  }

  resolveValue(term) {
    // Handle different RDF term types
    if (term.termType === 'NamedNode') {
      return term.value
    } else if (term.termType === 'Literal') {
      const value = term.value
      // Convert numeric literals
      return isNaN(value) ? value : Number(value)
    }
    return term.value
  }

  getConfig(groupId) {
    return this.configMap.get(groupId)
  }
}

export default RDFConfig