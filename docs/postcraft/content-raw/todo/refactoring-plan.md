# Transmissions Codebase Reorganization Plan

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
