# RDF-ext Patterns Reference Guide

## Core Concepts & Best Practices

### Dataset Creation
```javascript
// Create new empty dataset
const dataset = rdf.dataset();

// Clone existing dataset
const cloned = new Set([...existingDataset]);

// Dataset with initial quads
const dataset = rdf.dataset([quad1, quad2]);
```

### Term Creation
Always use explicit RDF term creation:
```javascript
// Named nodes (URIs)
const subject = rdf.namedNode('http://example.org/subject');
const predicate = rdf.namedNode('http://example.org/predicate');

// Literals
const literal = rdf.literal('value');
const typedLiteral = rdf.literal('123', 'http://www.w3.org/2001/XMLSchema#integer');
const langLiteral = rdf.literal('hello', 'en');

// Blank nodes
const blankNode = rdf.blankNode();
const namedBlank = rdf.blankNode('b1');
```

### Quad Operations
```javascript
// Create quad
const quad = rdf.quad(subject, predicate, object);

// Add to dataset
dataset.add(quad);

// Match patterns
const matches = dataset.match(
    subject,    // can be null for any
    predicate,  // can be null for any
    null        // can be null for any
);

// Iterate matches
for (const quad of matches) {
    console.log(quad.subject.value);
    console.log(quad.predicate.value);
    console.log(quad.object.value);
}
```

### Dataset Querying
```javascript
// Simple match
const directValues = dataset.match(
    settingsNode,
    propertyNode,
    null
);

// Chained matches
for (const settingsQuad of dataset.match(node, settingsRef)) {
    const settingsId = settingsQuad.object;
    const values = dataset.match(settingsId, property);
}
```

### Common Patterns

#### Value Extraction
```javascript
// Single value
function getValue(dataset, subject, predicate) {
    const matches = dataset.match(subject, predicate);
    for (const quad of matches) {
        return quad.object.value;
    }
    return undefined;
}

// Multiple values
function getValues(dataset, subject, predicate) {
    const values = [];
    for (const quad of dataset.match(subject, predicate)) {
        values.push(quad.object.value);
    }
    return values;
}
```

#### Pattern Matching
```javascript
// Find all subjects with a type
function findByType(dataset, type) {
    const matches = dataset.match(null, ns.rdf.type, type);
    return new Set([...matches].map(quad => quad.subject));
}

// Find related nodes
function findRelated(dataset, subject, predicate) {
    return new Set([...dataset.match(subject, predicate)]
        .map(quad => quad.object));
}
```

### Error Handling
```javascript
// Null checks
if (!dataset) {
    throw new Error('Dataset required');
}

// Term type checks
if (term.termType !== 'NamedNode') {
    throw new Error('Named node required');
}

// Dataset existence checks
const exists = dataset.match(subject, predicate).size > 0;
```

### Testing Patterns
```javascript
// Dataset setup
function createTestDataset() {
    const dataset = rdf.dataset();
    const subject = rdf.namedNode('http://example.org/test');
    dataset.add(rdf.quad(
        subject,
        rdf.namedNode('http://example.org/prop'),
        rdf.literal('test')
    ));
    return dataset;
}

// Matching assertions
expect([...dataset.match(subject, predicate)]).to.have.length(1);
expect(getValues(dataset, subject, predicate)).to.include('value');
```

### Performance Considerations

1. Use `match()` with more specific patterns when possible
2. Prefer direct dataset operations over graph traversal
3. Consider caching heavily used query results
4. Be aware of dataset size impacts
5. Use appropriate indexes for large datasets

### Common Issues

1. **Missing Term Creation**
   Problem: Using strings instead of RDF terms
   Solution: Always use explicit term creation methods

2. **Incorrect Matching**
   Problem: Missing or wrong term types in match patterns
   Solution: Verify term types and use nulls appropriately

3. **Memory Leaks**
   Problem: Keeping references to large datasets
   Solution: Clear references when done, use weak maps if needed

4. **Performance**
   Problem: Inefficient traversal patterns
   Solution: Use appropriate matching patterns and caching

### Debug Utilities
```javascript
// Dataset inspection
function debugDataset(dataset) {
    for (const quad of dataset) {
        console.log(
            quad.subject.value,
            quad.predicate.value,
            quad.object.value
        );
    }
}

// Match debugging
function debugMatches(dataset, subject, predicate) {
    console.log('Matching:', {
        subject: subject?.value,
        predicate: predicate?.value
    });
    for (const quad of dataset.match(subject, predicate)) {
        console.log('Match:', quad.object.value);
    }
}
```
