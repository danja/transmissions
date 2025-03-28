# Transmissions Engine Component Documentation

## Overview
The Transmissions engine is the core processing infrastructure responsible for application loading, transmission construction, and execution. It uses a combination of RDF-based configuration and dependency injection for flexible pipeline construction.

## Core Components

### `AbstractProcessorFactory.js`
A factory class that creates processor instances using a chain of responsibility pattern:
- Creates processor instances based on their type
- Searches through various processor factories to find matching processor implementations
- Returns appropriate processor instance or falls through to next factory
- Serves as the central registry for all available processor types in the system

### `ApplicationManager.js`
Manages the lifecycle of Transmissions applications:
- Initializes application context and configuration
- Loads application manifests and configurations
- Builds transmission pipelines from RDF definitions
- Starts application execution with provided messages
- Maintains application state throughout processing
- Provides methods for listing available applications

### `AppResolver.js`
Resolves application paths and loads configurations:
- Locates application files in the filesystem
- Resolves relative paths to actual filesystem locations
- Loads transmission and configuration files
- Handles manifest files for deployment-specific configuration
- Resolves subtasks within applications
- Provides context information to the application manager

### `ModuleLoader.js`
Dynamic module loading system for processors:
- Manages a classpath for processor module loading
- Provides caching mechanism for loaded modules
- Handles module resolution across multiple paths
- Gracefully handles module loading errors

### `ModuleLoaderFactory.js`
Factory for creating ModuleLoader instances:
- Creates singleton ModuleLoader instances
- Configures loader with proper paths for core and application processors
- Provides application-specific module loading

### `ProcessorSettings.js`
Handles processor configuration from RDF datasets:
- Extracts configuration properties from RDF graphs
- Resolves property values based on various lookup strategies
- Handles single values, arrays, and nested configurations
- Supports property inheritance and overrides
- Works with message-based property overrides

### `TransmissionBuilder.js`
Constructs processing pipelines from RDF definitions:
- Builds processor instances based on RDF configurations
- Connects processors to form the transmission pipeline
- Handles nested transmissions
- Manages processor instantiation and configuration
- Connects event handlers between processors

### `WorkerPool.js`
Manages worker threads for parallel processing:
- Creates a pool of worker threads
- Manages message queuing and dispatch
- Handles worker lifecycle and reuse
- Provides load balancing across workers

## Interaction Flow

1. `ApplicationManager` initializes using `AppResolver` to locate application files
2. `ApplicationManager` uses `TransmissionBuilder` to construct transmission pipelines
3. `TransmissionBuilder` uses `AbstractProcessorFactory` to create processor instances
4. `AbstractProcessorFactory` uses `ModuleLoaderFactory` to load processor modules
5. Processors use `ProcessorSettings` to get configuration values
6. `ApplicationManager` starts execution of the pipeline
7. Optional `WorkerPool` handles parallel processing tasks

## Key Concepts

- **RDF-based configuration**: All application configurations are stored in RDF (Turtle) files
- **Dependency Injection**: Components are loosely coupled through configuration
- **Event-driven processing**: Processors communicate through events
- **Pipeline architecture**: Data flows through a series of connected processors
- **Dynamic loading**: Processors and applications are loaded dynamically at runtime
