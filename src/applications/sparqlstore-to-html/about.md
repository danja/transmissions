`src/applications/sparqlstore-to-html/about.md`

# sparqlstore-to-html

~/sites/danny.ayers.name/public

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans sparqlstore-to-html
```

```sh
./trans sparqlstore-to-html -v ~/sites/danny.ayers.name/postcraft
```

## Prerequisites

```sh
sudo systemctl stop tbox
cd ~/hyperdata/tbox # my local dir
docker-compose down
docker-compose up -d
cd ~/hyperdata/transmissions # my local path
./trans md-to-sparqlstore
```

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
