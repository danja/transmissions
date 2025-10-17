# Remote Processor Development Guide

## Overview

Remote processor development means creating processors within a specific app directory (e.g., `~/hyperdata/trans-apps/apps/my-app/processors/`) that are loaded dynamically via the module loading facility.

## Advantages

- **App-specific**: Processor coupled with its app
- **Independent**: No framework modification needed
- **Distribution**: App is self-contained
- **Separation**: Clean separation from core

## Limitations

⚠️ **Important Limitations:**
- Long import paths for framework utilities
- Factory registration challenges
- Module loading has known issues (see `src/apps/test/module-load/about.md`)
- Not automatically available to other apps

## Best For

- App-specific processors
- One-off transformations
- Experimental processors
- Apps distributed separately from framework

## Directory Structure

```
~/hyperdata/trans-apps/apps/my-app/
├── transmissions.ttl
├── config.ttl
├── about.md
└── processors/
    ├── MyProcessor.js
    └── MyProcessorsFactory.js
```

## Step-by-Step Setup

### 1. Create Processor Directory

```bash
mkdir -p ~/hyperdata/trans-apps/apps/my-app/processors
```

### 2. Create Processor File

**~/hyperdata/trans-apps/apps/my-app/processors/MyProcessor.js:**

```javascript
// Note: Long import paths required for remote processors
import Processor from '../../../../../../transmissions/src/model/Processor.js'
import logger from '../../../../../../transmissions/src/utils/Logger.js'
import ns from '../../../../../../transmissions/src/utils/ns.js'

/**
 * @class MyProcessor
 * @extends Processor
 * @classdesc
 * App-specific processor for my-app.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.inputField`** - Field to process
 * * **`ns.trn.outputField`** - Field for result
 *
 * #### __*Input*__
 * * **`message[inputField]`** - Data to process
 *
 * #### __*Output*__
 * * **`message[outputField]`** - Processed result
 */
class MyProcessor extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug('MyProcessor.process (remote)')

        if (message.done) {
            return this.emit('message', message)
        }

        const inputField = super.getProperty(ns.trn.inputField, 'input')
        const outputField = super.getProperty(ns.trn.outputField, 'output')

        const input = message[inputField]

        if (!input) {
            logger.warn(`No input in field: ${inputField}`)
            return this.emit('message', message)
        }

        // Your processing logic
        const result = this.processInput(input)

        message[outputField] = result

        return this.emit('message', message)
    }

    processInput(input) {
        // Transform logic specific to your app
        return input.toString().toUpperCase()
    }
}

export default MyProcessor
```

### 3. Create Factory

**~/hyperdata/trans-apps/apps/my-app/processors/MyProcessorsFactory.js:**

```javascript
import MyProcessor from './MyProcessor.js'
import ns from '../../../../../../transmissions/src/utils/ns.js'

class MyProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.MyProcessor)) {
            return new MyProcessor(config)
        }

        return false
    }
}

export default MyProcessorsFactory
```

### 4. Current Limitation: Factory Registration

⚠️ **Known Issue**: Remote processor factories are not automatically registered.

**Current Workaround Options:**

#### Option A: Register in Core (Temporary)

Edit `src/engine/AbstractProcessorFactory.js`:

```javascript
// Import remote factory
import MyProcessorsFactory from '../../../../../../trans-apps/apps/my-app/processors/MyProcessorsFactory.js'

// In createProcessor
var processor = MyProcessorsFactory.createProcessor(type, app)
if (processor) return processor
```

**Note**: This defeats the purpose of remote development but is the current working solution.

#### Option B: Use Existing Core Processors Creatively

Design your app to use existing core processors rather than creating custom ones.

#### Option C: Contribute to Core

If the processor is generally useful, contribute it to the core framework.

### 5. Use in Transmissions

**transmissions.ttl:**

```turtle
@prefix : <http://purl.org/stuff/transmissions/> .

:my-app a :EntryTransmission ;
    :pipe (
        :setup
        :custom-processor
        :output
    ) .

:setup a :SetField ;
    :settings [
        :field "input" ;
        :value "test data"
    ] .

:custom-processor a :MyProcessor ;
    :settings [
        :inputField "input" ;
        :outputField "result"
    ] .

:output a :ShowMessage .
```

### 6. Run

```bash
cd /home/danny/hyperdata/transmissions
./trans ~/hyperdata/trans-apps/apps/my-app -v
```

## Import Path Management

### Calculating Import Paths

From processor file to framework:
```
~/hyperdata/trans-apps/apps/my-app/processors/MyProcessor.js
                                   ↓ (up 1)
~/hyperdata/trans-apps/apps/my-app/
                                   ↓ (up 1)
~/hyperdata/trans-apps/apps/
                                   ↓ (up 1)
~/hyperdata/trans-apps/
                                   ↓ (up 1)
~/hyperdata/
                                   ↓ (down 1)
~/hyperdata/transmissions/
                                   ↓ (down 1)
~/hyperdata/transmissions/src/
```

Result: `../../../../../../transmissions/src/`

### Import Template

```javascript
// Standard remote processor imports
import Processor from '../../../../../../transmissions/src/model/Processor.js'
import logger from '../../../../../../transmissions/src/utils/Logger.js'
import ns from '../../../../../../transmissions/src/utils/ns.js'
import JSONUtils from '../../../../../../transmissions/src/utils/JSONUtils.js'
```

### Alternative: Symlink Approach

```bash
# Create symlink in app directory
cd ~/hyperdata/trans-apps/apps/my-app
ln -s /home/danny/hyperdata/transmissions/src transmissions-src

# Now import as:
import Processor from './transmissions-src/model/Processor.js'
```

## Module Loading Verification

### Check Module Path

```bash
LOG_LEVEL=debug ./trans ~/hyperdata/trans-apps/apps/my-app -v 2>&1 | grep -A5 "ModuleLoader"
```

Expected output:
```
AppManager.initModuleLoader
Module path = /home/danny/hyperdata/trans-apps/apps/my-app/processors
ModuleLoader initialized with paths:
/home/danny/hyperdata/trans-apps/apps/my-app/processors
```

### Test Processor Loading

Create test transmission:

```turtle
:test-loading a :EntryTransmission ;
    :pipe (:test-remote :show) .

:test-remote a :MyProcessor ;
    :settings [
        :inputField "test" ;
        :outputField "result"
    ] .

:show a :ShowMessage .
```

Run:
```bash
./trans ~/hyperdata/trans-apps/apps/my-app -m '{"test": "hello"}' -v
```

## Known Issues & Workarounds

### Issue 1: Path Resolution

**Problem**: ModuleLoader may look in wrong directory

**Workaround**: Use absolute paths or verify with debug logging

### Issue 2: Factory Registration

**Problem**: Remote factories not automatically loaded

**Workaround Options**:
1. Register in AbstractProcessorFactory.js (defeats purpose)
2. Use core processors instead
3. Propose dynamic factory loading feature

### Issue 3: Import Path Complexity

**Problem**: Long relative import paths

**Workaround Options**:
1. Use symlinks
2. Accept the complexity
3. Keep logic minimal, delegate to core utilities

## Testing Remote Processors

### Test in Isolation

Create minimal test app:

```turtle
:isolated-test a :EntryTransmission ;
    :pipe (:input :processor :output) .

:input a :SetField ;
    :settings [
        :field "data" ;
        :value "test"
    ] .

:processor a :MyProcessor .

:output a :ShowMessage .
```

### Debug Loading

```bash
# Verbose with debug logging
LOG_LEVEL=debug ./trans ~/hyperdata/trans-apps/apps/my-app -v

# Check for:
# - Module path initialization
# - Processor creation
# - Factory resolution
```

### Verify Processor Execution

Add logging in processor:

```javascript
async process(message) {
    logger.log('*** MyProcessor executing from remote location ***')
    logger.log(`Input: ${JSON.stringify(message)}`)

    // ... processing ...

    logger.log(`Output: ${JSON.stringify(message)}`)
    return this.emit('message', message)
}
```

## Best Practices

1. **Minimize custom processors**: Use core processors when possible
2. **Simple logic**: Keep remote processor logic straightforward
3. **Document paths**: Note import path calculation in comments
4. **Test thoroughly**: Verify module loading works
5. **Consider symlinks**: Simplify import paths
6. **Version awareness**: Document framework version requirement
7. **Distribution**: Include processor files in app package

## Migration to Core

If your remote processor proves useful:

### 1. Copy to Core

```bash
# Copy processor
cp ~/hyperdata/trans-apps/apps/my-app/processors/MyProcessor.js \
   src/processors/my-group/

# Copy factory or merge into existing
cp ~/hyperdata/trans-apps/apps/my-app/processors/MyProcessorsFactory.js \
   src/processors/my-group/
```

### 2. Fix Import Paths

Change from:
```javascript
import Processor from '../../../../../../transmissions/src/model/Processor.js'
```

To:
```javascript
import Processor from '../../model/Processor.js'
```

### 3. Register in AbstractProcessorFactory

Follow core development guide.

### 4. Update App

Change app to use core processor, remove remote version.

## Distribution

### Package App with Processors

```bash
cd ~/hyperdata/trans-apps/apps
tar -czf my-app-complete.tar.gz my-app/
```

### Installation Instructions

**README.md:**
```markdown
# My App

## Installation

1. Extract archive:
   ```sh
   tar -xzf my-app-complete.tar.gz -C ~/hyperdata/trans-apps/apps/
   ```

2. Verify processors:
   ```sh
   ls ~/hyperdata/trans-apps/apps/my-app/processors/
   ```

3. Run:
   ```sh
   cd /path/to/transmissions
   ./trans ~/hyperdata/trans-apps/apps/my-app
   ```

## Requirements

- Transmissions framework v1.x.x
- Custom processors included in app directory
```

## Troubleshooting

**Processor not found:**
```bash
# Verify processor exists
ls ~/hyperdata/trans-apps/apps/my-app/processors/MyProcessor.js

# Check module path
LOG_LEVEL=debug ./trans ~/hyperdata/trans-apps/apps/my-app -v 2>&1 | grep "Module path"
```

**Import errors:**
```bash
# Count path segments
# From: ~/hyperdata/trans-apps/apps/my-app/processors/
# To:   ~/hyperdata/transmissions/src/
# Up 5, down 2: ../../../../../../transmissions/src/
```

**Factory not registered:**
- Current limitation: must register in AbstractProcessorFactory.js
- Or use core processors instead

## Future Improvements

Proposed enhancements for remote processor support:

1. **Dynamic factory loading**: Auto-discover remote factories
2. **Import path helpers**: Simplify import statements
3. **Processor registry**: App-level processor registration
4. **Better module resolution**: Fix known module loading issues

## Next Steps

1. Create processor with proper import paths
2. Create factory
3. Test module loading thoroughly
4. Consider factory registration workaround
5. Document any limitations in app's about.md
6. If useful, consider migrating to core
