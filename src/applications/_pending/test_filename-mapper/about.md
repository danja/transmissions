# Test Filename Mapper

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans test_filename-mapper

npm test -- tests/unit/filename-mapper.spec.js
npm test -- tests/integration/filename-mapper.spec.js
```

## Description

Tests the FilenameMapper processor by:

1. Reading a file
2. Mapping its filename according to configuration
3. Writing the file with the new name

## Test Files

- Input: data/input/input-01.txt
- Expected: data/output/required-01.txt
- Output: data/output/output-01.txt
