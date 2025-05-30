# JSDoc Documentation Structure Guide

## Overview
This guide establishes the hierarchical documentation structure for the Transmissions framework using JSDoc namespaces and modules.

## Main Namespace Structure

### Core Modules
```javascript
/**
 * @namespace Transmissions
 * @description Dataflow processing framework for JavaScript applications
 */

/**
 * @namespace Transmissions.Engine
 * @description Core engine components for managing applications and transmissions
 * @memberof Transmissions
 */

/**
 * @namespace Transmissions.Model
 * @description Data models and base classes
 * @memberof Transmissions
 */

/**
 * @namespace Transmissions.API
 * @description Public interfaces (CLI, HTTP)
 * @memberof Transmissions
 */

/**
 * @namespace Transmissions.Utils
 * @description Utility functions and helpers
 * @memberof Transmissions
 */
```

### Processor Hierarchy
```javascript
/**
 * @namespace Transmissions.Processors
 * @description All processor implementations
 * @memberof Transmissions
 */

/**
 * @namespace Transmissions.Processors.Flow
 * @description Control flow processors (Fork, NOP, DeadEnd, etc.)
 * @memberof Transmissions.Processors
 */

/**
 * @namespace Transmissions.Processors.FileSystem
 * @description File system operations (FileReader, FileWriter, etc.)
 * @memberof Transmissions.Processors
 */

/**
 * @namespace Transmissions.Processors.Text
 * @description Text processing and templating
 * @memberof Transmissions.Processors
 */

/**
 * @namespace Transmissions.Processors.HTTP
 * @description HTTP client and server processors
 * @memberof Transmissions.Processors
 */

/**
 * @namespace Transmissions.Processors.SPARQL
 * @description SPARQL query and update processors
 * @memberof Transmissions.Processors
 */

/**
 * @namespace Transmissions.Processors.JSON
 * @description JSON manipulation processors
 * @memberof Transmissions.Processors
 */
```

## Class Documentation Pattern

### Base Processor Example
```javascript
/**
 * @class Processor
 * @memberof Transmissions.Model
 * @description Base class for all processors in the Transmissions framework
 * @extends EventEmitter
 */

/**
 * @class FileReader
 * @memberof Transmissions.Processors.FileSystem
 * @extends Processor
 * @description Reads files from the filesystem and emits content as messages
 * 
 * @example
 * // Usage in transmission
 * :fileReader a :FileReader ;
 *     :settings [
 *         :sourceFile "input.txt" ;
 *         :targetField "content"
 *     ] .
 */
```

### Engine Components
```javascript
/**
 * @class AppManager
 * @memberof Transmissions.Engine
 * @description Manages application lifecycle and transmission execution
 */

/**
 * @class TransmissionBuilder
 * @memberof Transmissions.Engine  
 * @description Constructs transmission pipelines from RDF configurations
 */
```

## Implementation Strategy

### Step 1: Add namespace declarations to index files
Create `src/index.js` with namespace declarations:

```javascript
/**
 * @namespace Transmissions
 * @description Dataflow processing framework for JavaScript applications
 */

/**
 * @namespace Transmissions.Engine
 * @memberof Transmissions
 */

/**
 * @namespace Transmissions.Model  
 * @memberof Transmissions
 */

/**
 * @namespace Transmissions.Processors
 * @memberof Transmissions
 */

/**
 * @namespace Transmissions.Processors.Flow
 * @memberof Transmissions.Processors
 */

/**
 * @namespace Transmissions.Processors.FileSystem
 * @memberof Transmissions.Processors
 */

// ... other processor namespaces
```

### Step 2: Update class declarations
Add `@memberof` tags to existing classes:

```javascript
/**
 * @class DeadEnd
 * @memberof Transmissions.Processors.Flow
 * @extends Processor
 * @description Terminates the pipeline without error
 */
class DeadEnd extends Processor {
    // ...
}
```

### Step 3: Group processors by functionality
Use consistent naming for processor groups:
- `Flow` - Control flow (Fork, NOP, DeadEnd, etc.)
- `FileSystem` - File operations (FileReader, FileWriter, etc.)  
- `Text` - Text processing (Templater, Escaper, etc.)
- `HTTP` - Network operations
- `SPARQL` - RDF/SPARQL operations
- `JSON` - JSON manipulation
- `Markup` - HTML/Markdown processing

## Custom Categories
Use `@category` tags for additional grouping:

```javascript
/**
 * @class FileReader
 * @memberof Transmissions.Processors.FileSystem
 * @category Input
 * @description Reads files and directories
 */

/**
 * @class FileWriter  
 * @memberof Transmissions.Processors.FileSystem
 * @category Output
 * @description Writes content to files
 */
```

This creates sub-categories within processor groups for better organization.
