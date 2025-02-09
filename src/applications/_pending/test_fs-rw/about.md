# Application : test_fs-rw

```sh
cd ~/github-danny/transmissions/ # my local path

# run as application
./trans test_fs-rw
```

---

Copies

```sh
src/applications/test_fs-rw/data/output/input-01.md
```

to

```sh
src/applications/test_fs-rw/data/output/output-01.md
```

the tests compare the new file with :

```sh
src/applications/test_fs-rw/data/output/required-01.md
```

```sh
cd ~/github-danny/transmissions/ # my local path

# run as application
./trans test_fs-rw

# run as simples
node src/applications/test_fs-rw/simple.js

## Tests in tests/integration

# test as application
npm test -- --filter="fs-rw test"

# test as simples
npm test -- --filter="fs-rw simple test"
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
