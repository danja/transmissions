# src/model

Core domain models for the Transmissions dataflow framework.

## Files

**App.js** - Singleton application instance managing RDF datasets and providing global state. Handles dataset initialization and merging operations.

**Connector.js** - Pipeline connection handler linking processors via EventEmitter pattern. Manages message flow between processors and nested transmissions.

**Datasets.js** - RDF dataset collection manager providing labeled storage and loading capabilities from Turtle files.

**Processor.js** - Base processor class extending ProcessorImpl. Foundation for all pipeline processing components.

**SlowableProcessor.js** - Processor variant with configurable delay functionality for rate-limited operations.

**Transmission.js** - Pipeline container managing processor collections, connections, and execution flow. Supports nested transmissions with error handling and path tracking.

**Whiteboard.js** - Singleton shared memory system for cross-processor data accumulation and caching.

## Architecture

The model layer implements a dataflow pipeline where:
- **App** provides global context and dataset management
- **Transmission** orchestrates processor execution sequences  
- **Connector** links processors via message passing
- **Whiteboard** enables shared state across pipeline stages
- **Datasets** manages RDF data persistence and loading
