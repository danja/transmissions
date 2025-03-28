# Creating Custom Processors in Transmissions

This guide explains how to create new processing components for the Transmissions framework.

## Overview

Processors are the core components in Transmissions that handle data transformation in a pipeline. Each processor:

1. Receives a message object
2. Performs specific operations on it
3. Emits the modified message to the next processor in the chain

## Step 1: Create the Processor Class

Create a new JavaScript file for your processor at `src/processors/your-group/YourProcessor.js`:

```javascript
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'

class YourProcessor extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug(`\n\nYourProcessor.process`)
        
        // Skip if this is a completion message
        if (message.done) {
            return this.emit('message', message)
        }
        
        // Get configuration properties from settings
        const someProperty = await this.getProperty(ns.trn.someProperty, 'defaultValue')
        
        // Process the message (your custom logic here)
        // Example: modify a field in the message
        message.transformedData = `Processed: ${message.originalData}`
        
        // Forward the modified message to the next processor
        return this.emit('message', message)
    }
}

export default YourProcessor
```

## Step 2: Create a Factory for Your Processor Group

If you're creating a new processor group, create a factory file at `src/processors/your-group/YourGroupProcessorsFactory.js`:

```javascript
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import YourProcessor from './YourProcessor.js'
// Import other processors in the same group

class YourGroupProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.YourProcessor)) {
            return new YourProcessor(config)
        }
        
        // Add other processors from your group
        
        return false
    }
}

export default YourGroupProcessorsFactory
```

## Step 3: Register Your Factory

Edit `src/engine/AbstractProcessorFactory.js` to include your factory:

```javascript
// Add this import with other processor group imports
import YourGroupProcessorsFactory from '../processors/your-group/YourGroupProcessorsFactory.js'

class AbstractProcessorFactory {
    static createProcessor(type, config) {
        // Add your factory early in the checks
        var processor = YourGroupProcessorsFactory.createProcessor(type, config)
        if (processor) return processor
        
        // The rest of the existing factory checks
        // ...
    }
}
```

## Step 4: Test with a Simple Runner

Create a simple test script at `src/simples/your-processor/simple-runner.js`:

```javascript
import YourProcessor from '../../processors/your-group/YourProcessor.js'
import logger from '../../utils/Logger.js'

const config = {
    whiteboard: []
}

const processor = new YourProcessor(config)

async function runTest() {
    const message = { 
        originalData: 'test data'
    }
    
    const result = await processor.process(message)
    logger.log('Output:')
    logger.reveal(result)
}

runTest().catch(console.error)
```

## Step 5: Define the Processor in a Transmission

In your application's `transmissions.ttl` file:

```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix : <http://purl.org/stuff/transmissions/> .

:your-transmission a :Transmission ;
    :pipe (:p10 :p20) .

:p10 a :YourProcessor ;
     :settings :yourSettings .

:p20 a :ShowMessage .
```

## Step 6: Configure the Processor

In your application's `config.ttl` file:

```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix : <http://purl.org/stuff/transmissions/> .

:yourSettings a :ConfigSet ;
    :someProperty "configured value" ;
    :anotherSetting "another value" .
```

## Key Concepts

### Message Object

The message object is passed between processors and typically contains:

- `content`: The primary data being processed
- `done`: Flag indicating completion (for multi-message processors)
- `filepath`, `fullPath`, etc.: Context information
- Any custom fields added by processors

### Configuration Access

Retrieve configuration settings with:

```javascript
const value = await this.getProperty(ns.trn.propertyName, 'defaultValue')
```

### Typical Processor Patterns

1. **Simple Transform**: Modify message and pass it on
2. **Filter**: Only emit message if it meets certain criteria
3. **Fork**: Emit multiple messages for downstream parallel processing
4. **Accumulator**: Collect data across multiple messages before emitting
5. **Reader/Writer**: Handle I/O operations

### Message Flow Control

For multi-message workflows:

1. `message.done = false`: Regular message processing
2. `message.done = true`: Final message indicating completion

### Common Utilities

- `logger`: For debug, info, warning, error messages
- `ns`: Namespace helpers for RDF properties
- `JSONUtils`: Helpers for working with nested objects

## Examples

See existing processors for patterns:

- `src/processors/fs/DirWalker.js`: Emits multiple messages from filesystem
- `src/processors/flow/ForEach.js`: Iterates over data in messages
- `src/processors/flow/Accumulate.js`: Collects data across messages
- `src/processors/json/Restructure.js`: Data transformation example
- `src/processors/text/Templater.js`: Content generation example

## Testing

1. Use the `simples` pattern for quick testing
2. Add proper tests in the `tests` directory
3. Run tests with `npm test`

## Reference Files

For more examples:
- `src/processors/example-group/ExampleProcessor.js`
- `src/model/Processor.js`
- `src/processors/fs/DirWalker.js`
- `src/simples/nop/nop.js`
