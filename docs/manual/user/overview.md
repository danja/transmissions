# Transmissions Overview

Transmissions is a workflow compositor designed to carry out data processing operations as a series of relatively simple steps.

## Terminology

Keywords :

- app
- mode
- transmission
- subtask
- processor
- dataset
- message
- module
- settings
- target

An **app** is a practical application of a collection of **transmissions**.

A **transmission** is a workflow description expressed in Turtle RDF. A collection of these appears in a `transmissions.ttl` file, which is a serialization of a **dataset**. This **dataset** is the primary definition of a Transmissions **app**. Within Transmissions a **dataset** is an RDF dataset (implemented using RDF-Ext and associated libraries). A transmission may be addressed individually as a **subtask**. At runtime a **message**, which is a JSON object is passed through the sequence of **processor**s declared in the current **transmission**. Operation is event-driven. The runtime behaviours of the **processor**s is determined by **settings**. A processor has a minimal interface as found in `src/model/Processor.js`. At runtime it receives a **message**, applies a process to the object, with parameters that may be provided via **settings**, and then passes on the result to the next **processor** in the **transmission**.

The **mode** refers to the manner in which an **app** is launched. This may be direct from the CLI, via the REPL or via a Web service. There is an auxiliary mode **watch** which relies on a long-running process. In this mode a change in a watched filesystem triggers an **app** run. 

**Settings** are property values taken from the following sources, in descending order of priority :

1. current **message** - a JSON object
2. `tt.ttl` - **target** definition, a **dataset**
3. `transmissions.ttl` - transmissions definition, a **dataset**
4. `config.ttl` - default configuration, a **dataset**

In a full configuration, the **app** will comprise definitions from `transmissions.ttl` and `config.ttl`. Associated with these is an `about.md` which provides a human-readable description of the **app**. When run a **target** may be identified, which is a directory containing a `tt.ttl` files. Typically the directory will also contain data used by the **app** for that target. To enable creation of Transmissions **app**s which are loosely coupled to the

A lot of the codebase is work in progress.

## Program Flow

Transmissions is typically launched using `./trans`, which simply calls the entry point at `src/api/cli/run.js`. This parses the command-line args and passes them to `src/api/common/CommandUtils.js` which organises them into
