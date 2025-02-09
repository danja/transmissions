# Application : test_restructure

Run with :

```sh
cd ~/github-danny/transmissions/ # local path of repo
./trans test_restructure
```

#:todo make this into something like processor signature
#:todo make Turtle version

## Description

Reads :

```sh
src/applications/test_restructure/data/output/input-01.json
```

as a message, restructures it according to config, then writes the result to :

```sh
src/applications/test_restructure/data/output/output-01.json
```

the tests compare the new file with :

```sh
src/applications/test_restructure/data/output/required-01.json
```

```sh
cd ~/github-danny/transmissions/ # my local path

# run as application
./trans test_restructure

# run as simples
node src/applications/test_restructure/simple.js

## Tests in tests/integration

# test as application
npm test -- --filter="restructure test"

# test as simples
npm test -- --filter="restructure_simple test"
```

---

```sh
cd ~/github-danny/transmissions/
./trans test_restructure -P ./src/applications/test_restructure/input/input-01.json
```

---

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
