# Transmissions : Next Steps


* fix #:postcraft

* fix modules/trans-apps

* quick overview doc (enough for ClaudioB)

* transmissions/todo/sub-trans.md

* sort out refactoring todos

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
