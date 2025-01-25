# SPARQL Processors

```turtle
@prefix schema: <http://schema.org/> .

<http://example.com/posts-one> a schema:BlogPosting ;
    schema:headline "Post one" ;  # Equivalent to Atom <title>
    schema:url <http://example.com/posts-one> ;  # Equivalent to Atom <link>
    schema:description "Post one content." ;  # Equivalent to Atom <summary> or <content>
    schema:datePublished "2023-05-22T13:00:00Z"^^xsd:dateTime ;  # Equivalent to Atom <published>
    schema:dateModified "2023-05-22T15:00:00Z"^^xsd:dateTime ;  # Equivalent to Atom <updated>
    schema:author [
        a schema:Person ;
        schema:name "John Doe" ;  # Equivalent to Atom <author><name>
        schema:email "johndoe@example.com"  # Optional, similar to Atom <author><email>
    ] .
```

Source code located in `src/processors/sparql`

right after each DirWalker, the file data should be pushed to SPARQL store

#:um

1. state the problem
2. write the requirements
3. provide the contextual knowledge
4. provide any conventions

highlight unknowns

---
found dumped in an about.md -
- Goal : a tool to recursively read local filesystem directories, checking for files with the `.md` extension to identify collections of such
- Goal : documentation of the app creation process
- Implementation : a #Transmissions application
- SoftGoal : reusability
- _non-goal_ - efficiency
