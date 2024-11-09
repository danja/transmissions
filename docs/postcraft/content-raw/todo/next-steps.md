# Transmissions : Next Steps

* make tests for `Restructure.js`
* get `src/applications/claude-json-converter` working
* get `trans-apps/applications/claude-json-converter` working
* fix #:postcraft


* sort out refactoring todos



transmissions/todo/sub-trans.md

blackjack & hookers

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
