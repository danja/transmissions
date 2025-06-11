# Troubleshooting

## Symptoms
* Unexpected settings value
* Mysteriously hangs

### Unexpected settings value

#### Possible Cause

#### Diagnostic

Use -v in the command line, grep for Warning - possible Turtle syntax error (broken Turtle files are ignored). The `rapper` utility can be helpful :
```sh
rapper -c -i turtle <filename>
```

#### Fix



---


### Mysteriously hangs

After generally working, the transmission hangs for no apparent reason when run.

#### Possible Cause

Duplicate processor in pipeline, eg. `:p1 :SM :p2 :SM`

#### Diagnostic

#### Fix




check with
```sh
 rapper -c -i turtle tt.ttl
```

 :loglevel "debug" ;

Insert :SE :DE in the transmission

:TEST a :NOP ;
  :settings [
    :test "TEST FROM ttl"
  ] .

Double-check where the properties are coming from

run tests

new processor has test?

create a new test : sample-app
