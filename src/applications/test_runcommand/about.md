# Application: test_runcommand

```sh
cd ~/github-danny/transmissions/ # my local path

# run as application
./trans test_runcommand
```

This test application demonstrates the RunCommand processor by executing a simple echo command and verifying its output.

The test runs a simple echo command defined in config.ttl and compares the output with the expected content in:

```sh
src/applications/test_runcommand/data/output/required-01.txt
```

```sh
# run as application
./trans test_runcommand

# run tests
npm test -- --filter="runcommand test"
```
