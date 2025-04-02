# Ping Processor Technical Handover

## Core Components
1. `Ping.js`: Main processor with worker thread management
2. `PingWorker.js`: Interval timer implementation  
3. `FlowProcessorsFactory.js`: Integration point

## Configuration
```turtle
t:pingConfig a trm:ServiceConfig ;
    trm:interval 2000 ;     # MS between pings
    trm:count 5 ;           # Total pings (0=infinite)  
    trm:payload "TEST" ;    # Message content
    trm:killSignal "STOP" ; # Shutdown trigger
    trm:retryAttempts 3 ;   # Error retries
    trm:retryDelay 1000 .  # MS between retries
```

## Message Flow
1. Input: `{kill: "STOP"}` triggers shutdown
2. Output: 
   - Ping: `{ping: {count, timestamp, payload, status}}`
   - Complete: `{pingComplete: true, timestamp}`
   - Shutdown: `{pingStatus: "stopped", timestamp}`

## Error Handling
- Worker crashes: Automatic retry
- Max retries exceeded: Graceful shutdown
- Invalid config: Validation errors
- Kill signal: Clean worker termination

## Dependencies
- Node Worker Threads
- transmissions/src/processors/base/Processor.js
- transmissions/src/utils/Logger.js

## Test Coverage
Exercise:
- Basic pinging
- Error recovery
- Shutdown handling
- Config validation

## Integration Notes
1. Register in FlowProcessorsFactory
2. Place worker file in processors/flow/
3. Update ns.js with new terms
4. Add appropriate tests
