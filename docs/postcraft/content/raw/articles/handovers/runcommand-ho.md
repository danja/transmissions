# RunCommand Processor Handover

## Purpose & Security Model
RunCommand executes shell commands with security constraints:
- Allowlist of permitted commands
- Blocklist of dangerous patterns
- Configurable timeout
- No shell expansion/interpolation

## Configuration
```javascript
{
  allowedCommands: ['echo', 'ls'], // Whitelist
  blockedPatterns: ['rm', '|', ';'], // Dangerous patterns
  timeout: 5000, // ms before termination
  simples: true // Flag for simple mode
}
```

## Key Files
- `/src/processors/unsafe/RunCommand.js` - Main implementation
- `/src/applications/test_runcommand/` - Test application
- `/tests/unit/RunCommand.spec.js` - Unit tests

## Key Methods
- `validateCommand()` - Security checks
- `executeCommand()` - Executes via child_process.exec
- `initializeSecurity()` - Loads security config
- `process()` - Main processor method

## RDF Representation
```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix trm: <http://purl.org/stuff/transmission/> .
@prefix t: <http://hyperdata.it/transmissions/> .

t:RunCommandConfig a trm:ServiceConfig ;
    rdfs:label "Run command configuration" ;
    trm:allowedCommands ("echo" "ls") ;
    trm:blockedPatterns ("rm" "|" ";") ;
    trm:timeout "5000"^^xsd:integer .
```

## Usage Example
```javascript
const runCommand = new RunCommand({
  allowedCommands: ['echo'],
  timeout: 5000
});

const message = { command: 'echo "Hello"' };
await runCommand.process(message);
```

## Current Status
- Implemented: Basic security, timeout, allowlist/blocklist
- Needed: stdin handling, env vars, working dir config
- Issues: Timeout test reliability

## Critical Points
- Always validate commands before execution
- Never allow shell expansion
- Maintain strict allowlist enforcement
- Handle timeouts gracefully
- Log all command executions

## Recent Changes
1. Added timeout handling
2. Improved security validation
3. Added RDF config support
4. Enhanced error handling

## Known Limitations
- No stdin support
- Limited environment control
- No shell features (pipes, redirects)
- Basic error reporting
