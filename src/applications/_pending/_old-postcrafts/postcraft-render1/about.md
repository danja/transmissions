# Postcraft Render 1

walk source dirs for `.md`, render to `.html` in cache

```sh
cd ~/hyperdata/transmissions

./trans postcraft-render1 ../postcraft/test-site

./trans postcraft-render1 ../postcraft/danny.ayers.name
```

```sparql
PREFIX schema: <http://schema.org/>
SELECT ?post ?title ?content ?date ?author WHERE {
  ?post a schema:Article ;
        schema:headline ?title ;
        schema:articleBody ?content ;
        schema:datePublished ?date ;
        schema:author/schema:name ?author .
} ORDER BY DESC(?date)
```
