// src/utils/browser-rdf-ext.js
import rdfExt from 'rdf-ext'
import N3Parser from '@rdfjs/parser-n3'
import stringToStream from 'string-to-stream'

class SerializerTurtle {
  constructor() {
    this.contentType = 'text/turtle'
  }

  import(stream) {
    let output = ''

    return {
      on: (event, callback) => {
        if (event === 'data') {
          stream.on('data', (quad) => {
            output += this.quadToTurtle(quad) + '\n'
            callback(this.quadToTurtle(quad) + '\n')
          })
        }
        if (event === 'end') {
          stream.on('end', () => {
            callback()
          })
        }
        return this
      }
    }
  }

  quadToTurtle(quad) {
    const subject = this.termToTurtle(quad.subject)
    const predicate = this.termToTurtle(quad.predicate)
    const object = this.termToTurtle(quad.object)

    return `${subject} ${predicate} ${object} .`
  }

  termToTurtle(term) {
    if (term.termType === 'NamedNode') {
      return `<${term.value}>`
    } else if (term.termType === 'BlankNode') {
      return `_:${term.value}`
    } else if (term.termType === 'Literal') {
      let result = `"${term.value.replace(/"/g, '\\"')}"`
      if (term.language) {
        result += `@${term.language}`
      } else if (term.datatype && !term.datatype.value.endsWith('string')) {
        result += `^^<${term.datatype.value}>`
      }
      return result
    }
    return term.value
  }
}

class SerializerJsonld {
  import(stream) {
    // Simple implementation
    const quads = []

    return {
      on: (event, callback) => {
        if (event === 'data') {
          stream.on('data', (quad) => {
            quads.push(quad)
          })
        }
        if (event === 'end') {
          stream.on('end', () => {
            // Very simplified conversion to JSON-LD
            const jsonld = {
              '@context': {
                'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
                'xsd': 'http://www.w3.org/2001/XMLSchema#',
                'trn': 'http://purl.org/stuff/transmissions/'
              },
              '@graph': []
            }

            // Group by subject
            const subjects = {}
            for (const quad of quads) {
              const subjectId = quad.subject.value
              if (!subjects[subjectId]) {
                subjects[subjectId] = {
                  '@id': subjectId
                }
              }

              const predicateShort = quad.predicate.value
              const objectValue = this.getObjectValue(quad.object)

              if (!subjects[subjectId][predicateShort]) {
                subjects[subjectId][predicateShort] = objectValue
              } else if (Array.isArray(subjects[subjectId][predicateShort])) {
                subjects[subjectId][predicateShort].push(objectValue)
              } else {
                subjects[subjectId][predicateShort] = [
                  subjects[subjectId][predicateShort],
                  objectValue
                ]
              }
            }

            jsonld['@graph'] = Object.values(subjects)
            callback(JSON.stringify(jsonld, null, 2))
          })
        }
        return this
      }
    }
  }

  getObjectValue(object) {
    if (object.termType === 'NamedNode') {
      return { '@id': object.value }
    } else if (object.termType === 'BlankNode') {
      return { '@id': `_:${object.value}` }
    } else if (object.termType === 'Literal') {
      const value = { '@value': object.value }
      if (object.language) {
        value['@language'] = object.language
      } else if (object.datatype && !object.datatype.value.endsWith('string')) {
        value['@type'] = object.datatype.value
      }
      return value
    }
    return object.value
  }
}

// Configure the Turtle parser
const turtleParser = new N3Parser({
  factory: rdfExt,
  format: 'text/turtle'
})

// Extended rdfExt for browser use
const rdfExtBrowser = {
  ...rdfExt,

  // Parse Turtle string to dataset
  async parseTurtle(turtleString) {
    try {
      const stream = stringToStream(turtleString)
      const dataset = rdfExt.dataset()
      const quadStream = turtleParser.import(stream)

      return new Promise((resolve, reject) => {
        let quads = []
        quadStream.on('data', quad => {
          quads.push(quad)
        })

        quadStream.on('end', () => {
          quads.forEach(quad => dataset.add(quad))
          resolve(dataset)
        })

        quadStream.on('error', reject)
      })
    } catch (error) {
      console.error('Error parsing Turtle:', error)
      throw error
    }
  },

  // Term factories
  namedNode(value) {
    return rdfExt.namedNode(value)
  },

  blankNode(value) {
    return rdfExt.blankNode(value)
  },

  literal(value, language, datatype) {
    return rdfExt.literal(value, language, datatype)
  },

  quad(subject, predicate, object, graph) {
    return rdfExt.quad(subject, predicate, object, graph)
  },

  dataset(quads) {
    return rdfExt.dataset(quads)
  },

  // Serializers
  SerializerTurtle,
  SerializerJsonld
}

export default rdfExtBrowser