`src/apps/link-finder/about.md`

# Example Application `about.md`

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans link-finder
```

## Description

Inserts bookmark statements into a named graph for a given target URL that looks like this :

```turtle
@prefix bm: <http://purl.org/stuff/bm/> .

  <http://purl.org/stuff/instance/eprxly1u> a bm:Bookmark ;
        bm:target <https://tensegrity.it/> ;
        bm:agent <http://purl.org/stuff/agent/transmissions> ;
        bm:created "2025-09-28" ;
        bm:title "Tensegrity" ;
        bm:status "404"^^xsd:integer .
```
Templating is in place to insert the bookmark URI.
If no entry exists for the bm:target, then this new one is created. Otherwise the existing statement block is updated, so :

```turtle
@prefix bm: <http://purl.org/stuff/bm/> .

  <http://purl.org/stuff/instance/eprxly1u> a bm:Bookmark ;
        bm:target <https://tensegrity.it/> ;
        bm:agent <http://purl.org/stuff/agent/transmissions> ;
        bm:created "2025-09-29" ;
        bm:title "Tensegrity" ;
        bm:status "200"^^xsd:integer .
```

--
PREFIX : <http://purl.org/stuff/transmissions/>
PREFIX bm: <http://purl.org/stuff/bm/>

INSERT DATA {
      GRAPH <{{graph}}> {
  <http://purl.org/stuff/instance/eprxly1u> a bm:Bookmark ;
        bm:target <https://tensegrity.it/> ;
        bm:agent <http://purl.org/stuff/agent/transmissions> ;
        bm:created "2025-09-28" ;
        bm:title "Tensegrity" ;
        bm:status "404"^^xsd:integer .
}
}
