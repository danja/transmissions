# Transmissions Model Component Analysis

## Application.js
- **Purpose**: Represents an application instance with its configuration and RDF dataset
- **Key Features**:
  - Maintains RDF dataset for application configuration
  - Manages application identity (appNode) and session (sessionNode)
  - Provides method to merge in external datasets
  - Initializes application context with core triples

## Connector.js
- **Purpose**: Creates connections between processors in the pipeline
- **Key Features**:
  - Extends EventEmitter for message passing
  - Handles connections between regular processors
  - Supports nested transmission connections (connecting to first/last nodes)
  - Routes messages through the pipeline via event emission

## Processor.js
- **Purpose**: Base class for all processors in the system
- **Key Features**:
  - Message queue management with asynchronous processing
  - Configuration handling via ProcessorSettings
  - Pre/post-processing hooks
  - Property access from RDF configuration
  - Event-based message passing with deep copying
  - Tag management for debugging

## SlowableProcessor.js
- **Purpose**: Extends Processor with controllable processing delays
- **Key Features**:
  - Adds configurable delays to processing
  - Inherits core functionality from Processor
  - Useful for debugging or rate limiting

## Transmission.js
- **Purpose**: Represents a complete processing pipeline
- **Key Features**:
  - Manages collection of processors and their connections
  - Supports nested transmissions with parent/child relationships
  - Handles processor registration and connector creation
  - Maintains execution path information
  - Error propagation with transmission stack traces

## Whiteboard.js
- **Purpose**: Shared state container for accumulating data across processors
- **Key Features**:
  - Singleton pattern for global access
  - Accumulator management for different data types
  - String or array-based data aggregation
  - Designed for data sharing between pipeline steps

## System Architecture Observations
- **Event-Driven Processing**: The system uses events for message passing
- **Pipeline Configuration**: Transmissions define processor connections declaratively
- **RDF-Based Configuration**: Components read settings from RDF datasets
- **Hierarchical Design**: Support for nested transmissions enables complex flows
- **Message-Based Communication**: All components communicate via message objects
- **Whiteboard Pattern**: Shared state management via Whiteboard singleton
