#:todo combine the separate transmissions here

`src/apps/example-application/about.md`

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
./del-dan.sh
./trans postcraft-statics ~/sites/danny.ayers.name/postcraft #
./trans md-to-sparqlstore ~/sites/danny.ayers.name/postcraft
./trans sparqlstore-to-html ~/sites/danny.ayers.name/postcraft
./trans sparqlstore-to-site-indexes ~/sites/danny.ayers.name/postcraft
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
