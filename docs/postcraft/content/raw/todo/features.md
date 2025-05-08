# Transmissions ToDo : Features

### sub trans running

implemented, can't find, need test :

```turtle
:pipeA a trn:Transmission ;
trn:pipe (:pipeB :pipeC ) .

:pipeB  a trn:Transmission ;
 trn:pipe (:s3 :s104 :s105) .

:pipeC a trn:Transmission ;
trn:pipe (:s3 :s204 :s205) .
```

### Multiple input ports processor

subclass of Processor. Demo :Merge - somehow messages are combined

content/raw/prompts/2025-04-17_combo.md

### About flag

`-a, --about` gives description of what's being called - #:selfie, check tinyspy



### Workers

use tinyworker? whatever it is, with vitest

Some implementation, not yet working `examples/worker`

not passing tests...

npm test -- tests/engine/WorkerPool.spec.js
---

* somehow make the processor type more visible in config/manifest

maybe just naming
```turtle
:p10Settings a :ConfigSet ;
...
```


* add a safety check to FileRemove

## Postcraft - related

set up the multi-transmission runner

move to trans-apps



## RDF

drop need for `:ConfigSettings`

allow settings in `transmissions.ttl`
(when it's loaded, use grapoi, prime config)
precedence?

## Processors

### `src/processors/semem`

* ``

### `src/processors/llms`


Tools as Claude Code
```
Tool	Description	Permission Required
AgentTool	Runs a sub-agent to handle complex, multi-step tasks	No
BashTool	Executes shell commands in your environment	Yes
GlobTool	Finds files based on pattern matching	No
GrepTool	Searches for patterns in file contents	No
LSTool	Lists files and directories	No
FileReadTool	Reads the contents of files	No
FileEditTool	Makes targeted edits to specific files	Yes
FileWriteTool	Creates or overwrites files	Yes
NotebookReadTool	Reads and displays Jupyter notebook contents	No
NotebookEditTool	Modifies Jupyter notebook cells	Yes
```

Field compare for tests (integrate)
