danny.ayers.name goes to its own place

```sh
cd ~/hyperdata/transmissions # my local path
./scripts/del-dan.sh # clear SPARQL graphs
./trans postcraft-statics ~/sites/danny.ayers.name/postcraft #
./trans md-to-sparqlstore ~/sites/danny.ayers.name/postcraft
./trans sparqlstore-to-html ~/sites/danny.ayers.name/postcraft
./trans sparqlstore-to-site-indexes ~/sites/danny.ayers.name/postcraft
```

hyperdata projects :

graph : http://hyperdata.it/content
endpoint https://fuseki.hyperdata.it/hyperdata.it/query

[x] - hyperdata
[ ] - transmissions
[ ] - semem

```sh
cd ~/hyperdata/transmissions # my local path
./scripts/del-hyperdata.sh
./trans postcraft-statics ~/hyperdata/hyperdata/docs/postcraft

./trans md-to-sparqlstore ~/hyperdata/hyperdata/docs/postcraft
./trans md-to-sparqlstore ~/hyperdata/transmissions/docs/postcraft
./trans md-to-sparqlstore ~/hyperdata/semem/docs/postcraft

./trans sparqlstore-to-html ~/hyperdata/hyperdata/docs/postcraft
./trans sparqlstore-to-site-indexes ~/hyperdata/hyperdata/docs/postcraft

---
# MANUAL
cd ~/hyperdata/transmissions # my local path
./scripts/del-hyperdata.sh
./trans md-to-sparqlstore ~/hyperdata/semem/docs


```

#:todo combine the separate transmissions here

`src/apps/example-application/about.md`

---

```sh
cd ~/hyperdata/transmissions # my local path
./del2.sh
./trans postcraft-statics tests/apps/example.org
./trans md-to-sparqlstore tests/apps/example.org
./trans sparqlstore-to-html tests/apps/example.org
./trans sparqlstore-to-site-indexes tests/apps/example.org
```






```sh
cd ~/hyperdata/transmissions # my local path
./scripts/del-semem.sh
./trans postcraft-statics ~/hyperdata/semem/docs/postcraft
./trans md-to-sparqlstore ~/hyperdata/semem/docs/postcraft
./trans sparqlstore-to-html ~/hyperdata/semem/docs/postcraft
./trans sparqlstore-to-site-indexes ~/hyperdata/semem/docs/postcraft
```

ok above

```sh
cd ~/hyperdata/transmissions # my local path
./del2.shzxczxcz
./trans postcraft-statics ~/hyperdata/transmissions/docs/postcraft #
./trans md-to-sparqlstore ~/hyperdata/transmissions/docs/postcraft
./trans sparqlstore-to-html ~/hyperdata/transmissions/docs/postcraft
./trans sparqlstore-to-site-indexes ~/hyperdata/transmissions/docs/postcraft
```

```sh
./trans md-to-sparqlstore ~/hyperdata
```
---

smaller
```sh
cd ~/hyperdata/transmissions # my local path
./del2.sh
./trans postcraft-statics ~/sites/strandz.it/postcraft #
./trans md-to-sparqlstore ~/sites/strandz.it/postcraft
./trans sparqlstore-to-html ~/sites/strandz.it/postcraft
./trans sparqlstore-to-site-indexes ~/sites/strandz.it/postcraft
```





# Example Application `about.md`

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans example-application
```

## Description

---
