# Worker Infrastructure Overview

The worker infrastructure in the Transmissions framework operates as a parallel processing system for handling processor messages. Here's how it currently works:

## Core Components

### 1. **WorkerPool.js** - Central Worker Management
- **Location**: `src/engine/WorkerPool.js`
- **Role**: Manages a pool of worker threads and message dispatch
- **Key Features**:
  - Creates N worker threads using Node.js `worker_threads`
  - Maintains message queue and worker availability tracking
  - Uses Map-based callback system to avoid function cloning issues
  - Assigns unique message IDs for completion tracking

```javascript
// Key operations:
constructor(module, size) // Creates worker pool with specified module
enqueueMessage(messageData) // Adds message to queue with completion callback
dispatch() // Assigns queued messages to idle workers
markWorkerIdle(workerWrapper, result) // Handles worker completion
terminate() // Cleans up all worker threads
```

### 2. **ProcessorImpl.js** - Worker Integration Point
- **Location**: `src/engine/ProcessorImpl.js`
- **Role**: Integrates worker processing into the processor lifecycle
- **Current State**: Falls back to sequential processing (lines 210-225)
- **Key Features**:
  - Detects if app has worker pool configured
  - Handles pre/post processing in main thread
  - Would send core `process()` method to workers (when fully implemented)
  - Uses Promise.all() to wait for worker completion

### 3. **AppManager.js** - Worker Lifecycle Management
- **Location**: `src/engine/AppManager.js`
- **Role**: Initializes and terminates worker pool
- **Key Operations**:
  - `initWorkerPool()` (lines 83-105): Creates worker pool from environment config
  - `start()` method: Terminates workers when app completes (lines 144-147)

### 4. **transmission-worker.js** - Worker Thread Implementation
- **Location**: `examples/worker/transmission-worker.js`
- **Role**: Actual worker thread that processes messages
- **Current Limitation**: Only does message pass-through, doesn't execute real processor logic

## Configuration System

### Environment Variables (.env)
```bash
TRANSMISSIONS_USE_WORKERS=true
TRANSMISSIONS_WORKER_MODULE=./examples/worker/transmission-worker.js
TRANSMISSIONS_WORKER_POOL_SIZE=5
```

## Message Flow Architecture

### 1. **Initialization Phase**
```
AppManager.initWorkerPool() 
→ Reads env variables
→ Creates WorkerPool with specified module and size
→ WorkerPool spawns N worker threads
→ Each worker loads transmission-worker.js
```

### 2. **Processing Phase**
```
ProcessorImpl.executeQueue()
→ Checks for app.workerPool
→ [CURRENT]: Falls back to sequential processing
→ [INTENDED]: Create Promise per message
→ [INTENDED]: WorkerPool.enqueueMessage() with completion callback
→ [INTENDED]: Worker processes message and returns result
→ [INTENDED]: Completion callback resolves Promise
→ [INTENDED]: Promise.all() waits for all workers to complete
```

### 3. **Completion Phase**
```
AppManager.start() completes
→ Calls workerPool.terminate()
→ All worker threads terminated
→ App exits cleanly
```

## Current Limitations & Issues

### 1. **Incomplete Processor Execution**
- Workers only do message pass-through without real processor logic
- `ShowMessage` doesn't display, `FileReader` doesn't read files
- Transmission chains break because processors don't perform their actual work

### 2. **Module Loading Challenge**
- Workers can't easily load complex processor classes
- Dependency injection and app context not available in worker threads
- Each processor has different requirements (file system, RDF datasets, etc.)

### 3. **Fallback Implementation**
- Current code detects workers but falls back to sequential processing
- Maintains functionality while acknowledging worker limitations
- TODO comment indicates need for architectural redesign

## Files Involved

### Core Infrastructure
- `src/engine/WorkerPool.js` - Worker pool management
- `src/engine/ProcessorImpl.js` - Worker integration point  
- `src/engine/AppManager.js` - Lifecycle management

### Worker Implementation
- `examples/worker/transmission-worker.js` - Basic worker thread
- `examples/worker/example-worker.js` - Original example (incompatible)

### Configuration
- `.env` - Worker configuration variables

## Technical Challenges for Full Implementation

1. **Processor Instantiation**: Workers need to create actual processor instances with proper dependency injection
2. **App Context**: Workers need access to app configuration, datasets, and utilities
3. **Module Resolution**: Dynamic loading of processor classes in worker context
4. **State Management**: Handling processor settings and configuration in workers
5. **Error Handling**: Proper error propagation from worker threads

The infrastructure foundation is solid with proper completion signaling and resource cleanup, but requires significant architectural work to support full processor execution in worker threads.