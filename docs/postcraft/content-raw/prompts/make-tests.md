# Transmissions : create Jasmine tests

tests/integration/restructure.spec.js isfailing on the equivalence test, although the output appears to be the correct json

## Integration

### Transmissions
Substitute 'test_restructure' for '{app_name}' in what follows.
Please create a test as an artifact following the general pattern of `tests/integration/fs-rw_simple.spec.js` called  `tests/integration/{app_name}.spec.js` that will carry out the following steps :
1. remove any files called `src/applications/{app_name}/data/output/output-01.md`, `src/applications/{app_name}/data/output/output-02.md` etc
2. run `./trans {app_name}`
3. compare the contents of each of the files like `src/applications/{app_name}/data/output/output-01.md` with `src/applications/{app_name}/data/output/required-01.md`
4. report success if the files match, failure otherwise

### Simples
Substitute 'test_restructure' for '{app_name}' in what follows.
Please create a test as an artifact following the general pattern of `tests/integration/fs-rw_simple.spec.js` called  `tests/integration/{app_name}.spec.js` that will carry out the following steps :
1. remove the file `src/applications/test_restructure/data/output/output-01.md` if it exists
2. run `node src/applications/test_fs-rw/simple.js`
3. compare the contents of  `src/applications/test-_fs-rw/data/output/output-01.md` with `src/applications/test_fs-rw/data/output/required-01.md`
4. report success if the files match, failure otherwise
