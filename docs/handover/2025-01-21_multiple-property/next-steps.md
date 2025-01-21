# Next Steps: Multiple Property Values Implementation

## 1. Update StringFilter Processor
### Implementation Tasks
```javascript
// Required changes to StringFilter class
class StringFilter extends Processor {
    async initialize() {
        if (this.initialized) return;

        const includeStr = this.getValues(ns.trn.includePatterns);
        const excludeStr = this.getValues(ns.trn.excludePatterns);
        
        // Handle both single property multi-value and multiple property patterns
        this.includePatterns = this.normalizePatterns(includeStr);
        this.excludePatterns = this.normalizePatterns(excludeStr);
        
        // Add single property pattern support
        const singleExcludes = this.getValues(ns.trn.excludePattern);
        if (singleExcludes.length > 0) {
            this.excludePatterns.push(...singleExcludes);
        }

        this.initialized = true;
    }

    normalizePatterns(patterns) {
        return patterns
            .flatMap(p => p.split(','))
            .map(p => p.trim())
            .filter(p => p.length > 0);
    }
}
```

### Test Cases to Add
1. Single property multi-value pattern
2. Multiple properties single-value pattern
3. Mixed pattern usage
4. Empty/invalid patterns
5. Pattern normalization
6. Performance benchmarks

## 2. Integration Tests
### Test Application Creation
```turtle
# test_multi_pattern/transmissions.ttl
:test_multi_pattern a trn:Transmission ;
    trn:pipe (:p10 :p20 :p30) .

:p10 a :DirWalker .
:p20 a :StringFilter ;
    trn:settings :filterConfig .
:p30 a :ShowMessage .

# test_multi_pattern/config.ttl
:filterConfig a trn:ConfigSet ;
    # Test both patterns
    trn:excludePatterns "pattern1,pattern2" ;
    trn:excludePattern "pattern3" ;
    trn:excludePattern "pattern4" .
```

### Test Scenarios
1. Directory scanning with mixed patterns
2. Pattern matching accuracy
3. Performance with large pattern sets
4. Error handling
5. Memory usage

## 3. Documentation Updates

### API Documentation
```javascript
/**
 * Get multiple values for a property
 * @param {RDF.Term} property - The RDF property term
 * @param {any} fallback - Optional fallback value
 * @returns {string[]} Array of property values
 * @example
 * const patterns = processor.getValues(ns.trn.excludePatterns);
 * // ['pattern1', 'pattern2', 'pattern3']
 */
getValues(property, fallback)
```

### Usage Examples
1. Configuration patterns
2. Migration guide
3. Best practices
4. Performance considerations

## 4. Performance Optimization

### Areas to Profile
1. RDF dataset traversal
2. Pattern normalization
3. Multiple property lookup
4. Memory usage

### Optimization Options
1. Pattern caching
2. Lazy initialization
3. Memory optimizations
4. Query optimization

## 5. TypeScript Definitions

### Core Types
```typescript
interface RDFTerm {
    termType: string;
    value: string;
}

interface ProcessorSettings {
    getValues(property: RDFTerm, fallback?: any): string[];
    getValue(property: RDFTerm, fallback?: any): string;
}

interface Processor {
    settings: ProcessorSettings;
    getValues(property: RDFTerm, fallback?: any): string[];
    getProperty(property: RDFTerm, fallback?: any): string;
}
```

### Configuration Types
```typescript
interface ConfigSet {
    type: 'ConfigSet';
    settings?: RDFTerm;
    [key: string]: string | string[] | RDFTerm;
}
```

## 6. Acceptance Criteria

### Functionality
- [ ] Both pattern styles work correctly
- [ ] Backward compatibility maintained
- [ ] All tests passing
- [ ] Documentation complete
- [ ] TypeScript support added

### Performance
- [ ] Pattern matching under 1ms
- [ ] Memory usage stable
- [ ] No memory leaks
- [ ] Efficient with large datasets

### Code Quality
- [ ] 100% test coverage
- [ ] No linting errors
- [ ] TypeScript types complete
- [ ] Documentation up to date

## 7. Required Reviews

### Code Review Checklist
1. RDF term handling
2. Error handling
3. Performance considerations
4. Type safety
5. Testing coverage

### Documentation Review
1. API documentation
2. Usage examples
3. Migration guide
4. Type definitions

## 8. Future Considerations

### Potential Enhancements
1. Pattern validation
2. Advanced caching
3. Query optimization
4. Bulk operations

### Technical Debt
1. Remove deprecated methods
2. Clean up old patterns
3. Standardize error handling
4. Optimize imports

## 9. Dependencies

### Required Updates
1. RDF-ext version check
2. TypeScript compatibility
3. Test framework updates
4. Documentation tools

### Version Constraints
```json
{
  "rdf-ext": "^2.0.0",
  "typescript": "^4.9.0",
  "jest": "^29.0.0"
}
```

## 10. Timeline
1. StringFilter updates: 2 days
2. Integration tests: 2 days
3. Documentation: 1 day
4. Performance optimization: 2 days
5. TypeScript support: 1 day
6. Review & fixes: 2 days

## 11. Support Requirements
1. RDF expertise
2. TypeScript knowledge
3. Performance testing tools
4. Documentation tools

## 12. Risk Assessment

### Technical Risks
1. RDF query performance
2. Memory management
3. Type system complexity

### Mitigation Strategies
1. Comprehensive testing
2. Performance monitoring
3. Gradual rollout
4. Documentation updates
