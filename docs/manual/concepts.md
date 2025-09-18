# Core Concepts

This document provides an overview of the Transmissions framework architecture and core concepts.

## Architecture Overview

The Transmissions framework follows a message-driven, pipeline-based architecture where data flows through configurable processing chains. The system is built around three core concepts:

- **Messages**: Data objects that flow through the system
- **Processors**: Processing units that transform messages
- **Transmissions**: Configured pipelines of processors

## Messages

Messages are JavaScript objects that carry data through the system. They start with basic properties and are enriched by processors as they flow through pipelines.

### Message Structure

```javascript
{
  // Core framework properties
  "appPath": "/path/to/app",
  "workingDir": "/path/to/working/directory",
  "appRunStart": "2025-01-01T00:00:00.000Z",
  "tags": "processor1.processor2.processor3",

  // User data properties
  "content": "user data",
  "customField": "custom value",
  // ... additional properties added by processors
}
```

### Message Flow

1. Messages enter the system through transmission entry points
2. Each processor in the pipeline receives the message
3. Processors can read, modify, or add properties to messages
4. Modified messages are passed to the next processor
5. Messages can branch, merge, or trigger nested transmissions

## Processors

Processors are the fundamental processing units that operate on messages. Each processor performs a specific operation and passes results to the next stage.

### Processor Types

#### Data Processing
- **FileReader**: Read files into messages
- **FileWriter**: Write message content to files
- **SetText**: Set text content on messages
- **JSONProcessor**: Transform JSON data

#### Flow Control
- **GOTO**: Dynamic transmission execution
- **Choice**: Conditional logic and branching
- **ForEach**: Process arrays of data
- **Fork**: Split message flow into parallel paths

#### I/O Operations
- **HttpClient**: Make HTTP requests
- **HttpServer**: Handle HTTP requests
- **SPARQLSelect**: Query SPARQL endpoints
- **SPARQLUpdate**: Update SPARQL stores

#### Utilities
- **ShowMessage**: Debug message content
- **SetField**: Set message properties
- **NOP**: No operation (pipeline debugging)

### Processor Lifecycle

1. **Construction**: Processor created with RDF configuration
2. **Initialization**: Settings loaded from config
3. **Processing**: `process(message)` method called
4. **Emission**: Results emitted to next processor
5. **Cleanup**: Resources released when done

## Transmissions

Transmissions are configured pipelines that define how messages flow through processors. They are defined using RDF/Turtle syntax.

### Transmission Structure

```turtle
:my-transmission a :Transmission ;
    :pipe (
        :first-processor
        :second-processor
        :third-processor
    ) .
```

### Transmission Types

#### EntryTransmission
Automatically executed when an app starts:

```turtle
:main-flow a :EntryTransmission ;
    :pipe (:process-data :output-results) .
```

#### Callable Transmission
Available for dynamic execution by GOTO processors:

```turtle
:utility-flow a :Transmission ;
    :pipe (:helper-process) .
```

## Control Flow

The framework supports multiple control flow patterns:

### Linear Flow
Simple sequential processing:
```
Message → Processor A → Processor B → Processor C → Output
```

### Conditional Flow
Using Choice processors for branching:
```
Message → Choice → [True Path] → Output A
               → [False Path] → Output B
```

### Nested Flow
Using GOTO processors for sub-transmissions:
```
Message → GOTO → Sub-Transmission → Return → Continue
```

### Parallel Flow
Using Fork processors for concurrent processing:
```
Message → Fork → Path A → Merge
              → Path B → Merge → Output
```

## Configuration System

The framework uses RDF/Turtle for configuration, enabling:

- **Declarative Pipeline Definition**: Describe what to do, not how
- **Semantic Relationships**: Rich metadata and relationships
- **Modular Composition**: Reusable components and settings
- **Type Safety**: Strong typing through RDF schemas

### Configuration Hierarchy

1. **Processor Settings**: Individual processor configuration
2. **Transmission Configuration**: Pipeline definitions
3. **App Configuration**: Application-level settings
4. **Global Configuration**: Framework-wide defaults

## Execution Model

### App Startup
1. Load RDF configuration from `transmissions.ttl`
2. Build transmission objects and processor graphs
3. Identify EntryTransmissions for automatic execution
4. Initialize processors with their settings

### Message Processing
1. Create initial message object
2. Execute EntryTransmissions or specified transmission
3. Route messages through processor pipelines
4. Handle errors and logging throughout flow
5. Complete when all processors finish

### Resource Management
- Processors manage their own resources
- Messages are passed by reference for efficiency
- Cleanup occurs automatically at transmission end
- Long-running processors (servers) maintain state

## Extensibility

The framework is designed for extensibility:

### Custom Processors
- Extend the `Processor` base class
- Implement `process(message)` method
- Register in appropriate factory

### Custom Apps
- Create `transmissions.ttl` configuration
- Add custom processors if needed
- Follow established patterns

### Integration Points
- HTTP servers for web integration
- SPARQL endpoints for semantic web
- File system for data persistence
- Command line for scripting

This architecture enables building complex data processing workflows while maintaining modularity, reusability, and semantic clarity.