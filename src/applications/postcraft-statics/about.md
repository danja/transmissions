# About 

`src/applications/postcraft-statics/about.md`

# Example Application `about.md`

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans postcraft-statics ~/sites/strandz.it/postcraft
```

```sh
sudo systemctl stop tbox
cd ~/hyperdata/tbox # my local dir
docker-compose down
docker-compose up -d

cd ~/hyperdata/transmissions # my local path

./trans md-to-sparqlstore -v ~/sites/strandz.it/postcraft
./trans postcraft-statics ~/sites/strandz.it/postcraft
./trans sparqlstore-to-html -v ~/sites/strandz.it/postcraft
./trans sparqlstore-to-site-indexes  -v ~/sites/strandz.it/postcraft

```


## Description

---

