# About src/engine/

The engine directory contains the core orchestration components that power the Transmissions dataflow framework.

## Core Components

**AppManager.js** - Application lifecycle coordinator that initializes applications, loads RDF datasets, manages module loading, and orchestrates transmission execution.

**TransmissionBuilder.js** - Constructs transmission pipelines from RDF definitions, instantiates processors, and connects them according to the declared flow.

**ProcessorImpl.js** - Base implementation for all processors providing message queuing, processing lifecycle management, settings resolution, and worker coordination.

**ProcessorSettings.js** - Configuration manager that resolves processor properties from multiple RDF datasets (target, transmissions, config) with fallback hierarchy.

## Module System

**ModuleLoader.js** - Dynamic module loader supporting both browser and Node.js environments with classpath-based processor discovery.

**ModuleLoaderFactory.js** - Factory for creating properly configured module loaders for applications and core processor libraries.

**AbstractProcessorFactory.js** - Central processor factory that routes instantiation requests to appropriate specialized factories (flow, HTTP, SPARQL, etc.).

## Concurrency

**WorkerPool.js** - Manages pools of worker threads for parallel message processing with automatic load balancing and error handling.

**TransmissionWorker.js** - Worker thread implementation for processing messages in isolation (basic implementation, extensible).

## Architecture

The engine follows a pipeline architecture where transmissions are defined declaratively in RDF/Turtle, then built into executable processor networks. Each processor handles messages asynchronously through an event-driven model, with optional worker pool parallelization for compute-intensive operations.