import rdf from 'rdf-ext';
import ns from '../utils/ns.js';
import logger from '../utils/Logger.js';

/**
 * Parses an RDF dataset to extract transmission definitions.
 * @param {Dataset} dataset - The RDF dataset.
 * @returns {Array} - Array of transmission definitions.
 */
export function parseTransmissions(dataset) {
  const transmissions = [];
  const poi = rdf.grapoi({ dataset });

  for (const q of poi.out(ns.rdf.type).quads()) {
    if (q.object.equals(ns.trn.Transmission)) {
      const transmissionID = q.subject;
      const transmission = extractTransmission(dataset, transmissionID);
      transmissions.push(transmission);
    }
  }

  return transmissions;
}

/**
 * Extracts a single transmission definition from the dataset.
 * @param {Dataset} dataset - The RDF dataset.
 * @param {NamedNode} transmissionID - The ID of the transmission.
 * @returns {Object} - The transmission definition.
 */
export function extractTransmission(dataset, transmissionID) {
  const transPoi = rdf.grapoi({ dataset, term: transmissionID });
  const transmission = {
    id: transmissionID.value,
    label: transPoi.out(ns.rdfs.label).value,
    processors: [],
    connections: []
  };

  // Extract processors and connections
  const pipenodes = transPoi.out(ns.trn.pipe).terms;
  for (let i = 0; i < pipenodes.length; i++) {
    const processorID = pipenodes[i].value;
    transmission.processors.push({ id: processorID });

    if (i < pipenodes.length - 1) {
      transmission.connections.push({
        from: pipenodes[i].value,
        to: pipenodes[i + 1].value
      });
    }
  }

  return transmission;
}
