# Processor Development Guide

## Structure
1. Create processor class extending base Processor
2. Implement process() method
3. Create factory class extending AbstractProcessorFactory
4. Add processor to factory registry

## Configuration
1. Define RDF schema in config.ttl
2. Access settings via getPropertyFromMyConfig()
3. Use ns.js for consistent property URIs

## Message Handling
1. Receive message in process()
2. Validate required fields
3. Process data
4. Emit modified message

## Testing
1. Create unit tests for processor methods
2. Add integration tests for pipeline usage
3. Test error conditions
4. Verify configuration handling

## Best Practices
1. Use async/await consistently
2. Log meaningful debug messages
3. Handle all error conditions
4. Document public methods
5. Follow existing naming conventions
6. Keep process() method focused