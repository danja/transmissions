# Nested Pipeline Operations

This document covers the operation of nested transmissions in the Transmissions framework, where transmissions can contain other transmissions as processors.

## Overview

Nested transmissions allow complex, hierarchical data processing workflows where entire transmission pipelines can be embedded as single nodes within parent transmissions. This enables modular, reusable pipeline components and sophisticated branching/merging patterns.

## Architecture Enhancements for Nesting

### TransmissionBuilder Recursion

The `TransmissionBuilder` supports recursive transmission construction:

- **Transmission Detection**: Identifies when a pipeline node has type `trn:Transmission`
- **Recursive Construction**: Calls `constructTransmission()` recursively for nested transmissions
- **Depth Limiting**: Prevents infinite recursion with `MAX_NESTING_DEPTH = 10`
- **Caching**: Uses `transmissionCache` to avoid rebuilding the same transmission multiple times

### Transmission Hierarchies

Nested transmissions form parent-child relationships:

- **parent**: Reference to containing transmission
- **children**: Set of nested transmission instances
- **path**: Array showing the nesting path from root
- **depth**: Current nesting level

### Enhanced Connector Logic

The `Connector` class handles three connection scenarios:

1. **Processor → Processor**: Standard connection (basic pipeline)
2. **Transmission → Processor**: Connects last node of transmission to processor
3. **Processor → Transmission**: Connects processor to first node of transmission
4. **Transmission → Transmission**: Connects last node of source to first node of target

### Transmission Interface Methods

New methods for nested transmission operations:

- **getFirstNode()**: Returns the first processor in the transmission pipeline
- **getLastNode()**: Returns the last processor in the transmission pipeline

## Configuration Format

Nested transmissions use the same RDF format but include transmission references:

```turtle
@prefix trn: <http://purl.org/stuff/transmissions/> .

# Main transmission with nested sub-transmissions
:mainPipeline a trn:Transmission ;
    trn:pipe (:subPipeA :subPipeB :subPipeC) .

# Nested transmission definitions
:subPipeA a trn:Transmission ;
    trn:pipe (:s1 :s2 :s3) .

:subPipeB a trn:Transmission ;
    trn:pipe (:s3 :s104 :s105) .

:subPipeC a trn:Transmission ;
    trn:pipe (:s3 :s204 :s205) .

# Individual processors
:s1 a :NOP .
:s2 a :NOP .
:s3 a :NOP .
:s104 a :NOP .
:s105 a :NOP .
:s204 a :NOP .
:s205 a :ShowTransmission .
```

## Execution Flow

### 1. Construction Phase (Recursive)

```
TransmissionBuilder.buildTransmissions()
├── For each top-level trn:Transmission:
│   └── constructTransmission(transmissionID)
│       ├── Create Transmission instance
│       ├── Extract pipe nodes
│       ├── createNodes(transmission, pipenodes)
│       │   └── For each node:
│       │       ├── Check: processorType.equals(ns.trn.Transmission)
│       │       ├── If TRUE (nested transmission):
│       │       │   ├── nestedTx = constructTransmission(node) [RECURSIVE]
│       │       │   ├── nestedTx.parent = currentTransmission
│       │       │   ├── nestedTx.path = [...parent.path, nodeName]
│       │       │   └── transmission.register(nodeID, nestedTx)
│       │       └── If FALSE: create regular processor
│       └── connectNodes() - handles mixed processor/transmission connections
└── Return transmission hierarchy
```

### 2. Runtime Execution with Nesting

```
MainTransmission.process(message)
├── Find first processor: "subPipeA" (a Transmission)
├── Setup Promise with nested transmission handling:
│   ├── Follow connector chain to find last processor
│   ├── If lastProcessor instanceof Transmission:
│   │   └── actualLastProcessor = lastProcessor.getLastNode()
│   ├── Setup listener: actualLastProcessor.on('message', resolve)
│   ├── If firstProcessor instanceof Transmission:
│   │   └── actualFirstProcessor = firstProcessor.getFirstNode()
│   └── Start: actualFirstProcessor.receive(message)
└── Message flows through nested hierarchy
```

### 3. Nested Message Flow

```
message → MainTransmission
├── pipeA (Transmission)
│   ├── s1.receive(message)
│   ├── s1 → s2 → s3
│   └── s3.emit('message', result1)
├── Connector: pipeA.lastNode → pipeB.firstNode
├── pipeB (Transmission)
│   ├── s3.receive(result1)
│   ├── s3 → s104 → s105
│   └── s105.emit('message', result2)
├── Connector: pipeB.lastNode → pipeC.firstNode
└── pipeC (Transmission)
    ├── s3.receive(result2)
    ├── s3 → s204 → s205
    └── s205.emit('message', finalResult)
```

## Key Implementation Details

### Transmission Detection

```javascript
// In TransmissionBuilder.createNodes()
const isTransmissionReference = processorType.equals(ns.trn.Transmission)

if (isTransmissionReference) {
    const nestedTransmission = await this.constructTransmission(
        transmissionsDataset,
        node,  // Critical: pass node (transmission ID), not processorType
        configDataset
    )
    transmission.register(node.value, nestedTransmission)
}
```

### Parent-Child Relationships

```javascript
// In Transmission.register()
if (processor instanceof Transmission) {
    processor.parent = this
    processor.path = [...this.path, processorName]
    this.children.add(processor)
}
```

### Node Access Methods

```javascript
// Get first processor in transmission
getFirstNode() {
    const processorName = this.connectors[0]?.fromName || Object.keys(this.processors)[0]
    return this.get(processorName)
}

// Get last processor in transmission
getLastNode() {
    const processorNames = Object.keys(this.processors)
    for (const name of processorNames) {
        const isSource = this.connectors.some(c => c.fromName === name)
        if (!isSource) {
            return this.get(name)
        }
    }
    // Fallback to last processor
    const lastProcessorName = processorNames[processorNames.length - 1]
    return this.get(lastProcessorName)
}
```

### Enhanced Connector Logic

```javascript
// In Connector.connect()
if (fromProcessor instanceof Transmission && toProcessor instanceof Transmission) {
    // Transmission → Transmission
    const lastNode = fromProcessor.getLastNode()
    const firstNode = toProcessor.getFirstNode()
    lastNode.on('message', async (message) => {
        await firstNode.receive(message)
    })
} else if (fromProcessor instanceof Transmission) {
    // Transmission → Processor
    const lastNode = fromProcessor.getLastNode()
    lastNode.on('message', async (message) => {
        await toProcessor.receive(message)
    })
} else if (toProcessor instanceof Transmission) {
    // Processor → Transmission
    fromProcessor.on('message', async (message) => {
        const firstNode = toProcessor.getFirstNode()
        await firstNode.receive(message)
    })
}
```

## Advanced Patterns

### 1. Sequential Nested Pipelines

```turtle
:workflow a trn:Transmission ;
    trn:pipe (:dataExtraction :dataTransformation :dataOutput) .
```

Each step is a complete transmission with its own internal pipeline.

### 2. Parallel Processing Branches

```turtle
:parallelProcessor a trn:Transmission ;
    trn:pipe (:input :branchA :branchB :branchC :aggregator) .
```

Where branchA, branchB, branchC are parallel transmission branches.

### 3. Conditional Routing

```turtle
:conditionalFlow a trn:Transmission ;
    trn:pipe (:router :pathA :pathB :merger) .
```

Router determines which nested transmission path to follow.

## Error Handling & Debugging

### Transmission Stack Tracking

```javascript
// Error propagation includes nesting information
error.transmissionStack = error.transmissionStack || []
error.transmissionStack.push(this.id)
```

### Depth Limiting

```javascript
if (++this.currentDepth > this.MAX_NESTING_DEPTH) {
    throw new Error(`Maximum transmission nesting depth of ${this.MAX_NESTING_DEPTH} exceeded`)
}
```

### Debug Output

Verbose mode shows nested construction:

```
+ ***** Construct Transmission :  <main-transmission>
*** Constructing nested transmission for node: pipeA
+ ***** Construct Transmission :  <pipeA>
Creating processor: s1 Type: NOP
*** Registering nested transmission: pipeA -> pipeA
```

## Performance Considerations

### Memory Usage
- Each nested transmission maintains its own processor registry
- Parent-child references create object graphs (managed with WeakSet for children)
- Message objects pass through multiple transmission layers

### Execution Overhead
- Additional event listener setup for transmission boundaries
- Recursive construction during build phase
- Path tracking for debugging and error reporting

### Optimization Opportunities
- Transmission caching prevents duplicate construction
- Depth limiting prevents runaway recursion
- Event-driven architecture enables asynchronous processing

## Testing Nested Transmissions

Example test execution:

```bash
./trans -v multi-pipe
```

Expected flow indicators:
- `*** Constructing nested transmission`: Recursive build
- `*** Registering nested transmission`: Hierarchy establishment
- `|-> pipeA a Transmission`: Nested transmission execution
- Processor tags show nesting: `[s1.s2.s3.s3.s104]` indicates path through hierarchy

## Best Practices

1. **Limit Nesting Depth**: Keep hierarchies shallow for maintainability
2. **Modular Design**: Make nested transmissions reusable across workflows
3. **Clear Naming**: Use descriptive IDs that indicate the transmission's purpose
4. **Error Boundaries**: Handle errors at appropriate transmission levels
5. **Testing**: Test nested transmissions both individually and as part of larger workflows