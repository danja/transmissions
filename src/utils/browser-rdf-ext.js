/**
 * Browser-compatible wrapper for rdf-ext
 * Provides consistent API for both browser and Node environments
 */

import rdfExt from 'rdf-ext';
import N3Parser from '@rdfjs/parser-n3';
import stringToStream from 'string-to-stream';

// Create properly configured parser that works in browser
const turtleParser = new N3Parser({
  factory: rdfExt,
  format: 'text/turtle'
});

// Extend rdf-ext with browser-compatible methods
const rdfExtBrowser = {
  ...rdfExt,
  
  // Parse Turtle string to dataset
  async parseTurtle(turtleString) {
    try {
      const stream = stringToStream(turtleString);
      const dataset = rdfExt.dataset();
      const quadStream = turtleParser.import(stream);
      
      return new Promise((resolve, reject) => {
        dataset.import(quadStream)
          .on('end', () => resolve(dataset))
          .on('error', reject);
      });
    } catch (error) {
      console.error('Error parsing Turtle:', error);
      throw error;
    }
  },
  
  // Create a named node
  namedNode(value) {
    return rdfExt.namedNode(value);
  },
  
  // Create a blank node
  blankNode(value) {
    return rdfExt.blankNode(value);
  },
  
  // Create a literal
  literal(value, language, datatype) {
    return rdfExt.literal(value, language, datatype);
  },
  
  // Create a quad
  quad(subject, predicate, object, graph) {
    return rdfExt.quad(subject, predicate, object, graph);
  },
  
  // Create a dataset
  dataset(quads) {
    return rdfExt.dataset(quads);
  }
};

export default rdfExtBrowser;