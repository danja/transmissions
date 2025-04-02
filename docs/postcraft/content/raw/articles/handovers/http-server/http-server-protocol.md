# HTTP Server Message Protocol Specification

## Worker Thread Message Protocol

### Server → Worker Messages

#### Start Server
```javascript
{
  type: 'start',
  config: {
    port: number,          // Server port (default: 3000)
    basePath: string,      // Base URL path (default: '/')
    staticPath: string,    // Path to static files
    cors: boolean,         // Enable CORS (default: false) 
    timeout: number,       // Request timeout in ms (default: 30000)
    maxRequestSize: string // Max request size (default: '1mb')
    rateLimit: {
      windowMs: number,    // Time window for rate limiting (default: 15min)
      max: number         // Max requests per window (default: 100)
    }
  }
}
```

#### Stop Server
```javascript
{
  type: 'stop'
}
```

### Worker → Server Messages 

#### Status Updates
```javascript
{
  type: 'status',
  status: 'running' | 'stopped',
  port?: number  // Included only with 'running' status
}
```

#### Error Reporting
```javascript
{
  type: 'error',
  error: string  // Error message
}
```

## Message Flow

1. Server startup:
   - Server sends 'start' message with config
   - Worker responds with 'status' message ('running')

2. Normal operation:
   - Worker sends 'error' messages as needed
   
3. Shutdown:
   - Server sends 'stop' message
   - Worker cleans up and responds with 'status' message ('stopped')
   - Worker terminates

## Error Handling

- All errors from the worker thread are sent via 'error' messages
- Worker continues running after non-fatal errors
- Fatal errors trigger worker termination after error message
