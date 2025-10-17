# Basic Pipeline Operations

This document covers the fundamental operation of basic (non-nested) transmissions in the Transmissions framework.

## Overview

A basic transmission is a linear sequence of processors connected together, where data flows from one processor to the next. Each processor transforms the message and passes it to the next processor in the chain.

## Architecture Components

### TransmissionBuilder

The `TransmissionBuilder` is responsible for constructing transmission objects from RDF configuration data:

- **buildTransmissions()**: Scans the transmissions dataset for all entities of type `trn:Transmission`
- **constructTransmission()**: Creates a single transmission with its processors and connections
- **createNodes()**: Instantiates individual processors and registers them with the transmission
- **connectNodes()**: Establishes the pipeline connections between processors

### Transmission

The `Transmission` class manages the execution of a processor pipeline:

- **processors**: Object containing all registered processors (keyed by ID)
- **connectors**: Array of `Connector` objects defining the pipeline flow
- **process()**: Main execution method that initiates the pipeline

### Processor

Individual processing units that transform messages:

- Extend `ProcessorImpl` which provides event emission capabilities
- Implement a `process()` method for message transformation
- Emit 'message' events to trigger the next processor

### Connector

Links processors together in the pipeline:

- **fromName/toName**: Source and destination processor IDs
- **connect()**: Sets up event listeners between processors

## Configuration Format

Basic transmissions are defined in RDF/Turtle format:

```turtle
@prefix trn: <http://purl.org/stuff/transmissions/> .

:myTransmission a trn:Transmission ;
    trn:pipe (:processorA :processorB :processorC) .

:processorA a :ProcessorTypeA .
:processorB a :ProcessorTypeB .
:processorC a :ProcessorTypeC .
```

## Execution Flow

### 1. Construction Phase

```
TransmissionBuilder.buildTransmissions()
├── For each trn:Transmission in dataset:
│   ├── constructTransmission(transmissionID)
│   │   ├── Create new Transmission instance
│   │   ├── Extract pipe nodes using GrapoiHelpers.listToArray()
│   │   ├── createNodes(transmission, pipenodes)
│   │   │   └── For each node:
│   │   │       ├── Check if node type equals trn:Transmission (false for basic)
│   │   │       ├── createProcessor(processorType)
│   │   │       └── transmission.register(nodeID, processor)
│   │   └── connectNodes(transmission, pipenodes)
│   │       └── For each adjacent pair:
│   │           └── transmission.connect(leftNode, rightNode)
│   └── Set transmission.app reference
└── Return array of built transmissions
```

### 2. Runtime Execution

```
Transmission.process(message)
├── Identify first processor (connectors[0].fromName || first key)
├── Get processor instance: transmission.get(processorName)
├── If connectors exist (pipeline mode):
│   ├── Follow connector chain to find last processor
│   ├── Set up event listener on last processor for final result
│   ├── Start pipeline: firstProcessor.receive(message)
│   └── Return Promise that resolves with final message
└── Else (single processor):
    └── Return processor.receive(message)
```

### 3. Message Flow

```
processor1.receive(message)
├── ProcessorImpl.processMessage()
├── processor1.process(transformedMessage)
├── processor1.emit('message', result)
└── Triggers connector to processor2
    ├── processor2.receive(result)
    ├── processor2.process(result)
    ├── processor2.emit('message', result2)
    └── Continue until last processor
```

## Key Implementation Details

### Processor Registration

```javascript
transmission.register(processorName, instance)
```

- Stores processor in `transmission.processors[processorName]`
- No special handling for basic processors (not Transmission instances)

### Connection Setup

```javascript
// In Connector.connect()
fromProcessor.on('message', async (message) => {
    logger.log(`|-> ${ns.shortName(toProcessor.id)} a ${toProcessor.constructor.name}`)
    await toProcessor.receive(message)
})
```

### Error Handling

- Errors propagate up through the promise chain
- `transmissionStack` property tracks the execution path
- TransmissionBuilder includes depth limiting to prevent infinite recursion

## Example: Simple NOP Pipeline

**Configuration:**
```turtle
:simpleTest a trn:Transmission ;
    trn:pipe (:nop1 :nop2 :nop3) .

:nop1 a :NOP .
:nop2 a :NOP .
:nop3 a :NOP .
```

**Execution:**
1. Message sent to `nop1.receive(message)`
2. `nop1` processes and emits result
3. Connector forwards to `nop2.receive(result)`
4. `nop2` processes and emits result
5. Connector forwards to `nop3.receive(result)`
6. `nop3` processes and emits final result
7. Promise resolves with final result

## Performance Considerations

- **Sequential Processing**: Processors execute one after another
- **Event-Driven**: Uses Node.js EventEmitter for loose coupling
- **Memory**: Each processor maintains its own state and message queue
- **Worker Pool**: Optional parallel processing (if configured)

## Debugging

Use verbose mode to trace execution:

```bash
./trans -v myApp
```

Key log indicators:
- `+ ***** Construct Transmission`: Transmission being built
- `Creating processor`: Individual processor instantiation
- `> Connect`: Pipeline connections being established
- `|-> processorName a ProcessorType`: Message flow between processors