# Processor Code Templates

## Basic Processor Template

```javascript
// src/processors/{group}/{ProcessorName}.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'

/**
 * @class {ProcessorName}
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Brief description of processor functionality.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.settingName`** - Setting description (default: "value")
 *
 * #### __*Input*__
 * * **`message.field`** - Expected input field
 *
 * #### __*Output*__
 * * **`message.result`** - Output field
 *
 * #### __*Behavior*__
 * * Describe behavior
 *
 * #### __*Side Effects*__
 * * List side effects
 */
class {ProcessorName} extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug(`${this.constructor.name}.process`)

        // Skip if spawning completion message
        if (message.done) {
            return this.emit('message', message)
        }

        // Get configuration
        const setting = super.getProperty(ns.trn.settingName, 'defaultValue')

        // Process message
        // YOUR LOGIC HERE

        // Emit result
        return this.emit('message', message)
    }
}

export default {ProcessorName}
```

## Common Patterns

### 1. Simple Field Transformation

```javascript
async process(message) {
    if (message.done) return this.emit('message', message)

    const inputField = super.getProperty(ns.trn.inputField, 'input')
    const outputField = super.getProperty(ns.trn.outputField, 'output')

    const input = message[inputField]

    if (!input) {
        logger.warn(`No input in field: ${inputField}`)
        return this.emit('message', message)
    }

    // Transform
    const result = input.toString().toUpperCase()

    message[outputField] = result

    return this.emit('message', message)
}
```

### 2. Nested Path Access

```javascript
import JSONUtils from '../../utils/JSONUtils.js'

async process(message) {
    if (message.done) return this.emit('message', message)

    const inputPath = super.getProperty(ns.trn.inputPath, 'data.user.name')
    const outputPath = super.getProperty(ns.trn.outputPath, 'results.processedName')

    // Get nested value
    const input = JSONUtils.get(message, inputPath)

    if (!input) {
        logger.warn(`No value at path: ${inputPath}`)
        return this.emit('message', message)
    }

    // Process
    const result = this.transform(input)

    // Set nested value
    JSONUtils.set(message, outputPath, result)

    return this.emit('message', message)
}
```

### 3. Array Processing

```javascript
async process(message) {
    if (message.done) return this.emit('message', message)

    const arrayField = super.getProperty(ns.trn.arrayField, 'items')
    const items = message[arrayField]

    if (!Array.isArray(items)) {
        logger.warn(`Field ${arrayField} is not an array`)
        return this.emit('message', message)
    }

    // Process each item
    const results = items.map(item => this.transformItem(item))

    message[arrayField] = results

    return this.emit('message', message)
}

transformItem(item) {
    return {
        ...item,
        processed: true,
        timestamp: new Date().toISOString()
    }
}
```

### 4. Async Operation

```javascript
async process(message) {
    if (message.done) return this.emit('message', message)

    const url = super.getProperty(ns.trn.url)

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        message.apiResponse = data
        message.success = true

    } catch (error) {
        logger.error(`API request failed: ${error.message}`)
        message.error = error.message
        message.success = false
    }

    return this.emit('message', message)
}
```

### 5. File Operations

```javascript
import fs from 'fs/promises'
import path from 'path'

async process(message) {
    if (message.done) return this.emit('message', message)

    const filename = super.getProperty(ns.trn.filename)
    const workingDir = message.workingDir || process.cwd()
    const filepath = path.join(workingDir, filename)

    try {
        const content = await fs.readFile(filepath, 'utf8')

        message.fileContent = content
        message.filename = filename
        message.filepath = filepath

    } catch (error) {
        logger.error(`File read failed: ${error.message}`)
        message.error = error.message
    }

    return this.emit('message', message)
}
```

### 6. Conditional Logic

```javascript
async process(message) {
    if (message.done) return this.emit('message', message)

    const testField = super.getProperty(ns.trn.testField, 'type')
    const testValue = super.getProperty(ns.trn.testValue)

    const actualValue = message[testField]

    if (actualValue === testValue) {
        // True path
        message.condition = 'matched'
        message.result = this.processMatchedCase(message)
    } else {
        // False path
        message.condition = 'not-matched'
        message.result = this.processDefaultCase(message)
    }

    return this.emit('message', message)
}
```

### 7. Error Handling

```javascript
async process(message) {
    if (message.done) return this.emit('message', message)

    try {
        // Risky operation
        const result = await this.riskyOperation(message)

        message.result = result
        message.error = null

    } catch (error) {
        logger.error(`Processing error: ${error.message}`)

        // Continue gracefully
        message.error = {
            message: error.message,
            code: error.code || 'PROCESSING_ERROR',
            timestamp: new Date().toISOString()
        }
        message.result = null
    }

    return this.emit('message', message)
}
```

### 8. State Management

```javascript
class StatefulProcessor extends Processor {
    constructor(config) {
        super(config)
        this.state = {
            counter: 0,
            cache: new Map(),
            history: []
        }
    }

    async process(message) {
        if (message.done) {
            // Cleanup on completion
            this.state.cache.clear()
            return this.emit('message', message)
        }

        // Update counter
        this.state.counter++
        message.processingSequence = this.state.counter

        // Check cache
        const key = message.id
        if (this.state.cache.has(key)) {
            message.cached = true
            message.data = this.state.cache.get(key)
        } else {
            message.data = this.computeData(message)
            this.state.cache.set(key, message.data)
        }

        // Update history
        this.state.history.push({
            id: key,
            timestamp: Date.now()
        })

        return this.emit('message', message)
    }

    reset() {
        this.state.counter = 0
        this.state.cache.clear()
        this.state.history = []
    }
}
```

### 9. Multiple Output Messages

```javascript
async process(message) {
    if (message.done) return this.emit('message', message)

    const items = message.items || []

    // Emit one message per item
    for (const item of items) {
        const newMessage = {
            ...message,
            currentItem: item,
            itemId: item.id
        }

        await this.emit('message', newMessage)
    }

    // Don't emit original message
    return Promise.resolve()
}
```

### 10. Resource Cleanup

```javascript
class ResourceProcessor extends Processor {
    constructor(config) {
        super(config)
        this.connection = null
    }

    async initialize() {
        if (!this.connection) {
            const host = super.getProperty(ns.trn.host, 'localhost')
            const port = super.getProperty(ns.trn.port, 3000)

            this.connection = await this.connect(host, port)
            logger.debug('Connection established')
        }
    }

    async process(message) {
        if (message.done) {
            // Cleanup on completion
            await this.cleanup()
            return this.emit('message', message)
        }

        // Lazy initialization
        await this.initialize()

        // Use connection
        const result = await this.connection.query(message.query)
        message.result = result

        return this.emit('message', message)
    }

    async cleanup() {
        if (this.connection) {
            await this.connection.close()
            this.connection = null
            logger.debug('Connection closed')
        }
    }
}
```

## Configuration Patterns

### Required Configuration

```javascript
const required = super.getProperty(ns.trn.requiredField)
if (!required) {
    throw new Error('requiredField configuration is required')
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
    timeout: super.getProperty(ns.trn.timeout, 5000),
    retry: super.getProperty(ns.trn.retry, true),
    maxRetries: super.getProperty(ns.trn.maxRetries, 3)
}
```

### Template Strings in Config

```javascript
// Configuration can include template strings like {{field}}
// These are resolved at runtime from message properties

const template = super.getProperty(ns.trn.urlTemplate, 'https://api.example.com/{{id}}')

// Simple template replacement
const url = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return message[key] || match
})
```

## Helper Methods

### Validation

```javascript
validateInput(message) {
    const required = ['field1', 'field2', 'field3']

    for (const field of required) {
        if (!(field in message)) {
            throw new Error(`Required field missing: ${field}`)
        }
    }

    return true
}
```

### Type Checking

```javascript
ensureArray(value, fieldName) {
    if (!Array.isArray(value)) {
        throw new TypeError(`${fieldName} must be an array`)
    }
}

ensureString(value, fieldName) {
    if (typeof value !== 'string') {
        throw new TypeError(`${fieldName} must be a string`)
    }
}
```

### Transformation

```javascript
normalize(input) {
    return input
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
}

sanitize(input) {
    return input.replace(/[^a-z0-9-_]/gi, '')
}
```

## Testing Helpers

### Test Message Creation

```javascript
createTestMessage(overrides = {}) {
    return {
        appPath: '/test/path',
        workingDir: '/test/working',
        testMode: true,
        ...overrides
    }
}
```

### Mock Configuration

```javascript
createMockConfig(settings = {}) {
    return {
        settings: {
            getValue: (key, defaultValue) => {
                return settings[key] || defaultValue
            }
        }
    }
}
```

## Best Practices

1. **Handle done flag**: Always check `message.done` first
2. **Use getProperty**: Support multiple config sources
3. **Validate inputs**: Check for required fields/types
4. **Log appropriately**: Use correct log levels
5. **Handle errors gracefully**: Don't break pipeline
6. **Clean up resources**: Handle done flag for cleanup
7. **Document thoroughly**: Comprehensive JSDoc
8. **Provide defaults**: Sensible fallback values
9. **Use JSONUtils**: For nested property access
10. **Test thoroughly**: Create test apps

## Performance Tips

1. **Lazy initialization**: Init resources only when needed
2. **Caching**: Cache expensive computations
3. **Avoid blocking**: Use async/await properly
4. **Resource pooling**: Reuse connections
5. **Memory management**: Clear caches on done
