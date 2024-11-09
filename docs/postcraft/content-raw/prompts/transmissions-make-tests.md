
## Transmissions

Please create a test following the general pattern of `tests/integration/file-pipeline.spec.js` called  `tests/integration/fs-rw_simples.spec.js` that will carry out the following steps :
1. remove any files called `src/applications/test-_fs-rw/data/output/output-01.md`, `src/applications/test_fs-rw/data/output/output-02.md` etc
2. run `./trans test_fs-rw`
3. compare the contents of each of the files like `src/applications/test-_fs-rw/data/output/output-01.md` with `src/applications/test_fs-rw/data/output/required-01.md`
4. report success if the files match, failure otherwise

## Simples

Please create a test following the general pattern of `tests/integration/file-pipeline.spec.js` called  `tests/integration/fs-rw_simple.spec.js` that will carry out the following steps :
1. remove the file `src/applications/test-_fs-rw/data/output/output-01.md` if it exists
2. run `node src/applications/test_fs-rw/simple.js`
3. compare the contents of  `src/applications/test-_fs-rw/data/output/output-01.md` with `src/applications/test_fs-rw/data/output/required-01.md`
4. report success if the files match, failure otherwise
