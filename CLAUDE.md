## General

- Follow best practices, agile methodologies
- Prioritize modularity
- keep extensibility and maintainability in mind
- warn of potentially breaking changes
- suggest tests as appropriate
- First break tasks into distinct prioritized steps, then follow the steps
- Prioritize tasks/steps you’ll address in each response
- don't repeat yourself
- keep responses short, minimal explanation
- design for serendipity

## Codebase

- When asked to work on a given problem, try to keep the scope narrow to that problem, only consider the more immediate dependencies and side effects
- unless directed otherwise, ignore material under ./docs (it may be out of date) and follow .gitignore rules

## Code

- use ES module syntax
- where appropriate suggest refactorings and code improvements
- favor using the latest ES and nodejs features
- Don’t apologize for errors: fix them
- Typescript type definition files should be maintained.
- If further work in an area is recommended, add TODO: comments

## Comments

- Comments should be created where the operation isn't clear from the code, or where uncommon libraries are used
- Code must start with path/filename as a one-line comment
- Comments should describe purpose, not effect

## Libraries

The following libraries should be preferred to alternatives when their functionality is needed :

- tests : vitest, chai, nyc
- documentation : jsdoc
- bundling : webpack
- RDF handling : rdf-ext, grapoi, @rdfjs/data-model @rdfjs/namespace @rdfjs/parser-n3
- code editing : codemirror
- templating : nunjucks
- markdown : marked

## Transmissions Framework

### Architecture Overview

Transmissions is a message-driven pipeline framework where:
- **Messages** flow through pipelines of processors
- **Processors** transform messages and emit them to the next processor
- **Pipelines** are defined in RDF/Turtle configuration files

### Key Concepts

**Message Flow:**
- Messages are JavaScript objects that flow through processors
- Each processor receives a message, processes it, and emits it via `this.emit('message', message)`
- Processors can add/modify fields on the message object
- The `done` flag is used by spawning processors (ForEach, Fork, DirWalker) to indicate completion

**Configuration:**
- `transmissions.ttl` - Defines the pipeline structure and processor connections
- `config.ttl` - Contains processor settings and configuration values
- Configuration uses RDF/Turtle syntax with `:pipe` defining processor sequence

**Path Access:**
- Use `JSONUtils.get(object, "path.to.field")` for reading nested properties
- Use `JSONUtils.set(object, "path.to.field", value)` for setting nested properties
- Supports array indices: `"field[0].property"` or `"field.array[2]"`

**Common Patterns:**
- `getProperty(ns.trn.propertyName, defaultValue)` - Gets config values, checks message first then config
- Templates use Nunjucks with `{{variable}}` syntax
- SPARQL queries use `PREFIX` declarations and support graph operations

**Processor Types:**
- **Flow:** ForEach, Fork, Choice, Accumulate - control message flow
- **SPARQL:** SPARQLSelect, SPARQLUpdate - interact with RDF stores
- **Transform:** Restructure, PathOps - modify message structure
- **I/O:** FileReader, FileWriter, HttpClient - external interactions
- **Note:** Many more processors exist in `src/processors/`. Always search for existing processors before creating new ones. Use `Glob` to find processors: `src/processors/**/*.js`

**Debugging:**
- Run with `-v` flag for verbose output: `./trans -v app-name`
- Use `LOG_LEVEL=debug` for detailed logging
- Add `:SM` (ShowMessage) processor in pipeline to inspect messages
