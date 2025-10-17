# Creating Applications

This guide explains how to create Transmissions applications - complete data processing workflows that solve specific problems.

## Application Structure

A Transmissions app is a directory containing:

```
my-app/
├── transmissions.ttl    # Required: Pipeline definitions
├── config.ttl          # Optional: Configuration data
├── about.md            # Optional: Documentation
└── data/               # Optional: Working directory for files
```

## Basic App Creation

### 1. Create App Directory

Apps live under `src/apps/`. For this example, we'll create a text processing app:

```bash
mkdir -p src/apps/text-processor
cd src/apps/text-processor
```

### 2. Create transmissions.ttl

This file defines your processing pipelines:

```turtle
# src/apps/text-processor/transmissions.ttl

@prefix : <http://purl.org/stuff/transmissions/> .

# Main processing pipeline
:text-processor a :EntryTransmission ;
    :pipe (
        :read-input
        :process-text
        :write-output
    ) .

# Read input file
:read-input a :FileReader ;
    :settings :inputSettings .

# Transform the text
:process-text a :StringReplace ;
    :settings :replaceSettings .

# Write result
:write-output a :FileWriter ;
    :settings :outputSettings .

# Configuration sets
:inputSettings a :ConfigSet ;
    :filename "input.txt" .

:replaceSettings a :ConfigSet ;
    :find "old" ;
    :replace "new" .

:outputSettings a :ConfigSet ;
    :filename "output.txt" .
```

### 3. Create config.ttl (Optional)

For reusable configuration data:

```turtle
# src/apps/text-processor/config.ttl

@prefix : <http://purl.org/stuff/transmissions/> .

:appConfig a :ConfigSet ;
    :inputDirectory "data/input" ;
    :outputDirectory "data/output" ;
    :logLevel "debug" .
```

### 4. Add Documentation

```markdown
# Text Processor App

Processes text files by replacing specified strings.

## Usage

```bash
./trans text-processor
```

## Configuration

- Input file: `data/input.txt`
- Output file: `data/output.txt`
- Replaces "old" with "new"
```

## Running Your App

Execute your app with:

```bash
./trans text-processor
```

Pass messages via command line:

```bash
./trans text-processor -m '{"filename": "custom.txt"}'
```

## App Patterns

### Simple Linear Pipeline

Process data through a sequence of steps:

```turtle
:linear-app a :EntryTransmission ;
    :pipe (:step1 :step2 :step3) .
```

### Conditional Processing

Use Choice for branching logic:

```turtle
:conditional-app a :EntryTransmission ;
    :pipe (
        :setup-data
        :make-choice
        :handle-result
    ) .

:make-choice a :Choice ;
    :settings [
        :testProperty "type" ;
        :testOperator "equals" ;
        :testValue "premium" ;
        :trueProperty "processing" ;
        :trueValue "premium-flow" ;
        :falseProperty "processing" ;
        :falseValue "standard-flow"
    ] .
```

### Multi-Stage Processing

Use GOTO for complex workflows:

```turtle
:main-flow a :EntryTransmission ;
    :pipe (
        :validate-input
        :route-to-processor
    ) .

:route-to-processor a :GOTO ;
    :settings [
        :gotoTarget "data-processor"
    ] .

:data-processor a :Transmission ;
    :pipe (
        :process-data
        :format-output
    ) .
```

### Parallel Processing

Use ForEach for arrays:

```turtle
:batch-processor a :EntryTransmission ;
    :pipe (
        :load-batch
        :process-each
        :collect-results
    ) .

:process-each a :ForEach ;
    :settings [
        :arrayProperty "items" ;
        :itemProperty "currentItem"
    ] .
```

## Configuration Strategies

### Inline Configuration

Settings defined directly in transmissions.ttl:

```turtle
:processor a :FileReader ;
    :settings [
        :filename "data.json" ;
        :encoding "utf8"
    ] .
```

### Named Configuration Sets

Reusable configuration objects:

```turtle
:processor a :FileReader ;
    :settings :fileConfig .

:fileConfig a :ConfigSet ;
    :filename "data.json" ;
    :encoding "utf8" .
```

### External Configuration

Reference config.ttl data:

```turtle
# In transmissions.ttl
:processor a :FileReader ;
    :settings :globalFileConfig .

# In config.ttl
:globalFileConfig a :ConfigSet ;
    :filename "shared-data.json" .
```

### Message-Driven Configuration

Use message properties for dynamic config:

```turtle
:dynamic-processor a :FileReader ;
    :settings [
        :filename "{{filename}}" ;  # Replaced with message.filename
        :path "{{inputPath}}"       # Replaced with message.inputPath
    ] .
```

## Error Handling

### Validation Processors

Add validation to catch errors early:

```turtle
:robust-app a :EntryTransmission ;
    :pipe (
        :validate-input
        :process-safely
        :handle-errors
    ) .
```

### Fallback Paths

Use Choice for error handling:

```turtle
:error-handler a :Choice ;
    :settings [
        :testProperty "error" ;
        :testOperator "exists" ;
        :trueProperty "goto" ;
        :trueValue "error-recovery" ;
        :falseProperty "goto" ;
        :falseValue "normal-flow"
    ] .
```

## Testing Your App

### Manual Testing

```bash
# Test with default settings
./trans my-app

# Test with custom message
./trans my-app -m '{"test": true}'

# Test with verbose output
./trans my-app -v
```

### Integration Testing

Add your app to `tests/integration/apps.json`:

```json
{
    "command": "./trans my-app",
    "label": "my-app",
    "description": "Test my custom app",
    "requiredMatchCount": 1
}
```

### Unit Testing

Create focused test apps for specific scenarios:

```
src/apps/test/my-app-basic/    # Basic functionality
src/apps/test/my-app-errors/   # Error conditions
src/apps/test/my-app-edge/     # Edge cases
```

## Best Practices

### App Design

1. **Single Responsibility**: Each app should solve one specific problem
2. **Clear Naming**: Use descriptive names for transmissions and processors
3. **Minimal Coupling**: Avoid dependencies between apps
4. **Configuration Externalization**: Keep settings configurable

### File Organization

1. **Consistent Structure**: Follow the standard app directory layout
2. **Documentation**: Always include about.md
3. **Data Separation**: Keep input/output data in data/ subdirectory
4. **Version Control**: Include apps in git, exclude data/

### Performance

1. **Resource Management**: Clean up file handles and connections
2. **Streaming**: Use streaming processors for large data
3. **Parallel Processing**: Use ForEach for independent operations
4. **Caching**: Cache expensive computations when appropriate

### Debugging

1. **ShowMessage**: Add debug processors to inspect message flow
2. **Logging**: Use appropriate log levels
3. **NOP Processors**: Add no-op processors for breakpoints
4. **Step-by-Step**: Test each processor individually

## Common App Types

### Data Transformation
- File format conversion
- Data cleaning and validation
- Content processing

### Web Integration
- API clients and servers
- Web scraping
- Content management

### Automation
- File system operations
- Batch processing
- Scheduled tasks

### Analysis
- Data aggregation
- Reporting
- Metrics collection

Your app will integrate seamlessly with the Transmissions framework, gaining access to all built-in processors and the powerful RDF-based configuration system.