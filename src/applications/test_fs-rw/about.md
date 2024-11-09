# Application : test-\_fs-rw

Copies

```sh
src/applications/test-_fs-rw/data/output/input-01.md
```

to

```sh
src/applications/test-_fs-rw/data/output/output-01.md
```

the tests compare the new file with :

```sh
src/applications/test-_fs-rw/data/output/required-01.md
```

```sh
cd ~/github-danny/transmissions/ # my local path

# run as application
./trans test_fs-rw

# run as simples
node src/applications/test_fs-rw/simple.js

## Tests in tests/integration

# test as application
npm test -- --filter="fs-rw test"

# test as simples
npm test -- --filter="fs-rw simple test"
```
