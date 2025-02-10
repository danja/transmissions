# Sub-trans, modularising Applications

**2025-02-06**

I made a start on the refactoring as described below, got distracted, but have done related refactoring incrementally as it was needed.

I'd forgotten where I was up to with this part, so asked Claude.

````prompt
There was talk of adding support for one transmission loading another like a subroutine to help things be more modular, encapsulated. These would be declared in a `transmissions.tll` for example as :

```turtle
@prefix : <http://purl.org/stuff/transmissions/> .

:parent a :Transmission ;
    :pipe (:p10 :p20 :p30) .

:p10  a :NOP .
:p20  a :child .
:p30  a :ShowMessage .

:child a :Transmission ;
  :pipe (:c10 :c20) .

:c10 a :NOP .
:c20 a :NOP .
````

With this, the system would use `src/engine/ApplicationManager.js` to create an `src/model/Application.js` containing two instances of `src/model/Transmission.js` with `src/engine/TransmissionBuilder.js`, these would be connected together by instances of `src/model/Connector.js`. When run the message flow would be equivalent to :

```turtle
:combined a :Transmission ;
    :pipe (:p10 :c10 :c20 :p30) .
```

There may be some kind of support for this already in place, otherwise how would you suggest implementing this feature?

````




**2024-11-03**

I passed this lot to Claude, he gave me `refactoring-plan.md`

## Desired Program Flow

Right now the only way to run things is from a terminal command, running a node script. This is soon to expand. But first...

(`trans` is a convenience to call `run.js`)

The core of the system will involve the `Director` managing the creation and execution of an `Application`. An `Application` will contain a set of `Transmission` definitions (which may be interconnected). When an `Application` is applied to a *target* (a filesystem system location, a URL or other identifier) it will read details of the local source data (specified in a `manifest.ttl`) so an instance of the `Application` can be applied.

1. `run.js`, assisted by `Dispatch` parses command line arguments, initializes a `Director`, to which it passes instructions
2. `Director` should create a `TransmissionBuilder`, a `TransmissionRunner` a `Procurer` and a `Proctor`
3. `Proctor` - TBD. (later it will take responsibility for reflection, self-examination, test & documentation in a unified fashion)
4. `Director` will use `TransmissionBuilder` to populate `Application` using `Procurer` to resolve dependencies and load resources
5. `Procurer` will be responsible for reading and writing RDF data
6. Once the `Application` has been prepared, `Director` should apply it to the supplied target.

#:todo `CommandUtils` should be renamed `Dispatch`
#:todo `CommandUtils` currently creates a `TransmissionRunner`, `Dispatch` should initialise a singleton `Director` and pass the instructions there
#:todo `Proctor` implementation is not required yet, just a placeholder for now
#:todo `Procurer` should replace `ApplicationManager`
#:todo `Procurer` will be responsible for asset management, in the sense of dependency resolution and loading resources
#:todo the `ModuleLoader` operations currently in `TransmissionBuilder`should be moved to `Procurer`
#:todo the dataset reading and writing operations currently in `TransmissionBuilder`should be moved to `Procurer`

At the moment only a single `transmissions.ttl` and `processors-config.ttl` is used. This will remain the default, but the infrastructure needs to be extended so that `transmissions.ttl` can include calls to launch transmissions defined in other files. Similarly  `processors-config.ttl` will specify other files that may be merged into the configuration model.



#:todo rename `AbstractProcessorFactory` to `Fabricator`, move under `/processors`

### Proctor

* self-description : docs & Turtle
* tests
* a channel for receiving messages from the logger - preemptively asking AI for solutions, fixing when it can

Commander has target **state** but might not know how to achieve it - leave space for AI

The CommandUtils class handles application resolution and could support sub-transmission loading

Create TransmissionLoader class to handle dependency resolution and loading
Modify TransmissionBuilder to recursively process dependent transmissions
Update CommandUtils to support transmission dependency paths

q1: Would you like to see a specific vocabulary proposal for transmission dependencies?
q2: Should dependent transmissions share the same processor config or have their own?
q3: How should transmission execution order be handled for dependencies?
q4: Would you like an example of using dependent transmissions in postcraft?



## Core System (as current)

---

```sh
danny@danny-desktop:~/hyperdata/transmissions$ ./trans -h
Usage: ./trans <application>[.subtask] [options] [target]

Positionals:
  application  the application to run
  target       the target of the application

Options:
      --version  Show version number                                   [boolean]
  -P, --payload  message.payload as a JSON string or a path to a JSON file
                                                                        [string]
  -w, --web      Start web interface                                   [boolean]
  -p, --port     Port for web interface                 [number] [default: 3000]
  -h, --help     Show help                                             [boolean]
````

./trans postcraft ../postcraft/danny.ayers.name

./trans postcraft ../postcraft/danny.ayers.name
