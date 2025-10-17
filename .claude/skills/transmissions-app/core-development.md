# Core Development Guide

## Overview

Core development means creating your app directly within the Transmissions framework repository at `/home/danny/hyperdata/transmissions/src/apps/`.

## Advantages

- **Simple**: No module loading configuration needed
- **Debugging**: Direct access to framework code
- **Testing**: Integrated with framework test suite
- **Discovery**: Easy to see other apps as examples

## Best For

- Learning the framework
- Prototyping new ideas
- Contributing example apps
- Framework development/testing

## Directory Structure

```
src/apps/{YOUR_APP}/
├── transmissions.ttl    # Required: Pipeline definition
├── config.ttl          # Optional: Configuration
├── about.md            # Required: Documentation
└── data/               # Optional: Working files
```

## Step-by-Step Setup

### 1. Copy Example App

```bash
cd /home/danny/hyperdata/transmissions
cp -r src/apps/example-app src/apps/my-new-app
```

### 2. Customize Files

**about.md:**
```markdown
# My New App

## Runner
```sh
./trans my-new-app
```

## Description
Description of what your app does.
```

**transmissions.ttl:**
```turtle
@prefix : <http://purl.org/stuff/transmissions/> .

:my-new-app a :EntryTransmission ;
    :pipe (:step1 :step2 :step3) .

:step1 a :FileReader ;
    :settings :inputSettings .

:step2 a :SomeProcessor ;
    :settings :processingSettings .

:step3 a :FileWriter ;
    :settings :outputSettings .

:inputSettings a :ConfigSet ;
    :filename "input.txt" .

:processingSettings a :ConfigSet ;
    :someOption "value" .

:outputSettings a :ConfigSet ;
    :filename "output.txt" .
```

### 3. Run Your App

```bash
# Basic run
./trans my-new-app

# Verbose mode (recommended during development)
./trans my-new-app -v

# With custom message
./trans my-new-app -m '{"customField": "value"}'
```

## Common Patterns

### Linear Pipeline
```turtle
:simple-pipeline a :EntryTransmission ;
    :pipe (:input :process :output) .
```

### Conditional Flow
```turtle
:conditional-app a :EntryTransmission ;
    :pipe (:input :decision :output) .

:decision a :Choice ;
    :settings [
        :testProperty "type" ;
        :testOperator "equals" ;
        :testValue "premium" ;
        :trueProperty "path" ;
        :trueValue "premium-processing" ;
        :falseProperty "path" ;
        :falseValue "standard-processing"
    ] .
```

### SPARQL Integration
```turtle
:sparql-app a :EntryTransmission ;
    :pipe (:query :process :update) .

:query a :SPARQLSelect ;
    :settings [
        :endpoint "http://localhost:3030/dataset/query" ;
        :sparql """
            SELECT ?item ?value WHERE {
                ?item ex:property ?value .
            }
        """
    ] .
```

## Testing

### Manual Testing
```bash
# Test with verbose logging
./trans my-new-app -v

# Test with different inputs
./trans my-new-app -m '{"test": true}'
```

### Integration Testing
Add to `tests/integration/apps.json`:
```json
{
    "command": "./trans my-new-app",
    "label": "my-new-app",
    "description": "Test my new app functionality",
    "requiredMatchCount": 1
}
```

### Unit Testing
Create test apps in `src/apps/test/`:
```
src/apps/test/my-new-app-basic/
src/apps/test/my-new-app-errors/
```

## Debugging

### Add Debug Processors

```turtle
:SM a :ShowMessage .  # Display message contents
:SC a :ShowConfig .   # Display configuration
:N  a :NOP .          # No-operation marker
```

Use in pipeline:
```turtle
:debug-pipeline a :EntryTransmission ;
    :pipe (:step1 :SM :step2 :SM :step3) .
```

### Verbose Logging

```bash
LOG_LEVEL=debug ./trans my-new-app -v
```

## File Organization

```
src/apps/my-new-app/
├── transmissions.ttl       # Main pipeline
├── config.ttl             # Configuration
├── about.md               # Documentation
├── data/                  # Working directory
│   ├── input/            # Input files
│   └── output/           # Output files
└── tt.ttl                # Optional target config
```

## Version Control

Core apps are part of the framework repository:

```bash
# Add your app
git add src/apps/my-new-app/

# Commit
git commit -m "Add my-new-app application"
```

Exclude data directory if it contains generated/temporary files:
```bash
echo "src/apps/my-new-app/data/" >> .gitignore
```

## Next Steps

1. Implement your pipeline in transmissions.ttl
2. Add configuration in config.ttl
3. Test thoroughly with `-v` flag
4. Document in about.md
5. Consider adding integration tests

## Migration to Remote

If your app grows complex or needs distribution:
1. Copy app directory to `~/hyperdata/trans-apps/apps/`
2. Follow [remote-development.md](remote-development.md)
3. Test module loading
4. Update documentation paths
