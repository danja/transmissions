# ComfyUI to Transmissions Integration Notes

## Key Architecture Differences

1. Workflow Definition
- ComfyUI: JSON graph with explicit node connections
- Transmissions: RDF pipeline definitions in Turtle format
  ```turtle
  :pipeline a trm:Pipeline ;
      trm:pipe (:step1 :step2) .
  ```

2. Message Flow
- ComfyUI: Asynchronous node execution based on input availability
- Transmissions: Sequential EventEmitter-based pipeline with structured messages

3. Execution Model  
- ComfyUI: Parallel GPU-optimized execution
- Transmissions: Single-threaded processor chain

## Integration Points

1. Workflow Mapping
- Each ComfyUI node maps to a Transmissions Processor
- Node connections become Connector instances
- Node configs map to processor-config.ttl entries

2. Message Translation
```javascript
// ComfyUI node output
{data: tensor, metadata: {...}}

// Needs conversion to Transmissions format
{content: buffer, type: 'image/tensor'}
```

3. Key Files
- src/engine/Transmission.js - Core pipeline execution
- src/engine/Connector.js - Message passing
- src/processors/base/Processor.js - Base processor class

## Next Steps

1. Create adapter classes for translating between message formats
2. Implement parallel execution in Transmission.js
3. Add GPU resource management
4. Create workflow format converter

Note: Pay special attention to cleanup and resource handling when bridging between the two execution models.
