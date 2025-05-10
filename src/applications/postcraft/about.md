#:todo combine the separate transmissions here

`src/applications/example-application/about.md`

smaller
```sh
cd ~/hyperdata/transmissions # my local path
./del2.sh
./trans postcraft-statics ~/sites/strandz.it/postcraft #
./trans md-to-sparqlstore ~/sites/strandz.it/postcraft
./trans sparqlstore-to-html ~/sites/strandz.it/postcraft
./trans sparqlstore-to-site-indexes ~/sites/strandz.it/postcraft
```


```sh
cd ~/hyperdata/transmissions # my local path
./del2.sh
./trans postcraft-statics ~/sites/danny.ayers.name/postcraft #
./trans md-to-sparqlstore ~/sites/danny.ayers.name/postcraft
./trans sparqlstore-to-html ~/sites/danny.ayers.name/postcraft
./trans sparqlstore-to-site-indexes ~/sites/danny.ayers.name/postcraft
```

# Example Application `about.md`

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans example-application
```

## Description

---
