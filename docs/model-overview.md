# Model Overview

This document describes the core model classes in the Transmissions framework, located in `src/model/`.

## App.js

**Purpose**: Singleton application container that manages global state and RDF datasets.

**Responsibilities**:
- Maintains a collection of RDF datasets via the `Datasets` class
- Provides singleton access to the application instance
- Initializes application and session nodes in RDF with proper typing
- Merges RDF datasets into the target dataset
- Generates string representations showing dataset statistics

**Key Features**:
- Singleton pattern implementation
- RDF-based application and session modeling
- Dataset merging capabilities
- Contains commented code suggesting future refactoring to separate transmission, app, and config models

## Connector.js

**Purpose**: Establishes event-driven connections between processors in a transmission pipeline.

**Responsibilities**:
- Links processors by connecting output events from one processor to input of another
- Handles special cases for nested Transmission objects (connecting to first/last nodes)
- Provides error handling for missing processors
- Manages message flow with optional tagging and logging

**Key Features**:
- Extends EventEmitter for event-driven architecture
- Special handling for Transmission-to-Processor and Processor-to-Transmission connections
- Message tagging and flow logging
- Error reporting for configuration issues

## Datasets.js

**Purpose**: Manages a collection of labeled RDF datasets with loading and retrieval capabilities.

**Responsibilities**:
- Loads RDF datasets from file paths with graceful error handling
- Maintains a map of labeled datasets
- Creates empty datasets when files are missing or invalid
- Provides dataset retrieval by label

**Key Features**:
- Robust error handling - creates empty datasets on load failures
- File-based dataset loading via RDFUtils
- Label-based dataset organization
- Debug logging for load operations

## Processor.js

**Purpose**: Base interface class for all processor implementations in the framework.

**Responsibilities**:
- Extends ProcessorImpl to provide the standard processor interface
- Delegates core functionality to the engine implementation
- Provides property access methods for configuration values
- Serves as the contract for all concrete processor implementations

**Key Features**:
- Thin wrapper around ProcessorImpl
- Configuration property access via `getProperty()` and `getValues()`
- Standard processor lifecycle through `process()` method
- JSDoc documentation for interface clarity

## SlowableProcessor.js

**Purpose**: Processor variant that introduces configurable delays before processing.

**Responsibilities**:
- Extends base Processor with delay capabilities
- Implements artificial delays via `preProcess()` hook
- Uses configurable delay values from RDF configuration
- Maintains standard processor interface while adding timing control

**Key Features**:
- Configurable delay via `trn:delay` property (defaults to 50ms)
- Pre-processing hook for delay injection
- Useful for throttling, testing, or debugging scenarios

## Transmission.js

**Purpose**: Container that orchestrates multiple processors and their connections as a cohesive processing unit.

**Responsibilities**:
- Manages collections of processors and their interconnections
- Executes processor pipelines by triggering the first processor
- Supports nested transmissions with parent-child relationships
- Provides error handling with transmission stack traces
- Maintains processor registration and connection management

**Key Features**:
- Hierarchical structure with parent-child relationships
- Connector-based processor linking
- Error propagation with stack tracking
- Path-based identification for nested structures
- String representation showing structure and connections

## Whiteboard.js

**Purpose**: Global singleton cache and accumulator for cross-processor data sharing.

**Responsibilities**:
- Provides simple key-value storage accessible across processors
- Implements accumulator pattern for aggregating values
- Supports different accumulation types (string concatenation, array appending)
- Maintains global state throughout transmission execution

**Key Features**:
- Singleton pattern ensuring global access
- Key-value cache with `put()`/`get()` operations
- Flexible accumulator system supporting strings and arrays
- Automatic accumulator initialization based on type
- Debug string representation of cached data

## Architecture Notes

The model classes form a cohesive architecture:

- **App** serves as the top-level container and RDF dataset manager
- **Transmission** orchestrates processor execution and nesting
- **Processor** provides the base interface for all processing units
- **Connector** handles the event-driven communication between processors
- **Datasets** manages RDF data storage and retrieval
- **Whiteboard** enables cross-processor state sharing
- **SlowableProcessor** demonstrates processor extension patterns

The framework uses RDF extensively for configuration and modeling, with processors operating on messages that flow through event-driven connections.