```sh
cd ~/github-danny/transmissions/
 ./trans ../trans-apps/templates/new-app
```

./trans claude-json-converter -P ./conversations.json

```turtle
:s40 a :Restructure ;
    trm:configKey :walkPrep .

...

t:walkPrep a trm:ReMap ;
    trm:rename (t:pp1 t:pp2) . # consider using blank nodes
    t:pp1   trm:pre     "content" ;
            trm:post    "template"  .
    t:pp2   trm:pre     "entryContentMeta.sourceDir" ;
            trm:post    "sourceDir" .
```
