# Sub-trans, modularising Applications

**2024-11-02**



## Desired Program Flow

Right now the only way to run things is from a terminal command, running a node script. This is soon to expand. But first...

(`trans` is a convenience to call `run.js`)

1. `run.js`, assisted by `CommandUtils` parses command line arguments and passes instructions to `Commander`

* change : `CommandUtils` currently creates a `TransmissionRunner`

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
danny@danny-desktop:~/github-danny/transmissions$ ./trans -h
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
```

./trans postcraft ../postcraft/danny.ayers.name

./trans postcraft ../postcraft/danny.ayers.name
