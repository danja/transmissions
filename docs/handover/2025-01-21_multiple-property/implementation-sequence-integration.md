# Implementation Sequence: Integration and Refinement

## 1. StringFilter Update
```javascript
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';
import ns from '../../utils/ns.js';

class StringFilter extends Processor {
    constructor(config) {
        super(config);
        this.initialized = false;
        this.includePatterns = [];
        this.excludePatterns = [];
    }

    async initialize() {
        if (this.initialized) return;

        try {
            const includeStr = this.getValues(ns.trn.includePatterns);
            const excludeStr = this.getValues(ns.trn.excludePatterns);
            
            this.includePatterns = this.normalizePatterns(includeStr);
            this.excludePatterns = this.normalizePatterns(excludeStr);
            
            const singleIncludes = this.getValues(ns.trn.includePattern);
            const singleExcludes = this.getValues(ns.trn.excludePattern);

            this.includePatterns.push(...singleIncludes);
            this.excludePatterns.push(...singleExcludes);

            this.initialized = true;
        } catch (err) {
            logger.error('Failed to initialize StringFilter:', err);
            throw err;
        }
    }

    normalizePatterns(patterns) {
        return patterns
            .flatMap(p => p.split(','))
            .map(p => p.trim())
            .filter(p => p.length > 0);
    }

    async process(message) {
        await this.initialize();
        // Process implementation...
    }
}

export default StringFilter;
```

## 2. Integration Tests
```javascript
import { expect } from 'chai';
import path from 'path';
import StringFilter from '../../src/processors/text/StringFilter.js';
import { createTestConfig } from '../helpers/test-utils.js';

describe('StringFilter Integration', () => {
    let filter;
    let config;
    
    beforeEach(async () => {
        config = await createTestConfig(`
            @prefix : <http://purl.org/stuff/transmissions/> .
            
            :filterConfig a :ConfigSet ;
                :excludePatterns "pattern1,pattern2" ;
                :excludePattern "pattern3" ;
                :excludePattern "pattern4" .
        `);
        filter = new StringFilter(config);
    });

    it('should handle both pattern styles', async () => {
        await filter.initialize();
        expect(filter.excludePatterns).to.have.members([
            'pattern1',
            'pattern2',
            'pattern3',
            'pattern4'
        ]);
    });

    it('should normalize patterns correctly', () => {
        const patterns = filter.normalizePatterns([
            'one, two',
            'three',
            'four,  five'
        ]);
        expect(patterns).to.have.members([
            'one',
            'two',
            'three',
            'four',
            'five'
        ]);
    });
});
```

## 3. Performance Optimization
```javascript
class ProcessorSettings {
    constructor(config) {
        this.config = config;
        this.settingsNode = null;
        this.cache = new Map();
    }

    getCacheKey(property) {
        return `${this.settingsNode?.value}:${property.value}`;
    }

    getValues(property, fallback = undefined) {
        const cacheKey = this.getCacheKey(property);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const values = this.fetchValues(property, fallback);
        this.cache.set(cacheKey, values);
        return values;
    }

    clearCache() {
        this.cache.clear();
    }
}
```

## 4. Type System Integration
```typescript
// types/processors.d.ts
import { Term, Dataset } from '@rdfjs/types';

interface ProcessorConfig {
    dataset: Dataset;
    [key: string]: any;
}

interface ProcessorSettings {
    config: ProcessorConfig;
    settingsNode: Term | null;
    getValues(property: Term, fallback?: any): string[];
    getValue(property: Term, fallback?: any): string;
    clearCache(): void;
}

interface Processor {
    settings: ProcessorSettings;
    config: ProcessorConfig;
    messageQueue: any[];
    processing: boolean;
    outputs: any[];
    getValues(property: Term, fallback?: any): string[];
    getProperty(property: Term, fallback?: any): string;
}

interface StringFilterConfig extends ProcessorConfig {
    includePatterns?: string[];
    excludePatterns?: string[];
    includePattern?: string;
    excludePattern?: string;
}
```

## 5. Integration Test Config Example
```turtle
# test_string_filter/config.ttl
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix : <http://purl.org/stuff/transmissions/> .

:filterConfig a :ConfigSet ;
    :settings :filterDefaults ;
    # Pattern style 1
    :excludePatterns "node_modules/*,dist/*" ;
    # Pattern style 2
    :excludePattern "build/*" ;
    :excludePattern ".git/*" .

:testDirConfig a :ConfigSet ;
    :sourceDir "./test-data" ;
    :fileTypes "*.js,*.jsx,*.ts" .
```

## Integration Success Criteria
1. All patterns correctly processed
2. Performance within bounds:
   - Pattern initialization < 5ms
   - Pattern matching < 1ms per file
3. Memory usage stable
4. No memory leaks
5. Cache hit rate > 90%
6. Type safety maintained
7. Error handling verified
