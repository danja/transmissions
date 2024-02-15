npm install --save readable-stream
npm install --save @rdfjs/data-model
npm install --save @rdfjs/serializer-turtle
npm install --save @rdfjs/serializer-jsonld

**no!** npm install --save rdf-parser-n3

npm WARN deprecated rdf-parser-n3@1.1.1: This package is deprecated and got replaced by @rdfjs/parser-n3
npm WARN deprecated rdf-sink@1.0.1: This package is deprecated and got replaced by @rdfjs/sink
npm WARN deprecated rdf-data-model@1.0.0: This package is deprecated and got replaced by @rdfjs/data-model

npm install --save @rdfjs/sink
npm install --save @rdfjs/parser-n3

npm install --save rdf-utils-fs

### rdf-utils-fs

fromFile(filename, options)
Returns a quad stream for the given filename.

async toFile(stream, filename, options)
Writes the given quad stream to filename.
