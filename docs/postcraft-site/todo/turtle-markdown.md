# Markdown Extensions

_Original title Turtle Markdown Extensions_

##

---

## Earlier

A bit of forward-planning for blog engine stuff. This went on my todo list the other day, since then I've had a think, thought I'd better get it down before I forget.

**How to express RDF statements in Markdown?**

#### Uses Cases

1. make statements about the md doc
2. extract a block of arbitrary Turtle from md doc

#### General Requirements

0. simple to use, simple to implement
1. independent of, but compatible with existing markdown tools
2. extensible, reasonably modular
3. block identifier & delimiters
4. useful defaults, easily overriden

_Note re. (2) : the markup syntax used will be interpreted as a processing instruction, so while Turtle creation/extraction is the immediate goal, it makes sense for extensibility to consider other possible uses._

### 0. General Syntax

\` :term fur\`

\`\`\` :term fur\`\`\`

TODO express in [BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form)
TODO provide regexes

### 1. Statements about Current Markdown Document

\` :tag fur\`

- the URL of the current document (or a derived version in a format like HTML) will be the subject of the triple
- the string `:tag` will be interpreted as the term `tag` from the namespace `http://purl.org/stuff/mx/` and used as the property of the triple
- the string `fur` will be used as the literal object of the triple

TODO result

In this example `fur` is one word, a simple string delimited by spaces. Alternatives will include quoting of literals `"as in Turtle"` for the object as well as the use of URIs using standard Turtle syntax.

TODO longer example

#### Useful Terms

- mx:x - extract, as above
- mx:a - rdf:type
- mx:cat - category
- mx:tag
- mx:tags

TODO fill out as needed, find standard vocab equivalents

### 2. Arbitrary Turtle in Markdown Document

Where a block of Turtle should be extracted, the term `mx:x` should be used, e.g.

**\`\`\`:x**
@base <http://example.org/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix rel: <http://www.perceive.net/schemas/relationship/> .

<#green-goblin>
rel:enemyOf <#spiderman> ;
a foaf:Person ; # in the context of the Marvel universe
foaf:name "Green Goblin" .
**\`\`\`**

### 3. Interpretation Rules

TODO

for eg. mx:tags - provide a simple list syntax

Terms MAY be interpreted as those in the mx namespace and/or well-known equivalents

How to say what should be passed to standard markdown processor, what should be cut?

## Implementation Notes

- Processing should occur before standard markdown processing.
- Processing will return a dictionary (or equiv).

eg. :

```
contents = mx(markdown_with_extensions)

markdown = contents['markdown']
turtle = contents['turtle']

html = to_html(markdown)
store.add(turtle)
```
