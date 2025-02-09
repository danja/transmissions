

# cd src/applications/file-copy-remove-test

# remove previous dirs under data   
rm -rf data/start
rm -rf data/single-empty
rm -rf data/single-full
rm -rf data/several-empty
rm -rf data/several-full


# create new dirs under data
mkdir -p data/start
#mkdir -p data/single-empty
#mkdir -p data/single-full
#mkdir -p data/several-empty
#mkdir -p data/several-full

# create a file 'data/start/one.txt' with content 'Hello from One'
echo 'Hello from One' > data/start/one.txt

# create a file 'data/start/two.txt' with content 'Hello from Two'
echo 'Hello from Two' > data/start/two.txt

tree data