# Refactorings

* Vocabs

## Core

#:todo trm:ServiceConfig stuff, generalise


## Vocabs

```turtle
:s40 a :Restructure ;
    trm:configKey :walkPrep .

...

t:walkPrep a trm:ReMap ;
    trm:rename (t:pp1 t:pp2) . # consider using blank nodes
    t:pp1   trm:pre     "content" ;
            trm:post    "template"  .
    t:pp2   trm:pre     "entryContentMeta.sourceDir" ;
            trm:post    "sourceDir" .
```

ReMap is arbitrary. configKey used differently


#:todo rationalise
#:todo make vocab
#:todo document


## Debugging

### Repeated run log :
```
+ ***** Execute Transmission :  <http://hyperdata.it/transmissions/cjc>
| Running : http://hyperdata.it/transmissions/walk_convs a JSONWalker
| Running :  (walk_convs) uf_convs a Unfork
| Running :  (walk_convs) uf_convs a Unfork
```

Check for, replace with ...
