`src/applications/sparqlstore-to-html/about.md`

# sparqlstore-to-html

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans sparqlstore-to-html
```

./trans md-to-sparqlstore

## Description

First pass :

Query SPARQL store for a list of schema:Article

---

```sparql
PREFIX schema: <http://schema.org/>

SELECT ?subject ?predicate ?object
WHERE {
  ?subject a schema:Article .
}
LIMIT 25
```
