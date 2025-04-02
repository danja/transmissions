# Transmissions Settings System

## Overview
The settings system provides configuration management for Transmissions processors using RDF-based configuration. It supports both direct value access and referenced settings through a flexible graph structure.

## Core Components

### ProcessorSettings
Base class providing configuration access methods:
- `getValue(property, fallback)`: Returns single value or fallback
- `getValues(property, fallback)`: Returns array of values or fallback

### TestSettings
Implementation demonstrating settings usage patterns:
- Direct property access
- Multiple value handling
- Fallback value support
- Message property preservation

## Configuration Format
Settings are defined in Turtle (.ttl) files:

```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix : <http://purl.org/stuff/transmissions/> .

:settingsSingle a :ConfigSet ;
    :name "Alice" .

:settingsMulti a :ConfigSet ;
    :setting "value1", "value2", "value3" .
```

## Usage Examples

### Simple Property Access
```javascript
const value = settings.getProperty(ns.trn.name)
```

### Multiple Values
```javascript
const values = settings.getValues(ns.trn.setting)
```

### Message Processing
```javascript
const result = await settings.process(message) 
```

## Best Practices
1. Always provide fallback values for optional settings
2. Use array methods for multiple value properties
3. Preserve existing message properties during processing
4. Validate required settings early
5. Document setting dependencies in processor code