# Transmissions ToDo : Features

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
