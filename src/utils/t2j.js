/*
* Turtle to JSON-LD converter
*/

import { Readable } from 'readable-stream'
import rdf from '@rdfjs/data-model'
import SerializerJsonld from '@rdfjs/serializer-jsonld'
import Serializer from '@rdfjs/serializer-turtle'
import N3Parser from '@rdfjs/parser-n3'
import { fromFile } from 'rdf-utils-fs'
import { toFile } from 'rdf-utils-fs'

const testTurtle = `
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix trm: <http://purl.org/stuff/transmission/> .
@prefix : <https://hyperdata.it/treadmill/> . # for custom terms & instances

:simplepipe a trm:PipelineTransmission ;
    trm:pipe (:s1 :s2 :s3) .

:s1 a trm:StringSource .
:s2 a trm:AppendProcess .
:s3 a trm:StringSink .
`
export class Turtle2JSONLD {
    static async convert(turtle) {
        // create N3 parser instance
        let parser = new N3Parser({ factory: rdf })
        //   const stream = Turtle2JSONLD.stringToStream(turtle)
        //  let quadStream = parser.import(stream)

        const input = Readable.from(turtle)

        const output = parser.import(input)

        const serializerJsonld = new SerializerJsonld()
        const jsonStream = serializerJsonld.import(output)

        //      let outputJson = ''

        //            outputJson = outputJson + JSON.stringify(jsonld, null, 2)
        //    })
        const outputJson = await Turtle2JSONLD.streamToString(jsonStream)
        return outputJson
    }

    static stringToStream(str) {
        const stream = new Readable();
        stream.push(str); // Add the string to the stream
        stream.push(null); // Indicates that the stream has ended
        return stream;
    }

    static streamToString(stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => {
                chunks.push(Buffer.from(chunk))
                console.log('chunk:', chunk)
            }
            );
            stream.on('error', (err) => reject(err));
            stream.on('end', () => {
                const result = Buffer.concat(chunks).toString('utf8')
                resolve(result)
                console.log('****************** result:', result)
            });
        })
    }
}

// Convert a string to a stream

const testJson = await Turtle2JSONLD.convert(testTurtle)
console.log('àààààààààààààààààààààà')
console.log(testJson)

