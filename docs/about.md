## Build Postcraft

```sh
cd ~/hyperdata/transmissions # my local path
# ./del-dan.sh
./trans postcraft-statics ~/hyperdata/transmissions/docs/postcraft
./trans md-to-sparqlstore ~/hyperdata/transmissions/docs/postcraft
./trans sparqlstore-to-html ~/hyperdata/transmissions/docs/postcraft
./trans sparqlstore-to-site-indexes ~/hyperdata/transmissions/docs/postcraft
```