# Engine Overview

The Transmissions engine provides the core execution infrastructure for processing data through chains of connected processors. This document describes each engine component and its role in the framework.

## Core Components

### AbstractProcessorFactory
**Purpose**: Central processor factory that routes processor creation requests to specialized factory modules.

- Implements factory pattern for processor instantiation
- Maintains registry of all processor group factories (System, FS, Markup, Text, etc.)
- Uses fallback pattern - attempts creation through each factory until one succeeds
- Returns null if no factory can create the requested processor type
- Acts as the single entry point for all processor creation

### AppManager
**Purpose**: Application lifecycle manager responsible for initialization, configuration, and execution orchestration.

Key responsibilities:
- Environment setup (loads .env files via dotenvx)
- Application path resolution and dataset loading (transmissions.ttl, config.ttl, target.ttl)
- Module loader initialization for dynamic processor loading
- Worker pool initialization when configured via environment variables
- Orchestrates transmission execution through TransmissionBuilder
- Provides application context to all processors
- Handles cleanup including worker pool termination

### ModuleLoader
**Purpose**: Dynamic module loading system supporting both Node.js and browser environments.

Features:
- Classpath-based module resolution with fallback paths
- Module caching for performance
- Browser/Node.js environment detection
- Error aggregation for debugging failed loads
- Cache management and path addition capabilities

### ModuleLoaderFactory
**Purpose**: Factory for creating configured ModuleLoader instances.

- Singleton pattern for module loader management
- Creates application-specific loaders with proper classpaths
- Handles environment-specific path resolution
- Provides both general and application-specific loader creation

### ProcessorImpl
**Purpose**: Base class for all processors providing common functionality and message processing infrastructure.

Core features:
- Property resolution from multiple sources (message, config, settings)
- Message queuing and sequential processing
- Pre/post-processing hooks with log level management
- Worker pool integration (currently falls back to sequential processing)
- Event emission capabilities
- Property lookup hierarchy: message → simpleConfig → RDF settings
- Message tagging for processing chain tracking

### ProcessorSettings
**Purpose**: RDF-based configuration system for processors.

Capabilities:
- Multi-dataset property resolution (target → transmissions → config)
- RDF list handling for complex configurations
- Grapoi-based RDF graph navigation
- Fallback value support
- Property value extraction from multiple RDF datasets

### TransmissionBuilder
**Purpose**: Constructs transmission processing chains from RDF configuration.

Key functions:
- Parses RDF transmission definitions
- Creates processor instances via AbstractProcessorFactory
- Handles nested transmission references
- Connects processors in pipeline chains
- Manages processor configuration and settings
- Implements caching and nesting depth protection

### TransmissionWorker
**Purpose**: Worker thread implementation for parallel processor execution.

Features:
- Worker thread message handling
- Message pass-through processing (basic implementation)
- Processing metadata injection
- Error handling and result communication
- Currently provides framework for future processor parallelization

### WorkerPool
**Purpose**: Manages pool of worker threads for parallel processing.

Capabilities:
- Worker lifecycle management
- Message queuing and dispatch
- Load balancing across available workers
- Completion callback handling
- Graceful termination and cleanup
- Currently used as fallback infrastructure (processors run sequentially)

## Architecture Notes

### Processing Flow
1. AppManager initializes application and loads datasets
2. TransmissionBuilder parses RDF configurations and creates processor chains
3. ProcessorImpl instances handle message processing with property resolution
4. Worker infrastructure provides framework for future parallelization

### Configuration Hierarchy
Properties are resolved in this order:
1. Message properties (runtime values)
2. Simple config (programmatic configuration)
3. RDF settings (target.ttl → transmissions.ttl → config.ttl)

### Module Loading Strategy
- Application processors (custom) take precedence over core processors
- Classpath-based resolution with fallback paths
- Environment-specific loading (browser vs Node.js)

### Worker Integration Status
Worker pool infrastructure is implemented but processors currently fall back to sequential processing. The worker system provides the foundation for future parallel processing capabilities.