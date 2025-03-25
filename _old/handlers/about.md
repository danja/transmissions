# About `src/handlers/*`

TODO rename

Problem :

if the settings object is a Set :

```turtle
:reader a :ConfigSet ;
    :sourceFile "input/input-01.json" ;
    :mediaType "application/json" .
```

it needs different handling than a List :

```turtle
:retree a :ConfigSet ;
    :rename (:pp1 :pp2 :pp3) . # consider using blank nodes
    :pp1   :pre     "content.item.chat_messages" ;
            :post    "content.channel"  .
    :pp2   :pre     "content.item.uuid" ;
            :post    "content.filename"  .
    :pp3   :pre     "content.item.name" ;
            :post    "content.title"  .
```

that isn't solely a List
