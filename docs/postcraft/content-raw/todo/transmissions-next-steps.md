# Transmissions : Next Steps

https://docs.npmjs.com/cli/v11/configuring-npm/package-json

graphicals

## feature : Docs

Enough for Bergi to be able to review the RDF-Ext bits.

docs - what has Bergi used for syntax highlighting in RDF-Ext?

### feature : Signature standard

Comments, add `src/processors/system/SignatureParser`



### feature : Aux + Describe
property in `transmissions.ttl` like

```turtle
:p a :Processor ;
    :aux :Describe .
```
runs an auxiliary process, first case Describe to log the **Signature** of `:p`

### Misc

tweak DirWalker & ForEach to copy `message.app.datas` along, make an implementation note somewhere

Integration tests based on applications - need a fixture

rename addTag

#:feature types
#:feature inline settings
#:bugfix subtask support
#:feature Node Flow integration

https://elicdavis.github.io/node-flow/
observer pattern - callbacks on Transmission etc.
add Observer superclass?
consider semem integration

1. transmissions editor
2. live interactions

**2025-02-06**

improve reveal()

* terrapacks
* clients
* duckduckgo

* toRDF()

* subtransmissions - test

**2025-02-04**

* remote modules loading again - ok for now, #:todo /home/danny/github-danny/hyperdata/workspaces/transmissions/todo/module-loader.md

---

move claude dumps out of the way!

<echo> a :Application .

<this> a :ApplicationSession ;
    :application <echo> ;
    :config <config> .


allow reading of transmission + config as one file etc.

allow direct properties on processors in transmissions -

instead of having to use config, ie :
```
var die = this.getProperty(ns.trn.die)
logger.log(`die = ${die}`)
if (die == "true") {
    process.exit(1)
}
```

fix all applications with `:key` in their config

```turtle
:ccc40 a :JSONWalker ;
     trn:settings :messagesConfig .


:MessagesWalker a :ConfigSet ;
    :key :messagesConfig ;
    :pointer "content" .
  ```
```
  :ccc40 a :JSONWalker ;
       trn:settings :MessagesWalker .


  :MessagesWalker a :ConfigSet ;
      :pointer "content" .
    ```



https://opentelemetry.io/docs/languages/js/

* packer
* squirt
* watch Processor (after the worker thread bits sorted)

* mcp ns - make callers for Ollama, Grok, Mistral, Claude, OpenAI
Please make a turtle rdf representation of the schemas attached.  

* look into fs `watch` and git messaging to pull recent changes into #:postcraft
* quick overview doc (enough for ClaudioB)
* fix modules/trans-apps
* transmissions/todo/sub-trans.md
* sort out refactoring todos

* mcp ns/Processors
* clients for Ollama, Grok, Mistral, Claude, OpenAI...
* update librechat

the `processors/postcraft` need un-hardcoding

claude json artifacts

#:todo write #:semtag 'spec' and make processor

* HttpServer : Integrate - refactor workers handling
* Ping : Integrate - needs tests
* signatures (in NS) : Integrate

* Stat
* Sort
* FilenameMap : Integrate
* MarkMap : Integrate




#:um term #:integrate - `um:Integration rdf:subClassOf um:Phase .`

* first pass at an aggregator - current dev techniques, gather data on dev process

### App Gen : Integrate

**vocab : configKey**

tests/helpers/FileTestHelper.js

tests/helpers/TestDataGenerator.js

tests/examples/generate-test-data.js

### App Gen : Integrate

/home/danny/github-danny/transmissions/staging
https://claude.ai/chat/ebf4dd53-7801-49ea-9841-0de9ae2cb394

### Find latest files

* `fs/Stat.js`
* `json/Sort.js`

### Streaming : Integrate

SORT OUT
```javascript
if (message.targetPath) {
     f = path.join(message.targetPath, filepath)
 } else {
     f = path.join(message.dataDir, filepath)
 }
 ```

#:todo ShowConnections util
#:todo validator for pipe (no duplicates!)

#:todo pass a module as `message`, make an `Execute` processor (unsafe)

New utility :
```turtle
:SV a :ShowValue . # show a named value in the message
```



#:transmissions demo : blackjack & hookers

hookers = webhooks

docs : # trm:pipe (:walk_convs :uf_convs  :retree1  :walk_msgs :uf_msgs :SM :DE :retree2  :mf :write) .

#:todo use 'payload' rather that 'content' as default in messages?

#:todo in `FileWriter` dump, add datetime stamp to filename

### ShowConnections util

In transmissions :
```turtle
t:retree a trm:ServiceConfig ;
```
In config :

```turtle
t:retree a trm:ServiceConfig ;
    trm:rename (t:pp1 t:pp2 t:pp3) . # consider using blank nodes
    t:pp1   trm:pre     "content.item.chat_messages" ;
```

---
## Done

* make tests for `Restructure.js`
* get `src/applications/claude-json-converter` working

* fix #:postcraft - good enough for now
