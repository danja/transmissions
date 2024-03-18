---

- [specgen-ng](https://github.com/danja/specgen-ng)

rapper -o turtle email.rdf > email.ttl

cd /home/danny/HKMS/specgen-ng

mkdir spec/email

danny@danny-desktop:~/HKMS/treadmill/src$ cd /home/danny/foaf-archive/vocabs/
danny@danny-desktop:~/foaf-archive/vocabs$ mkdir email

python src/specgenng.py \
 --indir=/home/danny/foaf-archive/vocabs/email/ \
 --ns=http://www.w3.org/2000/04/maillog2rdf/email# \
 --prefix=email \
 --ontofile=email.ttl \
 --templatedir=template \
 --outdir=/home/danny/foaf-archive/vocabs/email/ \
 --outfile=email.html

grr, not enough input

email_danja_2024-03-16.ttl

rapper -i turtle -o rdfxml email_danja_2024-03-16.ttl > email_danja_2024-03-16.rdf

python src/specgenng.py \
 --indir=/home/danny/foaf-archive/vocabs/email/ \
 --ns=http://www.w3.org/2000/04/maillog2rdf/email# \
 --prefix=email \
 --ontofile=email_danja_2024-03-16.rdf \
 --templatedir=template \
 --outdir=/home/danny/foaf-archive/vocabs/email/ \
 --outfile=email.html
