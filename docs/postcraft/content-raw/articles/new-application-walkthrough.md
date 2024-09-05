# Building a Transmissions Application

Easy, but there are a lot of small steps

Shallow but long learning curve

TODO transmissions anatomy
TODO responsibilities of a service
TODO note about cumulative benefit of using transmissions/dogfood

TODO figure out a system for what to do when expected bits of the message are missing

**2024-08-06**

TODO make this collapsed

#Transmissions has reached a point where I'm starting to actually use it. I've deployed the #Postcraft application already for static sites, even though it's still very lacking. But I'm using iterative, eat your own dogfood dev.

I've been using markdown for notes for a few years now. I spent a while using #Obsidian then #Joplin apps (they have a lot of overlap with my #hyperdata meta-project).
This means I've got loads of markdown files scattered all over the place. My next steps (embeddings etc) call for me to pull them together.

I was about to ask #Claude to write me a bash script to help me locate them. Then thought, even though such a script would quickly help with the immediate problem, it's a nice size problem to dogfood on #Transmissions as demo/tyre-kicking.

## Description

- Goal : a tool to recursively read local filesystem directories, checking for files with the `.md` extension to identify collections of such
- Goal : documentation of the app creation process
- Implementation : a #Transmissions application
- SoftGoal : reusability
- _non-goal_ - efficiency

## Requirements

### Abstract

- Recursive directory walker
- File name filter/glob : recognise `<pattern>`, eg. `*.md`
- Simple metrics : count`<pattern>` per dir
- Presentation : easy to interpret output (something like `tree`?)

### Implementation-specific

_(Provisional order of work after analysis)_

1. Service implementations
2. Transmission definition (`transmission.ttl`)
3. Application service configurations (`services.ttl`)
4. Instance manifest (`manifest.ttl`)

## Dev Process

1. Identify necessary inputs and desired outputs
2. Loosely sketch sequence of operations, broken down into minimal functionality of each
3. Look for existing services that might fulfil the necessary operations
4. If necessary write new services
5. Initialise environment as needed
6. Create minimum necessary `transmissions.ttl` and `services.ttl` to test
7. If appropriate, create `manifest.ttl`
8. Expand/fix above as necessary
9. Deploy

## Here we go

### 1. Necessary inputs and desired outputs

- Inputs : starting point on fs, file name filter (any other config leave for now)
- Outputs : a list of relevant dirs & their metrics

The inputs here are values that might change per run, so they should probably go in `manifest.ttl` or maybe better on the command line.

The outputs - doesn't have to be fancy, just something to `stdout` that isn't a flood will do.

### 2. Sequence of operations sketch

- system receives a start path, filter definition
- a dir walker recurses through dirs, spitting out their paths as it goes through
- a filter checks the path to see if it matches the required pattern, if so passes it on
- a correlator? groups and annotates the findings
- a writer prints out the result

### 3. Existing services

TODO command line path argument?

check `/home/danny/github-danny/transmissions/docs/postcraft-site/todo/service-statuses.md`

check JSDoc

```
npm run docs
```

Services are grouped by functional area :

```
src/services/
├── base
├── fs
├── markup
├── postcraft
├── protocols
├── rdf
├── ServiceExample.js
├── test
├── text
├── unsafe
└── util
```

All are subclasses of Service

There is a `DirWalker`

There was a `src/services/text/StringFilter.js` but it wasn't in use anywhere, so missed out on refactoring. It'll be easiest to write again to ensure consistency with other services.

### 4. If necessary write new services

see `docs/postcraft-site/articles/new-service-walkthrough.md`

looks like I'll also need a `src/services/util/CaptureAll.js`, a singleton that all messages will be received by

### 5. Initialise environment as needed

The minimum necessary for a #Transmissions app is a `transmission.ttl` TODO checkthis is the case

In the current setup, in the `transmissions` repo, the following should be created :

```
src/applications/globbo/
├── about.md
├── services.ttl
└── transmission.ttl
```

For the `run` script to address the application, `about.md` **must** exist. It **should** contain a description of the application.

#### DirWalker

**_Input_**

- message.rootDir
- message.sourceDir

**_Output_**

- message.filename

```
(:SM :DE) pipeline

./run globbo
...
{
  "dataDir": "src/applications/globbo/data",
  "rootDir": "",
  "applicationRootDir": "/home/danny/github-danny/transmissions/src/applications/globbo",
  "dataString": "",
  "tags": "SM"
}
```

```
./run globbo something
...
{
  "dataDir": "src/applications/globbo/data",
  "rootDir": "something",
  "applicationRootDir": "/home/danny/github-danny/transmissions/src/applications/globbo",
  "dataString": "something",
  "tags": "SM"
}
```

TODO fix up run.js, the command arg is getting put in rootDir, no!

Ok, there is:

```
./run globbo -c '{"a":"something"}'
...
{
  "a": "something",
  "applicationRootDir": "/home/danny/github-danny/transmissions/src/applications/globbo",
  "dataString": "",
  "tags": "SM"
}
```

TODO Where did `rootDir` go?

```
./run globbo -c '{"rootDir": "./", "sourceDir":"docs"}'
...
{
  "rootDir": "./",
  "sourceDir": "docs",
  "applicationRootDir": "/home/danny/github-danny/transmissions/src/applications/globbo",
  "dataString": "",
  "tags": "SM"
}
```

adding `DirWalker` - not bad!

NEXT CaptureAll

I need a ShowConfig
