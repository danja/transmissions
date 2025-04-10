import rdfExt from 'rdf-ext'

class SimpleEventEmitter {
  constructor() {
    this.listeners = {}
  }

  on(event, listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(listener)
    return this
  }

  emit(event, ...args) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => listener(...args))
    }
    return this
  }
}

class BrowserDataset {
  constructor(quads) {
    this.quads = quads || []
    this.size = this.quads.length
  }

  add(quad) {
    this.quads.push(quad)
    this.size++
    return this
  }

  addAll(dataset) {
    if (dataset && dataset.quads) {
      this.quads = this.quads.concat(dataset.quads)
      this.size = this.quads.length
    }
    return this
  }

  import(stream) {
    let result = this

    return {
      on(event, callback) {
        if (event === 'data') {
          const data = stream.toString()
          callback(data)
        }
        if (event === 'end') {
          callback()
        }
        return this
      }
    }
  }

  toStream() {
    const quads = this.quads
    return {
      on(event, callback) {
        if (event === 'data') {
          for (const quad of quads) {
            callback(quad)
          }
        }
        if (event === 'end') {
          callback()
        }
        return this
      }
    }
  }

  match(subject, predicate, object, graph) {
    const matches = []
    for (const quad of this.quads) {
      if ((!subject || quad.subject.equals(subject)) &&
        (!predicate || quad.predicate.equals(predicate)) &&
        (!object || quad.object.equals(object)) &&
        (!graph || quad.graph.equals(graph))) {
        matches.push(quad)
      }
    }
    return new BrowserDataset(matches)
  }
}

function parseTurtleString(turtleString) {
  const dataset = new BrowserDataset()

  const statements = turtleString.split('.\n')

  const prefixes = {}
  statements.forEach(stmt => {
    const prefixMatch = stmt.match(/@prefix\s+([^:]+):\s+<([^>]+)>\s*\./)
    if (prefixMatch) {
      prefixes[prefixMatch[1]] = prefixMatch[2]
    }
  })

  prefixes['rdf'] = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
  prefixes[''] = 'http://purl.org/stuff/transmissions/'

  statements.forEach(stmt => {
    if (stmt.trim().startsWith('#') || !stmt.trim()) return
    if (stmt.trim().startsWith('@prefix')) return

    let parts = stmt.trim().split(/\s+/, 3)
    if (parts.length === 3) {
      try {
        const subjectNode = resolveNode(parts[0], prefixes)
        const predicateNode = resolveNode(parts[1], prefixes)
        const objectNode = resolveNode(parts[2], prefixes)

        if (subjectNode && predicateNode && objectNode) {
          dataset.add(rdfExt.quad(subjectNode, predicateNode, objectNode))
        }
      } catch (e) {
        console.error("Error parsing triple:", e)
      }
    }
  })

  return dataset
}

function resolveNode(term, prefixes) {
  term = term.trim()

  if (term.startsWith('<') && term.endsWith('>')) {
    return rdfExt.namedNode(term.slice(1, -1))
  }

  if (term.includes(':')) {
    const [prefix, local] = term.split(':')
    if (prefix in prefixes) {
      return rdfExt.namedNode(prefixes[prefix] + local)
    }
  }

  if (term.startsWith(':')) {
    return rdfExt.namedNode('http://purl.org/stuff/transmissions/' + term.slice(1))
  }

  if (term.startsWith('"') && term.endsWith('"')) {
    return rdfExt.literal(term.slice(1, -1))
  }

  return rdfExt.namedNode('http://purl.org/stuff/transmissions/' + term)
}

const rdfExtBrowser = {
  ...rdfExt,

  async parseTurtle(turtleString) {
    try {
      console.log("Parsing Turtle string:", turtleString.substring(0, 100) + "...")
      return parseTurtleString(turtleString)
    } catch (error) {
      console.error('Error parsing Turtle:', error)
      throw error
    }
  },

  dataset(quads) {
    return new BrowserDataset(quads || [])
  }
}

Object.keys(rdfExt).forEach(key => {
  if (typeof rdfExt[key] === 'function' && !rdfExtBrowser[key]) {
    rdfExtBrowser[key] = rdfExt[key].bind(rdfExt)
  }
})

export default rdfExtBrowser