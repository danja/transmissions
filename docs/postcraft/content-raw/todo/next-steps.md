# Transmissions : Next Steps

* look into fs `watch` and git messaging to pull recent changes into #:postcraft
* quick overview doc (enough for ClaudioB)
* fix modules/trans-apps
* transmissions/todo/sub-trans.md
* sort out refactoring todos

the `processors/postcraft` need un-hardcoding


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
