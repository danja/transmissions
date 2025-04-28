cd ~/hyperdata/transmissions # my local path
./del2.sh
./trans md-to-sparqlstore ~/sites/danny.ayers.name/postcraft
./trans postcraft-statics ~/sites/danny.ayers.name/postcraft #
./trans sparqlstore-to-html ~/sites/danny.ayers.name/postcraft
./trans sparqlstore-to-site-indexes ~/sites/danny.ayers.name/postcraft