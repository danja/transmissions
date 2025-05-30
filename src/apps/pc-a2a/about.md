# About

publish a2a

`src/apps/postcraft-statics/about.md`

# Example Application `about.md`

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans pc-a2a ~/hyperdata/a2a-o/docs/postcraft
```

---

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

./trans md-to-sparqlstore ~/sites/strandz.it/postcraft
./trans postcraft-statics ~/sites/strandz.it/postcraft
./trans sparqlstore-to-html ~/sites/strandz.it/postcraft
./trans sparqlstore-to-site-indexes ~/sites/strandz.it/postcraft

```

## Description

---
