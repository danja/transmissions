# Processor Settings

I got in a real mess due to inconsistencies in the way data from an application's `config.ttl` was being addressed.

The first version did this kind of thing :

```turtle
### transmissions.ttl

:s1 a :Something ;
    trm:configKey :moverKey .

### config.ttl

t:mover a trm:ServiceConfig ;
    trm:key t:moverKey ;
    trm:source "data/start/one.txt" ;
    trm:destination "data/single-empty/one.txt" .    
```

I soon realised that there was an obvious, simpler, better approach (I've no idea why I didn't choose it first). Drop the indirection, refer to the `t:mover` node directly.
But the above worked well enough that the change got left undone. A broken #:postcraft application is a good prompt to sort it out.

There's another hack in there I can fix at the same time : representing (relative) fs paths as strings. RDF is all about resources, those bits of data deserve ~~URIs~~IRIs. There are several alternate ways of expressing them according to the [Turtle spec](https://www.w3.org/TR/turtle/#sec-iri).

*Related, at some point I'm likely to want to treat those Turtle files as named graphs in a global scope. I'll cross that bridge when I come to it.*

```turtle
# A triple with all absolute IRIs
<http://one.example/subject1> <http://one.example/predicate1> <http://one.example/object1> .

@base <http://one.example/> .
<subject2> <predicate2> <object2> .     # relative IRIs, e.g. http://one.example/subject2
```  

So I'll say anything under `http://purl.org/stuff/path/` can be lifted out to provide a local relative path.

While I'm at it, I have been confusing myself by using 'config' differently in different contexts. Here, I reckon 'settings' is a bit more intuitive.

Ok, now I have :

```turtle
### transmissions.ttl
...
:s1 a :Something ;
    trm:settings :mover .

### config.ttl

@base http://purl.org/stuff/path/ .
...
t:mover a trm:ServiceConfig ;
    trm:source "data/start/one.txt" ;
    trm:destination "data/single-empty/one.txt" .    
```
