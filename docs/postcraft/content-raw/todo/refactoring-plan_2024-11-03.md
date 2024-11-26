# Transmissions Codebase Reorganization Plan

chat around /home/danny/github-danny/hyperdata/workspaces/hyperdata/chat-archives/md/5d94/2024-11-03_e7e.md
## ME

# [Reorganizing Transmissions Codebase for Modular Development](https://claude.ai/chat/5d949a8b-d60c-42c7-90f4-6b26752cd9fd)

a2b22596-e275-4711-bc35-dcd0c79c9768

We need to reorganise the codebase, generally separating concerns so that it will be easier to manage development of the system. Below are the requirements, roughly stated. Please read and compare with the existing code in your project knowledge to come up with a systematic plan to implementing these. Then express the plan in small practical instructions, editing steps etc I can make, and show me these in an artifact document for me to go through.  

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

---

* **dataDir** : src/applications/claude-json-converter/data
* **rootDir** : claude-json-converter
* **applicationRootDir** : claude-json-converter
* **tags** : p10.p20.p30.p40.p50
* **done** : false
* **meta** : {
  "conv_uuid": "5d949a8b-d60c-42c7-90f4-6b26752cd9fd",
  "conv_name": "Reorganizing Transmissions Codebase for Modular Development",
  "updated_at": "2024-11-03T16:09:33.360751Z"
}
* **filepath** : /home/danny/github-danny/hyperdata/docs/postcraft/content-raw/chat-archives/md/5d94/2024-11-03_a2b.md

## Phase 1: Create New Core Classes

1. Create `src/core/Director.js`:
```javascript
class Director {
  constructor() {
    this.builder = new TransmissionBuilder();
    this.runner = new TransmissionRunner();
    this.procurer = new Procurer();
    this.proctor = new Proctor();
  }

  async initializeApplication(args) {
    const application = new Application();
    await this.procurer.loadResources(application, args);
    await this.builder.buildTransmissions(application);
    return application;
  }

  async applyToTarget(application, target) {
    await this.runner.execute(application, target);
  }
}
```

2. Create `src/core/Application.js`:
```javascript
class Application {
  constructor() {
    this.transmissions = new Map();
    this.config = null;
    this.manifest = null;
  }

  addTransmission(id, transmission) {
    this.transmissions.set(id, transmission);
  }
}
```

3. Create `src/core/Procurer.js`:
```javascript
class Procurer {
  constructor() {
    this.moduleLoader = ModuleLoaderFactory.createModuleLoader();
  }

  async loadResources(application, args) {
    const config = await this.loadConfig(args.configPath);
    const manifest = await this.loadManifest(args.target);
    application.config = config;
    application.manifest = manifest;
  }
}
```

## Phase 2: Refactor Existing Code

1. Rename and update `CommandUtils.js` to `Dispatch.js`:
```javascript
class Dispatch {
  constructor() {
    this.director = new Director();
  }

  async handleCommand(args) {
    const application = await this.director.initializeApplication(args);
    await this.director.applyToTarget(application, args.target);
  }
}
```

2. Update `run.js`:
```javascript
import Dispatch from './src/core/Dispatch.js';

const dispatch = new Dispatch();
await dispatch.handleCommand(args);
```

## Phase 3: Move Functionality

1. Move module loading from TransmissionBuilder to Procurer:
```javascript
// In Procurer.js
async loadModule(name) {
  return this.moduleLoader.loadModule(name);
}
```

2. Move dataset operations from TransmissionBuilder to Procurer:
```javascript
// In Procurer.js
async loadDataset(path) {
  const stream = fromFile(path);
  return await rdf.dataset().import(stream);
}
```

## Phase 4: Implement Resource Resolution

1. Add resource resolution to Procurer:
```javascript
// In Procurer.js
async resolveTransmissionFiles(basePath) {
  const files = await this.findTransmissionFiles(basePath);
  return this.mergeTransmissionFiles(files);
}

async resolveConfigFiles(basePath) {
  const files = await this.findConfigFiles(basePath);
  return this.mergeConfigFiles(files);
}
```

## Migration Steps

1. Create new directory structure:
```
src/
  core/
    Director.js
    Application.js
    Procurer.js
    Proctor.js
    Dispatch.js
  engine/  # Move existing engine code here
  processors/ # Keep existing processors here
```

2. Update imports in all files to reflect new structure

3. Create placeholder Proctor:
```javascript
class Proctor {
  constructor() {
    // Placeholder for future implementation
  }
}
```

4. Update tests to use new structure

## Testing Strategy

1. Create unit tests for new core classes
2. Update existing integration tests
3. Add new integration tests for multi-file transmissions
4. Verify resource resolution with test cases
