# Creating Custom Processors

This guide explains how to create custom processors to extend the Transmissions framework with new functionality.

## Processor Architecture

Processors are the building blocks of Transmissions pipelines. Each processor:

- Extends the base `Processor` class
- Implements a `process(message)` method
- Can emit results to the next processor in the pipeline
- Has access to configuration settings
- Manages its own lifecycle and resources

## Basic Processor Structure

### 1. Create Processor File

Processors are organized by category in `src/processors/`:

```javascript
// src/processors/text/MyProcessor.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'

/**
 * @class MyProcessor
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Brief description of what this processor does.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.settingName`** - Description of setting
 *
 * #### __*Input*__
 * * **`message`** - The message object to process
 *
 * #### __*Output*__
 * * **`message`** - The processed message object
 *
 * #### __*Behavior*__
 * * Describe what the processor does
 *
 * #### __*Side Effects*__
 * * List any side effects
 */
class MyProcessor extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug(`MyProcessor.process starting`)

        // Get configuration
        const setting = this.getProperty(ns.trn.settingName, 'default-value')

        // Process the message
        // ... your logic here ...

        // Emit result to next processor
        return this.emit('message', message)
    }
}

export default MyProcessor
```

### 2. Register in Factory

Add your processor to the appropriate factory:

```javascript
// src/processors/text/TextProcessorsFactory.js

import MyProcessor from './MyProcessor.js'

class TextProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.MyProcessor)) {
            return new MyProcessor(config)
        }
        // ... other processors
    }
}
```

### 3. Add to Main Factory

Register your category in the main processor factory:

```javascript
// src/processors/ProcessorFactory.js

import TextProcessorsFactory from './text/TextProcessorsFactory.js'

class ProcessorFactory {
    static createProcessor(type, config) {
        // Try text processors
        let processor = TextProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        // ... other factories
    }
}
```

## Configuration Handling

### Reading Settings

Use `getProperty()` to read configuration:

```javascript
// Required setting (throws if missing)
const filename = this.getProperty(ns.trn.filename)

// Optional with default
const encoding = this.getProperty(ns.trn.encoding, 'utf8')

// Check if setting exists
if (this.hasProperty(ns.trn.optionalSetting)) {
    const value = this.getProperty(ns.trn.optionalSetting)
}
```

### Message vs Config Priority

Settings can come from message properties or configuration. Message properties take priority:

```javascript
// This will use message.filename if it exists, otherwise config setting
const filename = this.getProperty(ns.trn.filename, 'default.txt')
```

### Complex Configuration

Handle complex settings:

```javascript
// Array settings
const items = this.getProperty(ns.trn.items, [])

// Object settings
const options = this.getProperty(ns.trn.options, {})

// Nested properties
const database = {
    host: this.getProperty(ns.trn.dbHost, 'localhost'),
    port: this.getProperty(ns.trn.dbPort, 5432),
    name: this.getProperty(ns.trn.dbName)
}
```

## Message Processing Patterns

### Simple Transformation

Transform message content:

```javascript
async process(message) {
    const input = message.content || ''
    const result = input.toUpperCase()

    message.content = result
    return this.emit('message', message)
}
```

### Property Setting

Add properties to messages:

```javascript
async process(message) {
    const fieldName = this.getProperty(ns.trn.field)
    const fieldValue = this.getProperty(ns.trn.value)

    message[fieldName] = fieldValue
    return this.emit('message', message)
}
```

### Conditional Processing

Skip or modify based on conditions:

```javascript
async process(message) {
    // Skip if message is marked as done
    if (message.done) {
        logger.debug('Message marked as done, skipping')
        return this.emit('message', message)
    }

    // Process normally
    // ... processing logic ...

    return this.emit('message', message)
}
```

### Async Operations

Handle asynchronous operations:

```javascript
async process(message) {
    try {
        const url = this.getProperty(ns.trn.url)
        const response = await fetch(url)
        const data = await response.json()

        message.apiResponse = data
        return this.emit('message', message)
    } catch (error) {
        logger.error(`API request failed: ${error.message}`)
        message.error = error.message
        return this.emit('message', message)
    }
}
```

## Error Handling

### Graceful Degradation

Handle errors without breaking the pipeline:

```javascript
async process(message) {
    try {
        // Risky operation
        const result = await this.riskyOperation(message)
        message.result = result
    } catch (error) {
        logger.warn(`Operation failed: ${error.message}`)
        message.error = error.message
        // Continue processing despite error
    }

    return this.emit('message', message)
}
```

### Validation

Validate inputs early:

```javascript
async process(message) {
    const required = this.getProperty(ns.trn.requiredField)
    if (!required) {
        throw new Error('Required field is missing')
    }

    // Process with validated input
    // ...
}
```

## Advanced Patterns

### Resource Management

Manage external resources:

```javascript
class DatabaseProcessor extends Processor {
    constructor(config) {
        super(config)
        this.connection = null
    }

    async initialize() {
        const host = this.getProperty(ns.trn.dbHost)
        this.connection = await connectToDatabase(host)
    }

    async process(message) {
        if (!this.connection) {
            await this.initialize()
        }

        const result = await this.connection.query(message.query)
        message.result = result
        return this.emit('message', message)
    }

    async cleanup() {
        if (this.connection) {
            await this.connection.close()
            this.connection = null
        }
    }
}
```

### State Management

Maintain state across messages:

```javascript
class AccumulatorProcessor extends Processor {
    constructor(config) {
        super(config)
        this.accumulated = []
    }

    async process(message) {
        // Add to accumulator
        this.accumulated.push(message.data)

        // Check if we should emit
        const threshold = this.getProperty(ns.trn.threshold, 10)
        if (this.accumulated.length >= threshold) {
            message.batch = [...this.accumulated]
            this.accumulated = [] // Reset
            return this.emit('message', message)
        }

        // Don't emit yet
        return Promise.resolve()
    }
}
```

### Multiple Outputs

Emit multiple messages:

```javascript
class SplitterProcessor extends Processor {
    async process(message) {
        const items = message.items || []

        // Emit one message per item
        for (const item of items) {
            const newMessage = { ...message, currentItem: item }
            await this.emit('message', newMessage)
        }

        return Promise.resolve()
    }
}
```

## Testing Processors

### Unit Tests

Create focused tests for your processor:

```javascript
// tests/unit/processors/MyProcessor.test.js

import { expect } from 'chai'
import MyProcessor from '../../../src/processors/text/MyProcessor.js'

describe('MyProcessor', () => {
    it('should transform message content', async () => {
        const config = { /* test config */ }
        const processor = new MyProcessor(config)

        const message = { content: 'input' }
        const result = await processor.process(message)

        expect(result.content).to.equal('expected output')
    })
})
```

### Integration Tests

Test with real pipeline:

```turtle
# src/apps/test/my-processor/transmissions.ttl

:test-transmission a :EntryTransmission ;
    :pipe (
        :setup-test
        :my-processor
        :verify-result
    ) .

:my-processor a :MyProcessor ;
    :settings [ :settingName "test-value" ] .
```

## Built-in Utilities

### Logging

Use structured logging:

```javascript
logger.debug('Debug message with details', { messageId: message.id })
logger.info('Processing started')
logger.warn('Non-fatal issue occurred')
logger.error('Error processing message', { error: error.message })
```

### Namespaces

Use proper RDF namespaces:

```javascript
import ns from '../../utils/ns.js'

// Framework properties
ns.trn.filename
ns.trn.content
ns.trn.settings

// RDF properties
ns.rdf.type
ns.rdfs.label
```

### Message Utilities

Work with message properties:

```javascript
// Safe property access
const value = message[propertyName] || defaultValue

// Check property existence
if (propertyName in message) {
    // Property exists
}

// Add metadata
message.tags = (message.tags || '') + '.my-processor'
message.processedBy = message.processedBy || []
message.processedBy.push('MyProcessor')
```

## Common Processor Types

### Data Processors
- Transform content format
- Validate data structure
- Clean and normalize data

### I/O Processors
- Read from external sources
- Write to destinations
- Stream large datasets

### Control Flow Processors
- Route messages conditionally
- Aggregate or split data
- Coordinate complex workflows

### Integration Processors
- Connect to APIs
- Interface with databases
- Bridge different systems

Following these patterns will ensure your custom processors integrate seamlessly with the Transmissions framework and follow established conventions.