# Processor Factory Guide

## Factory Pattern Overview

Transmissions uses the Factory pattern to create processor instances. Each processor group has a factory class that knows how to instantiate processors of that group.

## Factory Structure

### Basic Factory Template

```javascript
// src/processors/{group}/{Group}ProcessorsFactory.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

// Import processors
import ProcessorOne from './ProcessorOne.js'
import ProcessorTwo from './ProcessorTwo.js'
import ProcessorThree from './ProcessorThree.js'

class {Group}ProcessorsFactory {
    /**
     * Creates a processor instance based on type
     * @param {Object} type - RDF term identifying processor type
     * @param {Object} config - Processor configuration
     * @returns {Processor|false} Processor instance or false if type not recognized
     */
    static createProcessor(type, config) {
        // Check each processor type
        if (type.equals(ns.trn.ProcessorOne)) {
            return new ProcessorOne(config)
        }

        if (type.equals(ns.trn.ProcessorTwo)) {
            return new ProcessorTwo(config)
        }

        if (type.equals(ns.trn.ProcessorThree)) {
            return new ProcessorThree(config)
        }

        // Type not recognized by this factory
        return false
    }
}

export default {Group}ProcessorsFactory
```

## Key Concepts

### 1. Type Checking with `equals()`

**Important**: Use `type.equals()`, not `===`

```javascript
// ✅ Correct
if (type.equals(ns.trn.ProcessorName)) {
    return new ProcessorName(config)
}

// ❌ Incorrect - won't work with RDF terms
if (type === ns.trn.ProcessorName) {
    return new ProcessorName(config)
}
```

### 2. Return `false` for Unknown Types

Factories return `false` (not `null`) when they don't recognize a type:

```javascript
// At end of factory
return false  // ✅ Correct
// return null  ❌ Incorrect
```

This allows `AbstractProcessorFactory` to try the next factory in the chain.

### 3. Single Responsibility

Each factory handles processors from one logical group:

```javascript
// ✅ Good - related processors
class TextProcessorsFactory {
    // TextConcatenate, TextReplace, TextFormat, etc.
}

// ❌ Bad - unrelated processors
class MixedProcessorsFactory {
    // TextConcatenate, HttpClient, SPARQLQuery - too diverse
}
```

## Factory Examples

### Minimal Factory (One Processor)

```javascript
import MyProcessor from './MyProcessor.js'
import ns from '../../utils/ns.js'

class MyGroupProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.MyProcessor)) {
            return new MyProcessor(config)
        }

        return false
    }
}

export default MyGroupProcessorsFactory
```

### Multi-Processor Factory

```javascript
import TextConcatenate from './TextConcatenate.js'
import TextReplace from './TextReplace.js'
import TextFormat from './TextFormat.js'
import TextTrim from './TextTrim.js'
import ns from '../../utils/ns.js'

class TextProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.TextConcatenate)) {
            return new TextConcatenate(config)
        }

        if (type.equals(ns.trn.TextReplace)) {
            return new TextReplace(config)
        }

        if (type.equals(ns.trn.TextFormat)) {
            return new TextFormat(config)
        }

        if (type.equals(ns.trn.TextTrim)) {
            return new TextTrim(config)
        }

        return false
    }
}

export default TextProcessorsFactory
```

### Factory with Conditional Logic

```javascript
class AdvancedProcessorsFactory {
    static createProcessor(type, config) {
        // Simple processors
        if (type.equals(ns.trn.SimpleProcessor)) {
            return new SimpleProcessor(config)
        }

        // Processor with variant
        if (type.equals(ns.trn.ConfigurableProcessor)) {
            const variant = config.variant || 'default'

            if (variant === 'enhanced') {
                return new EnhancedProcessor(config)
            } else {
                return new ConfigurableProcessor(config)
            }
        }

        // Deprecated processor with warning
        if (type.equals(ns.trn.OldProcessor)) {
            logger.warn('OldProcessor is deprecated, use NewProcessor instead')
            return new OldProcessor(config)
        }

        return false
    }
}
```

### Factory with Error Handling

```javascript
class RobustProcessorsFactory {
    static createProcessor(type, config) {
        try {
            if (type.equals(ns.trn.MyProcessor)) {
                // Validate config before creating
                this.validateConfig(config)
                return new MyProcessor(config)
            }

            return false

        } catch (error) {
            logger.error(`Factory error: ${error.message}`)
            throw new Error(`Failed to create processor of type ${type.value}: ${error.message}`)
        }
    }

    static validateConfig(config) {
        if (!config) {
            throw new Error('Configuration is required')
        }
        // Additional validation...
    }
}
```

## Registration in AbstractProcessorFactory

### Location

Edit `src/engine/AbstractProcessorFactory.js`

### Import Factory

Add import at the top with other factories:

```javascript
// Around line 20-35
import ExistingFactory1 from '../processors/group1/Group1ProcessorsFactory.js'
import ExistingFactory2 from '../processors/group2/Group2ProcessorsFactory.js'
// ... other imports ...

// Add your factory
import MyGroupProcessorsFactory from '../processors/my-group/MyGroupProcessorsFactory.js'
```

### Register Factory

Add factory call in `createProcessor` method:

```javascript
class AbstractProcessorFactory {
    static createProcessor(type, app) {
        if (!type) {
            throw new Error(`Processor type undefined (typo in 'transmission.ttl'..?)`)
        }

        // Early in the chain for priority
        var processor = MyGroupProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        // Existing factories continue...
        processor = ExistingFactory1.createProcessor(type, app)
        if (processor) return processor

        processor = ExistingFactory2.createProcessor(type, app)
        if (processor) return processor

        // ... more factories ...
    }
}
```

### Factory Priority Order

Factories are tried in order. Place your factory:

**Early** (high priority):
- Override existing processors
- Commonly-used processors
- Framework core processors

**Late** (low priority):
- Rarely-used processors
- Experimental processors
- Deprecated processors

Example:
```javascript
// High priority - commonly used
var processor = UtilProcessorsFactory.createProcessor(type, app)
if (processor) return processor

var processor = FlowProcessorsFactory.createProcessor(type, app)
if (processor) return processor

// Medium priority - specialized
var processor = SPARQLProcessorsFactory.createProcessor(type, app)
if (processor) return processor

// Low priority - experimental
var processor = ExperimentalProcessorsFactory.createProcessor(type, app)
if (processor) return processor
```

## Testing Factory

### Manual Test

```javascript
// tests/manual/test-factory.js
import MyGroupProcessorsFactory from '../../src/processors/my-group/MyGroupProcessorsFactory.js'
import ns from '../../src/utils/ns.js'

// Test processor creation
const processor = MyGroupProcessorsFactory.createProcessor(
    ns.trn.MyProcessor,
    { /* config */ }
)

if (processor) {
    console.log('✓ Factory created processor:', processor.constructor.name)
} else {
    console.error('✗ Factory failed to create processor')
}

// Test unknown type
const unknown = MyGroupProcessorsFactory.createProcessor(
    ns.trn.NonexistentProcessor,
    {}
)

if (unknown === false) {
    console.log('✓ Factory correctly returned false for unknown type')
} else {
    console.error('✗ Factory should return false for unknown types')
}
```

### Integration Test

Create test app:

```turtle
# src/apps/test/factory-test/transmissions.ttl

@prefix : <http://purl.org/stuff/transmissions/> .

:test a :EntryTransmission ;
    :pipe (:test-factory) .

:test-factory a :MyProcessor ;
    :settings [
        :testField "value"
    ] .
```

Run:
```bash
./trans test.factory-test -v
```

## Common Patterns

### Namespace Organization

```javascript
// Single namespace for all processors
import ns from '../../utils/ns.js'

// All processor types in one namespace
ns.trn.ProcessorOne
ns.trn.ProcessorTwo
```

### Import Organization

```javascript
// Group imports by category
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

// Basic processors
import ProcessorA from './ProcessorA.js'
import ProcessorB from './ProcessorB.js'

// Advanced processors
import AdvancedProcessorC from './AdvancedProcessorC.js'
import AdvancedProcessorD from './AdvancedProcessorD.js'

// Deprecated (separate section)
import OldProcessor from './OldProcessor.js'
```

### Type Check Chain

```javascript
static createProcessor(type, config) {
    // Most common first
    if (type.equals(ns.trn.CommonProcessor)) {
        return new CommonProcessor(config)
    }

    // Less common
    if (type.equals(ns.trn.RareProcessor)) {
        return new RareProcessor(config)
    }

    // Deprecated last
    if (type.equals(ns.trn.DeprecatedProcessor)) {
        logger.warn('DeprecatedProcessor is deprecated')
        return new DeprecatedProcessor(config)
    }

    return false
}
```

## Troubleshooting

### Processor Not Found

**Symptom**: Error "Processor type undefined" or type not recognized

**Solutions**:
1. Verify processor imported in factory
2. Check type.equals() call is correct
3. Ensure factory registered in AbstractProcessorFactory
4. Check namespace matches transmissions.ttl

### Type Comparison Fails

**Symptom**: Factory called but type check doesn't match

**Solutions**:
1. Use `type.equals()` not `===`
2. Verify namespace: `ns.trn.ProcessorName`
3. Check transmissions.ttl uses correct type

### Factory Not Called

**Symptom**: Factory never receives type

**Solutions**:
1. Check factory imported in AbstractProcessorFactory
2. Verify createProcessor call added
3. Check for typos in factory name

## Best Practices

1. **Return false for unknown**: Always return `false`, not `null` or `undefined`
2. **Use equals()**: Always use `type.equals()` for comparison
3. **Group related processors**: Keep related processors in one factory
4. **Order by frequency**: Most common processors first
5. **Document deprecations**: Warn when using deprecated processors
6. **Validate carefully**: Only validate if necessary, don't slow creation
7. **Error handling**: Log errors but don't swallow them
8. **Consistent naming**: {Group}ProcessorsFactory pattern
9. **Import order**: Utils, then processors, logically grouped
10. **Test thoroughly**: Create test app to verify factory works

## Factory Checklist

- [ ] Factory file created in processor group directory
- [ ] All processors imported
- [ ] Each processor has type.equals() check
- [ ] Returns `false` for unknown types
- [ ] Imported in AbstractProcessorFactory.js
- [ ] createProcessor call added with appropriate priority
- [ ] Test app created
- [ ] Test app runs successfully
- [ ] All processor types work in transmissions.ttl
