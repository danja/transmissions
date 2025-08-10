`src/apps/md-to-sparqlstore/about.md`

# Application 'md-to-sparqlstore'

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans md-to-store -m '{"eventType":"change","filename":"2025-08-09_watch.md","sourcePath":"/home/danny/sites/danny.ayers.name/postcraft/content/raw/entries/2025-08-09_watch.md","watchDir":"/home/danny/sites/danny.ayers.name/postcraft/content/raw/entries","timestamp":"2025-08-10T07:13:46.470Z"}' /home/danny/sites/danny.ayers.name/postcraft
```

## Description

1. Reads a file from fs
2. Templates it using nunjucks into a SPARQL UPDATE query
3. POSTs this to the specified endpoint
4. Does a SPARQL SELECT query (based on date) to retrieve data
5. Compares this with the original content to ensure it is in the store

Data looks something like :

```turtle
@prefix schema: <http://schema.org/> .

<http://example.com/posts-one> a schema:BlogPosting ;
    schema:headline "Post one" ;
    schema:url <http://example.com/posts-one> ;
    schema:description "Post one content." ;
    schema:datePublished "2023-05-22T13:00:00Z"^^xsd:dateTime ;
    schema:dateModified "2023-05-22T15:00:00Z"^^xsd:dateTime ;
    schema:author [
        a schema:Person ;
        schema:name "John Doe" ;
        schema:email "johndoe@example.com"
    ] .
```

## Notes

TODO complete -

src/apps/test_file-to-sparqlstore
├── about.md
├── config.ttl
├── data
│   ├── input
│   │   └── input.md
│   └── output
├── diamonds
│   ├── select-blogposting.njk
│   └── update-blogposting.njk
├── endpoint.json
└── transmissions.ttl

src/processors/sparql
├── about.md
├── SPARQLProcessorsFactory.js
├── SPARQLSelect.js
└── SPARQLUpdate.js
