# file-copy-remove-test

run with :

```
transmissions$ ./run file-copy-remove-test
```

this should :

- copy `start/one.txt` into `single-empty/`
- copy `single-empty/one.txt` into `single-full/`
- remove `single-empty/one.txt`

- copy everything in `start/` into `several-empty/`
- copy everything in `several-empty/` into `several-full/`
- remove everything in `several-empty/`

Hmm, test services would be helpful to check before and after - or maybe just use regular test runner script from npm?
