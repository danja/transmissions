# Transmissions : Next Steps

* make tests for `Restructure.js`
* get `src/applications/claude-json-converter` working
* quick overview doc (enough for ClaudioB)
* get `trans-apps/applications/claude-json-converter` working
* fix #:postcraft

* transmissions/todo/sub-trans.md

* sort out refactoring todos

#:todo ShowConnections util
#:todo validator for pipe (no duplicates!)

New utility :
```turtle
:SV a :ShowValue . # show a named value in the message
```


blackjack & hookers

docs : # trm:pipe (:walk_convs :uf_convs  :retree1  :walk_msgs :uf_msgs :SM :DE :retree2  :mf :write) .

#:todo use 'payload' rather that 'content' as default in messages?

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
