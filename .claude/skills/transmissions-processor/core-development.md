# Core Processor Development Guide

## Overview

Core processor development means creating processors directly in the Transmissions framework at `/home/danny/hyperdata/transmissions/src/processors/` and registering them in `AbstractProcessorFactory.js`.

## Advantages

- **Global availability**: All apps can use the processor
- **Framework integration**: Full debugging and testing support
- **Contribution path**: Easy to contribute back to framework
- **Consistent patterns**: Follow established processor conventions

## Best For

- Reusable processors (multiple apps)
- General-purpose transformations
- Framework contributions
- Standard operations

## Processor Groups

Processors are organized by category:

```
src/processors/
├── flow/          # Flow control (ForEach, Fork, Choice, GOTO)
├── fs/            # File system operations
├── http/          # HTTP client/server
├── json/          # JSON processing
├── markup/        # HTML/Markdown conversion
├── rdf/           # RDF operations
├── sparql/        # SPARQL queries/updates
├── text/          # Text transformations
├── util/          # Utility processors
└── your-group/    # Your processor group
```

## Step-by-Step: New Processor Group

### 1. Copy Example Group

```bash
cd /home/danny/hyperdata/transmissions

# Copy example group
cp -r src/processors/example-group src/processors/my-group

# Rename files
mv src/processors/my-group/Example.js src/processors/my-group/MyProcessor.js
mv src/processors/my-group/ExampleProcessorsFactory.js src/processors/my-group/MyGroupProcessorsFactory.js
```

### 2. Implement Processor

Edit `src/processors/my-group/MyProcessor.js`:

```javascript
// src/processors/my-group/MyProcessor.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'

/**
 * @class MyProcessor
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Performs specific transformation on messages.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.inputField`** - Field to read from message
 * * **`ns.trn.outputField`** - Field to write result to
 * * **`ns.trn.operation`** - Operation to perform (default: "transform")
 *
 * #### __*Input*__
 * * **`message[inputField]`** - Input data to process
 *
 * #### __*Output*__
 * * **`message[outputField]`** - Processed result
 *
 * #### __*Behavior*__
 * * Reads from inputField, processes, writes to outputField
 * * Skips processing if message.done is true
 *
 * #### __*Side Effects*__
 * * Modifies message object
 * * Logs processing information
 */
class MyProcessor extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug('MyProcessor.process')

        // Skip if spawning processor completion
        if (message.done) {
            return this.emit('message', message)
        }

        // Get configuration with defaults
        const inputField = super.getProperty(ns.trn.inputField, 'input')
        const outputField = super.getProperty(ns.trn.outputField, 'output')
        const operation = super.getProperty(ns.trn.operation, 'transform')

        // Process input
        const input = message[inputField]

        if (!input) {
            logger.warn(`MyProcessor: No input found in field '${inputField}'`)
            return this.emit('message', message)
        }

        // Perform operation
        let result
        switch (operation) {
            case 'transform':
                result = this.transformData(input)
                break
            case 'validate':
                result = this.validateData(input)
                break
            default:
                logger.warn(`Unknown operation: ${operation}`)
                result = input
        }

        // Set output
        message[outputField] = result

        // Emit processed message
        return this.emit('message', message)
    }

    transformData(input) {
        // Your transformation logic
        return input.toString().toUpperCase()
    }

    validateData(input) {
        // Your validation logic
        return { valid: true, data: input }
    }
}

export default MyProcessor
```

### 3. Update Factory

Edit `src/processors/my-group/MyGroupProcessorsFactory.js`:

```javascript
// src/processors/my-group/MyGroupProcessorsFactory.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import MyProcessor from './MyProcessor.js'
// Import additional processors here

class MyGroupProcessorsFactory {
    static createProcessor(type, config) {
        // Register MyProcessor
        if (type.equals(ns.trn.MyProcessor)) {
            return new MyProcessor(config)
        }

        // Add more processors
        // if (type.equals(ns.trn.AnotherProcessor)) {
        //     return new AnotherProcessor(config)
        // }

        return false
    }
}

export default MyGroupProcessorsFactory
```

### 4. Register in AbstractProcessorFactory

Edit `src/engine/AbstractProcessorFactory.js`:

```javascript
// Add import at top (around line 27)
import MyGroupProcessorsFactory from '../processors/my-group/MyGroupProcessorsFactory.js'

// In createProcessor method (around line 50)
static createProcessor(type, app) {
    if (!type) {
        throw new Error(`Processor type undefined (typo in 'transmission.ttl'..?)`)
    }

    // Add your factory early in the chain for priority
    var processor = MyGroupProcessorsFactory.createProcessor(type, app)
    if (processor) return processor

    // ... existing factories continue ...
}
```

### 5. Create Test App

```bash
mkdir -p src/apps/test/myprocessor-test
```

Create `src/apps/test/myprocessor-test/transmissions.ttl`:

```turtle
@prefix : <http://purl.org/stuff/transmissions/> .

:test a :EntryTransmission ;
    :pipe (:setup :test-processor :show-result) .

:setup a :SetField ;
    :settings [
        :field "testInput" ;
        :value "hello world"
    ] .

:test-processor a :MyProcessor ;
    :settings [
        :inputField "testInput" ;
        :outputField "testOutput" ;
        :operation "transform"
    ] .

:show-result a :ShowMessage .
```

Create `src/apps/test/myprocessor-test/about.md`:

```markdown
# MyProcessor Test

## Runner
```sh
./trans test.myprocessor-test
```

## Description
Tests MyProcessor transformation functionality.
```

### 6. Test

```bash
# Run test
./trans test.myprocessor-test -v

# Should see output with testOutput: "HELLO WORLD"
```

## Step-by-Step: Add to Existing Group

### 1. Create Processor File

```bash
# Example: adding to util group
touch src/processors/util/MyNewProcessor.js
```

### 2. Implement Processor

Same as above, adjust import paths if needed.

### 3. Update Existing Factory

Edit `src/processors/util/UtilProcessorsFactory.js`:

```javascript
// Add import
import MyNewProcessor from './MyNewProcessor.js'

// In createProcessor method
if (type.equals(ns.trn.MyNewProcessor)) {
    return new MyNewProcessor(config)
}
```

No need to modify AbstractProcessorFactory - group already registered.

## Common Processor Patterns

### Simple Transformation

```javascript
async process(message) {
    const input = message.content
    const result = this.transform(input)
    message.content = result
    return this.emit('message', message)
}
```

### Async Operations

```javascript
async process(message) {
    try {
        const result = await this.fetchData(message.url)
        message.result = result
        return this.emit('message', message)
    } catch (error) {
        logger.error(`Error: ${error.message}`)
        message.error = error.message
        return this.emit('message', message)
    }
}
```

### Nested Path Access

Use `JSONUtils` for deep property access:

```javascript
import JSONUtils from '../../utils/JSONUtils.js'

async process(message) {
    // Get nested property
    const value = JSONUtils.get(message, 'data.user.profile.name')

    // Set nested property
    JSONUtils.set(message, 'results.processed.value', value.toUpperCase())

    return this.emit('message', message)
}
```

### State Management

```javascript
class StatefulProcessor extends Processor {
    constructor(config) {
        super(config)
        this.cache = new Map()
    }

    async process(message) {
        const key = message.id

        if (this.cache.has(key)) {
            message.cached = true
            message.data = this.cache.get(key)
        } else {
            message.data = await this.computeExpensiveResult(message)
            this.cache.set(key, message.data)
        }

        return this.emit('message', message)
    }
}
```

## Configuration Patterns

### Required Settings

```javascript
const required = super.getProperty(ns.trn.requiredField)
if (!required) {
    throw new Error('requiredField is required')
}
```

### Optional with Defaults

```javascript
const optional = super.getProperty(ns.trn.optionalField, 'default-value')
```

### Complex Configuration

```javascript
const config = {
    host: super.getProperty(ns.trn.host, 'localhost'),
    port: super.getProperty(ns.trn.port, 3000),
    secure: super.getProperty(ns.trn.secure, false)
}
```

## Documentation

### JSDoc Template

```javascript
/**
 * @class ProcessorName
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Brief description of what the processor does.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.setting1`** - Description of setting
 * * **`ns.trn.setting2`** - Description of setting (default: "value")
 *
 * #### __*Input*__
 * * **`message.field1`** - Expected input field
 * * **`message.field2`** - Another input field
 *
 * #### __*Output*__
 * * **`message.result`** - Output field added to message
 * * **`message.metadata`** - Additional metadata
 *
 * #### __*Behavior*__
 * * Describe key behaviors
 * * Note any side effects
 * * Mention error handling
 *
 * #### __*Side Effects*__
 * * List any side effects
 * * File writes, external calls, etc.
 *
 * #### __*Example Usage*__
 * ```turtle
 * :myProcessor a :ProcessorName ;
 *     :settings [
 *         :setting1 "value" ;
 *         :setting2 "other"
 *     ] .
 * ```
 */
```

## Testing Strategies

### Unit Tests

```javascript
// tests/unit/processors/MyProcessor.test.js
import { expect } from 'chai'
import MyProcessor from '../../../src/processors/my-group/MyProcessor.js'

describe('MyProcessor', () => {
    it('should transform input correctly', async () => {
        const processor = new MyProcessor({})
        const message = { testInput: 'hello' }

        await processor.process(message)

        expect(message.testOutput).to.equal('HELLO')
    })
})
```

### Integration Tests

Add to `tests/integration/apps.json`:

```json
{
    "command": "./trans test.myprocessor-test",
    "label": "myprocessor-test",
    "description": "Test MyProcessor functionality",
    "requiredMatchCount": 1
}
```

## Debugging

### Add Logging

```javascript
logger.debug('Processing started')
logger.log('Important value:', value)
logger.warn('Unusual condition')
logger.error('Error occurred:', error)
```

### Verbose Testing

```bash
LOG_LEVEL=debug ./trans test.myprocessor-test -v
```

### Message Inspection

Add ShowMessage processors in test pipeline:

```turtle
:test a :EntryTransmission ;
    :pipe (
        :setup
        :SM            # Show initial message
        :process
        :SM            # Show after process
        :verify
    ) .
```

## Best Practices

1. **Single responsibility**: One clear purpose per processor
2. **Handle done flag**: Skip processing if `message.done`
3. **Use getProperty**: Support config/message property sources
4. **Comprehensive JSDoc**: Document signature completely
5. **Error handling**: Catch and log errors gracefully
6. **Default values**: Provide sensible defaults
7. **Test thoroughly**: Create test apps
8. **Follow conventions**: Match existing processor patterns
9. **Nested paths**: Use JSONUtils for deep property access
10. **Log appropriately**: Use correct log levels

## Next Steps

1. Implement processor logic
2. Create comprehensive tests
3. Document with JSDoc
4. Add integration test
5. Consider edge cases
6. Update processor group about.md
7. Consider contributing to framework
