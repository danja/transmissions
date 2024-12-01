# Transmissions : Next Steps

* **add** alternative to `configKey'
`
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


the `processors/postcraft` need un-hardcoding

claude json artifacts

#:todo write #:semtag 'spec' and make processor

* FilenameMap : Integrate
* MarkMap : Integrate

* HttpServer : Integrate - refactor workers handling
* Ping : Integrate - needs tests
* signatures (in NS) : Integrate

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
