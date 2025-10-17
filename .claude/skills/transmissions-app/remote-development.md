# Remote Development Guide

## Overview

Remote development means creating your app in a separate directory (e.g., `~/hyperdata/trans-apps/apps/`) that is loaded dynamically by the Transmissions framework using the module loading facility.

## Advantages

- **Separation**: App code separate from framework
- **Versioning**: Independent git repositories
- **Distribution**: Easier to share/publish
- **Organization**: Multiple projects without framework coupling

## Best For

- Production applications
- Distributed apps
- Apps with separate development cycles
- Multiple independent projects

## Known Issues

⚠️ **Important**: Module loading has known path resolution issues documented in `src/apps/test/module-load/about.md`. Test thoroughly.

## Directory Structure

```
~/hyperdata/trans-apps/
└── apps/
    └── {YOUR_APP}/
        ├── transmissions.ttl    # Required: Pipeline definition
        ├── config.ttl          # Optional: Configuration
        ├── about.md            # Required: Documentation
        ├── data/               # Optional: Working files
        └── processors/         # Optional: Custom processors
            ├── MyProcessor.js
            └── MyProcessorsFactory.js
```

## Step-by-Step Setup

### 1. Create Remote Apps Directory

```bash
mkdir -p ~/hyperdata/trans-apps/apps
```

### 2. Copy Example App

```bash
cp -r /home/danny/hyperdata/transmissions/src/apps/example-app ~/hyperdata/trans-apps/apps/my-remote-app
```

### 3. Customize Files

**about.md:**
```markdown
# My Remote App

## Runner
```sh
# From transmissions directory
./trans ~/hyperdata/trans-apps/apps/my-remote-app

# Or with relative path
./trans ../trans-apps/apps/my-remote-app
```

## Description
Remote application description.
```

**transmissions.ttl:**
Same format as core development, but reference any custom processors if needed.

### 4. Run Remote App

```bash
# From transmissions directory
cd /home/danny/hyperdata/transmissions

# Run with full path
./trans ~/hyperdata/trans-apps/apps/my-remote-app -v

# Or relative path
./trans ../trans-apps/apps/my-remote-app -v

# With custom message
./trans ~/hyperdata/trans-apps/apps/my-remote-app -m '{"field": "value"}'
```

## Module Loading Configuration

### How It Works

The framework's `ModuleLoader` resolves paths in this order:
1. Application-specific processors directory (`{APP_PATH}/processors/`)
2. Core framework processors (`src/processors/`)
3. Fallback paths from classpath

### Path Resolution

When you run:
```bash
./trans ~/hyperdata/trans-apps/apps/my-app
```

The framework:
1. Resolves app path via `AppManager.resolveAppPath()`
2. Loads `transmissions.ttl` and `config.ttl` from app directory
3. Initializes `ModuleLoader` with app's processor path
4. Loads processors from app directory if they exist

### Debugging Path Issues

```bash
# Run with verbose and debug logging
LOG_LEVEL=debug ./trans -v ~/hyperdata/trans-apps/apps/my-app
```

Look for these log lines:
```
AppManager.initModuleLoader
Module path = /home/danny/hyperdata/trans-apps/apps/my-app/processors
ModuleLoader initialized with paths:
```

## Custom Processors in Remote Apps

If your remote app needs custom processors:

### 1. Create Processor

```bash
mkdir -p ~/hyperdata/trans-apps/apps/my-app/processors
```

**processors/MyProcessor.js:**
```javascript
import Processor from '../../../../../../transmissions/src/model/Processor.js'
import logger from '../../../../../../transmissions/src/utils/Logger.js'
import ns from '../../../../../../transmissions/src/utils/ns.js'

class MyProcessor extends Processor {
    async process(message) {
        logger.debug('MyProcessor.process')
        // Your logic here
        return this.emit('message', message)
    }
}

export default MyProcessor
```

### 2. Create Factory

**processors/MyProcessorsFactory.js:**
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

### 3. Register Factory

⚠️ **Issue**: Remote processor factories currently need registration in core `AbstractProcessorFactory.js`.

**Workaround**: For truly remote processors, consider:
- Contributing generic processors to core
- Using existing processors creatively
- Proposing dynamic factory loading feature

## Known Limitations

From `src/apps/test/module-load/about.md`:

1. **Path Resolution Issues**: Module loader may attempt to load from core apps directory instead of remote path
2. **Import Path Complexity**: Remote processors need long relative import paths
3. **Factory Registration**: Remote factories not automatically registered

## Testing Remote Apps

### Path Verification

```bash
# Check app directory exists
ls -la ~/hyperdata/trans-apps/apps/my-app/

# Verify transmissions.ttl
cat ~/hyperdata/trans-apps/apps/my-app/transmissions.ttl

# Run with verbose
./trans ~/hyperdata/trans-apps/apps/my-app -v
```

### Module Loading Test

```bash
# Test with debug logging
LOG_LEVEL=debug ./trans ~/hyperdata/trans-apps/apps/my-app -v 2>&1 | grep -i "module"
```

Expected output includes:
```
AppManager.initModuleLoader
Module path = /path/to/your/app/processors
```

## Version Control

Remote apps can have independent repositories:

```bash
cd ~/hyperdata/trans-apps/apps/my-app

# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Add remote
git remote add origin https://github.com/user/my-transmissions-app.git
```

## Distribution

### Packaging

```bash
# Create distributable package
cd ~/hyperdata/trans-apps/apps
tar -czf my-app.tar.gz my-app/
```

### Installation Instructions

In your README:
```markdown
# Installation

1. Install Transmissions framework
2. Extract app:
   ```sh
   mkdir -p ~/hyperdata/trans-apps/apps
   cd ~/hyperdata/trans-apps/apps
   tar -xzf my-app.tar.gz
   ```
3. Run:
   ```sh
   cd /path/to/transmissions
   ./trans ~/hyperdata/trans-apps/apps/my-app
   ```
```

## Best Practices

1. **Document paths**: Always include full path in about.md
2. **Test loading**: Verify module loading with debug output
3. **Minimize custom processors**: Use core processors when possible
4. **Version framework**: Document required framework version
5. **Independent repo**: Consider separate git repository

## Troubleshooting

**App not found:**
```bash
# Verify path
ls -la ~/hyperdata/trans-apps/apps/my-app/

# Check from transmissions dir
cd /home/danny/hyperdata/transmissions
pwd
./trans ~/hyperdata/trans-apps/apps/my-app -v
```

**Module loading errors:**
```bash
# Check module path logs
LOG_LEVEL=debug ./trans -v ~/hyperdata/trans-apps/apps/my-app 2>&1 | grep -A5 "ModuleLoader"
```

**Processor not found:**
- Verify processor exists in core (`src/processors/`)
- Check custom processor factory registration
- Review import paths in custom processors

## Migration from Core

To move a core app to remote:

```bash
# Copy app
cp -r src/apps/my-app ~/hyperdata/trans-apps/apps/

# Update about.md with new path
# Test
./trans ~/hyperdata/trans-apps/apps/my-app -v

# If successful, remove from core
rm -rf src/apps/my-app
```

## Next Steps

1. Set up remote apps directory
2. Create or copy your app
3. Test module loading thoroughly
4. Document any custom processors
5. Consider version control setup
6. Create distribution package if needed
