# Building a Transmissions Application

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
5. Create minimum necessary `transmissions.ttl` and `services.ttl` to test
6. If appropriate, create `manifest.ttl`
7. Expand/fix above as necessary
8. Deploy

## Here we go

### Necessary inputs and desired outputs

- Inputs : starting point on fs, file name filter (any other config leave for now)
- Outputs : a list of relevant dirs & their metrics

The inputs here are values that might change per run, so they should probably go in `manifest.ttl` or maybe better on the command line.

The outputs - doesn't have to be fancy, just something to `stdout` that isn't a flood will do.

### Sequence of operations sketch

- system receives a start path, filter definition
-
