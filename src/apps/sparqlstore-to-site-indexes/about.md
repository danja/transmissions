`src/applications/sparqlstore-to-site-indexes/about.md`

# sparqlstore-to-site-indexes Application `about.md`

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans sparqlstore-to-site-indexes  ~/sites/strandz.it/postcraft
```

```sh
sudo systemctl stop tbox
cd ~/hyperdata/tbox # my local dir
docker-compose down
docker-compose up -d

cd ~/hyperdata/transmissions # my local path

./trans md-to-sparqlstore -v ~/sites/strandz.it/postcraft
./trans sparqlstore-to-html -v ~/sites/strandz.it/postcraft
./trans sparqlstore-to-site-indexes  -v ~/sites/strandz.it/postcraft

```

## Description

1. query store for most 5 recent entries
2. template as `index.html`
3. save to site root dir
4. template as `atom.xml`
5. save to site root dir

---
