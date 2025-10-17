# Transmissions Framework Manual

Transmissions is a flexible framework for building data processing pipelines using RDF configuration. It enables the creation of modular, composable workflows that can transform, route, and process data through configurable processor chains.

## Key Features

- **RDF-Based Configuration**: Define processing pipelines using RDF/Turtle syntax
- **Modular Processors**: Extensible library of processing components
- **Flow Control**: Dynamic routing, conditional logic, and nested execution
- **Message-Driven Architecture**: Process data through message passing between processors
- **Flexible I/O**: Support for files, HTTP, SPARQL endpoints, and more

## Getting Started

Transmissions processes data by executing *transmissions* - configured pipelines of processors that transform messages as they flow through the system. Each processor performs a specific operation and passes the result to the next processor in the pipeline.

## Manual Contents

### User Documentation

#### Core Concepts
- [Transmissions Overview](user/overview.html) - Introduction to terminology and program flow
- [Architecture & Concepts](user/concepts.html) - Framework architecture, messages, processors, and transmissions
- [Creating Applications](user/apps.html) - How to build complete Transmissions applications

#### Flow Control
- [Flow Control Overview](user/flow.html) - High-level guide to flow control processors and patterns
- [GOTO Processor](user/goto.html) - Dynamic transmission execution and routing

### Developer Documentation

#### Architecture Deep Dives
- [Engine Overview](dev/engine.html) - Core engine components and execution infrastructure
- [Model Overview](dev/model.html) - Core model classes and their responsibilities
- [Basic Pipeline Processing](dev/pipeline-basic.html) - Understanding simple transmission execution
- [Nested Pipeline Processing](dev/pipeline-nested.html) - Working with nested transmissions and complex workflows

#### Extending the Framework
- [Creating Processors](dev/processors.html) - How to develop custom processors

---
*Last updated: 2025-10-17*

## Example

```turtle
# A simple transmission that processes a file
:my-transmission a :Transmission ;
    :pipe (
        :read-file
        :transform-data
        :write-output
    ) .

:read-file a :FileReader ;
    :settings [ :filename "input.json" ] .

:transform-data a :JSONProcessor ;
    :settings [ :operation "transform" ] .

:write-output a :FileWriter ;
    :settings [ :filename "output.json" ] .
```

This creates a three-stage pipeline that reads a JSON file, transforms the data, and writes the result to a new file.

## Architecture

Transmissions follows a message-driven architecture where:
1. Messages flow through processor pipelines
2. Each processor can modify the message
3. Processors emit results to the next stage
4. Flow control processors enable dynamic routing and conditional logic

The framework supports both simple linear pipelines and complex workflows with branching, merging, and nested execution patterns.