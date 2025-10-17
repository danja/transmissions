# GOTO Processor

The GOTO processor enables dynamic execution of other transmissions within the Transmissions framework, providing powerful flow control and subroutine functionality.

## Overview

GOTO allows a transmission to dynamically call and execute another transmission, passing the current message through the target transmission's pipeline. This enables patterns like:

- **Conditional branching**: Route to different processing paths
- **Subroutine calls**: Reusable processing modules
- **Dynamic workflows**: Runtime determination of execution paths
- **Modular composition**: Break complex workflows into manageable pieces

## Basic Usage

### Configuration

**transmissions.ttl:**
```turtle
@prefix : <http://purl.org/stuff/transmissions/> .

:main-workflow a :EntryTransmission ;
    :pipe (:start :conditional-goto :end) .

:start a :NOP .

:conditional-goto a :GOTO ;
    :settings :targetConfig .

:end a :ShowMessage .

# Target transmissions (subroutines)
:process-a a :Transmission ;
    :pipe (:step1 :step2) .

:process-b a :Transmission ;
    :pipe (:stepX :stepY) .

:step1 a :NOP .
:step2 a :ShowMessage .
:stepX a :NOP .
:stepY a :ShowMessage .
```

**config.ttl:**
```turtle
@prefix : <http://purl.org/stuff/transmissions/> .

:targetConfig a :ConfigSet ;
    :gotoTarget "process-a" .
```

### Execution Flow

1. Main transmission `main-workflow` starts (marked as `:EntryTransmission`)
2. `start` processor executes
3. `conditional-goto` (GOTO) processor:
   - Reads target from config: `"process-a"`
   - Finds transmission `process-a`
   - Executes `process-a` with current message
   - Continues with result
4. `end` processor executes with result from `process-a`

## Target Specification

The GOTO target can be specified in multiple ways, following standard `getProperty()` priority:

### 1. Message Property (Highest Priority)

```javascript
// Runtime target selection
message.gotoTarget = "process-b"  // Overrides config
```

### 2. Configuration (Default)

```turtle
:targetConfig a :ConfigSet ;
    :gotoTarget "process-a" .
```

### 3. Fallback Value

```javascript
// In GOTO processor
const target = super.getProperty(ns.trn.gotoTarget, "default-process")
```

## Target Format

GOTO targets can be specified as:

### String ID (Recommended)
```turtle
:gotoTarget "process-name" .
```
- Automatically converted to full URI: `http://purl.org/stuff/transmissions/process-name`
- Clean and readable
- Works with both config and message properties

### Full URI
```turtle
:gotoTarget <http://purl.org/stuff/transmissions/process-name> .
```
- Explicit URI reference
- Useful for cross-namespace references

### RDF Reference
```turtle
:gotoTarget :process-name .
```
- Direct RDF node reference
- Must resolve to a valid transmission

## Entry Transmissions vs Target Transmissions

### Entry Transmissions (`:EntryTransmission`)

Entry transmissions are automatically executed when the application starts:

```turtle
:main-app a :EntryTransmission ;  # Auto-executed
    :pipe (:processor1 :goto-step :processor2) .
```

### Target Transmissions (`:Transmission`)

Target transmissions are available for GOTO calls but don't auto-execute:

```turtle
:subroutine a :Transmission ;     # Available for GOTO, no auto-execution
    :pipe (:sub-step1 :sub-step2) .
```

### Backward Compatibility

If no `:EntryTransmission` types are found, the system falls back to original behavior (runs all transmissions). This ensures existing applications continue working without modification.

## Advanced Patterns

### 1. Conditional Routing

Use message properties to determine target at runtime:

**Processor setting target:**
```javascript
// In a custom processor
if (condition) {
    message.gotoTarget = "success-path"
} else {
    message.gotoTarget = "error-path"
}
```

**GOTO processor:**
```turtle
:router a :GOTO ;
    :settings :dynamicTarget .
```

### 2. Subroutine Library

Create reusable processing modules:

```turtle
# Main workflow
:data-processor a :EntryTransmission ;
    :pipe (:validate :process :finalize) .

:validate a :GOTO ;
    :settings :validationTarget .

:process a :GOTO ;
    :settings :processingTarget .

:finalize a :ShowMessage .

# Reusable subroutines
:validate-user-data a :Transmission ;
    :pipe (:check-schema :check-permissions) .

:validate-file-data a :Transmission ;
    :pipe (:check-format :check-size) .

:process-batch a :Transmission ;
    :pipe (:split-batch :process-items :aggregate) .

:process-single a :Transmission ;
    :pipe (:transform :validate-output) .
```

**Dynamic configuration:**
```javascript
// Route based on data type
if (message.dataType === "user") {
    message.gotoTarget = "validate-user-data"
} else if (message.dataType === "file") {
    message.gotoTarget = "validate-file-data"
}
```

### 3. Error Handling

GOTO provides graceful error handling:

```javascript
// In GOTO processor
try {
    const result = await targetTransmission.process(message)
    return this.emit('message', result)
} catch (error) {
    logger.error(`GOTO: Error executing '${targetId}': ${error.message}`)
    // Continue with original message on error
    return this.emit('message', message)
}
```

### 4. Nested GOTO Calls

Target transmissions can contain their own GOTO processors:

```turtle
:main a :EntryTransmission ;
    :pipe (:start :goto1) .

:level1 a :Transmission ;
    :pipe (:process1 :goto2) .

:level2 a :Transmission ;
    :pipe (:process2 :final) .
```

This creates a call stack: `main` → `level1` → `level2`

## Implementation Details

### Transmission Lookup

The GOTO processor uses `ProcessorImpl.findTransmission()` to locate targets:

```javascript
findTransmission(targetId) {
    // Convert short name to full URI if needed
    let fullUri = targetId
    if (!targetId.startsWith('http://')) {
        fullUri = `http://purl.org/stuff/transmissions/${targetId}`
    }

    // Search app.transmissions array
    for (const transmission of this.app.transmissions) {
        if (transmission.id === fullUri) {
            return transmission
        }
    }
    return null
}
```

### Message Flow

1. **GOTO receives message** from previous processor
2. **Target resolution** via `getProperty(ns.trn.gotoTarget)`
3. **Transmission lookup** in app registry
4. **Target execution** with current message
5. **Result forwarding** to next processor in main pipeline

### Registry Access

All transmissions are stored in `app.transmissions` array, making them accessible to GOTO processors regardless of whether they're entry points or targets.

## Error Scenarios

### Missing Target

```
GOTO: Target transmission 'nonexistent' not found, continuing with current message
```

The processor logs a warning and continues with the original message.

### Execution Error

```
GOTO: Error executing target transmission 'faulty-target': ReferenceError: undefined variable
```

The processor logs the error and continues with the original message.

### Missing Property

```
GOTO: No target transmission specified, continuing with current message
```

If no `gotoTarget` property is found, the processor passes the message through unchanged.

## Testing

Example test execution:

```bash
./trans goto
```

Expected output:
```
+ Run Transmission : goto-test
|-> p10 a GOTO
+ Run Transmission : goto-target1
|-> p100 a ShowMessage
[target execution output]
|-> p20 a ShowMessage
[main pipeline continuation]
```

## Best Practices

### 1. Clear Naming

Use descriptive names for target transmissions:
- ✅ `validate-user-input`
- ✅ `process-payment`
- ❌ `target1`
- ❌ `proc`

### 2. Document Dependencies

Include comments showing GOTO relationships:

```turtle
# Main workflow - calls validation and processing subroutines
:user-registration a :EntryTransmission ;
    :pipe (:collect-data :validate-goto :process-goto :confirm) .

# Called by validate-goto
:validate-user-data a :Transmission ;
    :pipe (:check-email :check-password :check-terms) .

# Called by process-goto
:process-registration a :Transmission ;
    :pipe (:create-account :send-email :update-metrics) .
```

### 3. Error Boundaries

Design target transmissions to handle their own errors gracefully rather than relying on GOTO's error handling.

### 4. Avoid Deep Nesting

Limit GOTO call depth to maintain readability and debugging ease. Consider refactoring deeply nested calls into sequential processing.

### 5. Test Isolation

Target transmissions should be testable independently:

```bash
# Test individual target
./trans goto.validate-user-data

# Test main workflow
./trans goto
```

## Performance Considerations

- **Transmission Lookup**: O(n) search through transmission registry
- **Memory Usage**: All transmissions loaded regardless of usage
- **Execution Overhead**: Additional promise/event handling for target execution
- **Debugging**: Call stack includes nested transmission paths

## Comparison with Other Flow Control

| Feature | GOTO | Nested Transmissions | Fork/Choice |
|---------|------|---------------------|-------------|
| **Dynamic Targets** | ✅ Runtime selection | ❌ Static definition | ❌ Static branches |
| **Reusability** | ✅ Shared subroutines | ❌ Embedded only | ❌ Local branches |
| **Complexity** | Medium | Low | Low |
| **Performance** | Medium | High | High |
| **Use Case** | Conditional routing, subroutines | Hierarchical composition | Parallel processing |

The GOTO processor provides unique capabilities for dynamic flow control that complement the existing nested transmission and flow control features of the Transmissions framework.