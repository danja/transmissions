# ComfyUI Integration Handover

## Architecture Delta
- ComfyUI uses GPU-optimized async node execution vs Transmissions' single-threaded EventEmitter pipeline
- Node configs in ComfyUI are JSON-based vs RDF/Turtle in Transmissions
- ComfyUI graph is non-linear with conditional execution vs sequential Transmission pipes

## Key Integration Points

### Message Adapters
```javascript
// Create bidirectional adapters between systems
class ComfyMessage extends ProcessProcessor {
  async process(message) {
    return {
      data: message.content,
      metadata: message.config
    }
  }
}
```

### Resource Management
- ComfyUI nodes manage GPU tensors
- Require cleanup hooks in Processor subclasses
- Use WorkerPool.js pattern for async node execution

### Graph Translation
```turtle
# ComfyUI node becomes
:node1 a :KSampler ;
    trm:config :samplerConfig .
```

## Integration Steps
1. Create adapter processors for message translation
2. Add parallel execution support to TransmissionRunner
3. Implement resource cleanup in Processor base class
4. Build graph format converter utility

## Review Points
- Monitor memory usage during cross-system messaging
- Test GPU resource allocation/cleanup
- Validate graph translation edge cases
- Check event propagation between systems

q1: Should we use the existing WorkerPool class or create a new async execution manager?

q2: What's the best approach for handling GPU tensor lifecycle in Transmissions processors?

q3: Do we need to modify the Connector class to support ComfyUI's execution model?

q4: Should graph translation be handled at runtime or as a preprocessing step?
