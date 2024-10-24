I would like you to help me create a Transmissions application. Its purpose will be to extract data from a JSON file and transform the result into two representations :

* a set of markdown documents
* a set of Turtle RDF files

Please build the application following these steps, one at a time :

1. digest the material here
2. ascertain what will needed, referring to the references below and your project knowledge
3. build what is needed

The transmission will read the JSON file from disk, walk the JSON structure, and spawn additional processes to reformat the contents. One branch of processes will do the markdown formatting, the other the Turtle.

Transmissions operates by chaining together processes at runtime. Each process should have one primary function, for anything more than this the functionality should be decomposed into smaller units, each in their own processor module. The processes should be created in a manner that makes them suitable for reuse, with any application-specific declarations contained in `processors-config.ttl`.

In this implementation, two filesystem locations will be used, relative to the starting dir :

* `transmissions` - core system repo
* `trans-apps` - application repo

The application will be run with :
```sh
cd transmissions
./trans ../trans-apps/applications/claude-json-converter ../trans-apps/applications/claude-json-converter/conversations.json
```

Application examples can be found in :
```sh
transmissions/src/applications
```

The processing pipeline will be defined in :
```sh
trans-apps/applications/claude-json-converter/transmissions.ttl
```

Any system configuration data needed should be expressed in :
```sh
trans-apps/applications/claude-json-converter/processors-config.ttl
```

Most of the necessary processors can be found in the JS modules contained in :
```sh
transmissions/src/processors/
trans-apps/applications/**/processors/
```

Any new processors should be patterned on the templates in :
```sh
trans-apps/applications/claude-json-converter/processors/ProcessorTemplate.js
trans-apps/applications/claude-json-converter/processors/TemplateProcessorsFactory.js
```
and will be placed in the same dir.

A simple standalone skeleton for testing the application and processors should be constructed, modeled on the contents of :
```sh
trans-apps/applications/claude-json-converter/scripts/test-runner.js
```

Finally create unit and integration tests that may be run via Jasmine, modeled on those in :
```sh
transmissions/tests/
```

The new tests will be placed in :
```sh
trans-apps/applications/claude-json-converter/tests/
```
and configured to be run from npm.

---

├── about.md
├── conversations.json
├── manifest.ttl
├── package.json
├── processors
│   ├── ProcessorTemplate.js
│   └── TemplateProcessorsFactory.js
├── processors-config.ttl
├── repopack.config.json
├── scripts
│   └── test-runner.js
├── transmissions.ttl
└── users.json



You have in your project knowledge a Python script called cli.py.


# Transmissions Reference Key

Transmissions is an evolving system designed to simplify development of data processing applications. It operates through pipeline-like structures which are described declaratively.

## Terminology

Typically two filesystem locations will be used :

* `transmissions` - core system repo
* `trans-apps` - application repo

├── src
│   ├── applications : demo (and some stale) applications
│   ├── engine : system-level modules
│   ├── processors :  (and some stale)
│   ├── sandbox
│   ├── simples
│   └── utils
├── tests
│   ├── grapoi-raw-tests.js
│   ├── helpers
│   ├── integration
│   └── unit

## transmissions.ttl


##
