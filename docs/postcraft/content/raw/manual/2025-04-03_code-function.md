# Code Function

#:definitive 2025-04-03

What they **should** do. Dated notes are things that may change in future (mostly generalizations of current functionality).

## Style Notes

Core code is made using ES modules. Each exports a single `default`, with a class name corresponding to the filename, eg. in `src/engine/ProcessorSettings.js` :
```javascript
export default ProcessorSettings
```

## Model : `src/model` : Primarily representations of state

### Application

Top-level Transmissions application. An Application contains a set of Transmission definitions together with a set of Configuration definitions.  

this.transmissionsModel = null
     this.manifestModel = null
     this.configModel = null

**2025-04-03** transmissions are defined in the file `transmissions.ttl`

### Model

### Transmission  

A pipeline/workflow that defines a sequence of processes, providing identifiers for each Processor as well as corresponding

### Configuration  


### Processors  


### SlowableProcessor  

### Connector  



### Whiteboard

## Engine : `src/engine` : Primarily operations on Model

AbstractProcessorFactory.js  ApplicationManager.js  AppResolver.js  ModuleLoaderFactory.js  ModuleLoader.js  ProcessorSettings.js  TransmissionBuilder.js  WorkerPool.js
