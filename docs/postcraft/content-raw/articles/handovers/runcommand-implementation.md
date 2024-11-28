# RunCommand Processor Implementation

## New Files

### Core Implementation
```
src/processors/unsafe/RunCommand.js                     # Main processor implementation
src/processors/unsafe/UnsafeProcessorsFactory.js       # Modified to include RunCommand
```

### Test Application
```
src/applications/test_runcommand/
├── about.md                                           # Documentation
├── config.ttl                                         # Processor configuration  
├── transmissions.ttl                                  # Pipeline definition
├── test-config.json                                   # Test configuration
├── simple.js                                          # Standalone test
└── data/
    └── output/
        ├── .gitkeep                                   # Ensure directory exists
        └── required-01.txt                            # Test verification file
```

### Tests
```
tests/unit/RunCommand.spec.js                          # Unit tests
tests/integration/runcommand.spec.js                   # Integration tests
```

## Implementation Notes

### Security Features
- Command whitelist via config
- Pattern blacklist for dangerous operations
- Command validation
- Execution timeout
- Buffer limits

### Configuration
Primary configuration in TTL:
```turtle
t:RunCommandConfig a trm:ServiceConfig ;
    trm:configKey t:runCommand ;
    trm:command "echo 'test'" ;            # Optional default command
    trm:allowedCommands ( "echo" "ls" ) ;  # Command whitelist
    trm:blockedPatterns ( "rm" ">" "|" ) ; # Pattern blacklist
```

### Message Interface
Input:
- message.command (optional) - overrides config command

Output:
- message.commandResult.stdout - command output
- message.commandResult.stderr - error output
- message.commandResult.code - exit code
- message.commandError - error message if failed

### Integration Points
- Inherits from base Processor
- Uses UnsafeProcessorsFactory
- Integrates with whiteboard system
- Works with FileWriter for output capture

### Testing Sequence
1. Run unit tests: `npm test -- --filter="RunCommand unit"`
2. Run integration: `npm test -- --filter="runcommand test"`
3. Test standalone: `node src/applications/test_runcommand/simple.js`

## Safety Notes
- Place in unsafe/ directory due to shell access
- Implement strict command validation
- Consider environment isolation
- Monitor for security implications
