# Implementation Sequence: Core Components

## 1. ProcessorSettings Tests
```javascript
import { expect } from 'chai';
import rdf from 'rdf-ext';
import ProcessorSettings from '../../src/processors/base/ProcessorSettings.js';
import ns from '../../utils/ns.js';

describe('ProcessorSettings', () => {
    let settings;
    let config;
    
    beforeEach(() => {
        const dataset = rdf.dataset();
        config = { dataset };
        settings = new ProcessorSettings(config);
    });

    describe('getValues()', () => {
        it('should return array with single value', () => {
            const subject = addTestData('config', {
                testProp: 'value1'
            });
            settings.settingsNode = subject;

            const values = settings.getValues(ns.trn.testProp);
            expect(values).to.be.an('array').with.lengthOf(1);
            expect(values[0]).to.equal('value1');
        });

        it('should return array with multiple values', () => {
            const subject = addTestData('config', {
                testProp: ['value1', 'value2', 'value3']
            });
            settings.settingsNode = subject;

            const values = settings.getValues(ns.trn.testProp);
            expect(values).to.be.an('array').with.lengthOf(3);
            expect(values).to.include('value1');
            expect(values).to.include('value2');
            expect(values).to.include('value3');
        });

        it('should handle referenced settings', () => {
            const refSubject = addTestData('ref', {
                testProp: ['refValue1', 'refValue2']
            });
            
            const mainSubject = addTestData('config', {});
            dataset.add(rdf.quad(
                mainSubject,
                ns.trn.settings,
                refSubject
            ));
            
            settings.settingsNode = mainSubject;
            const values = settings.getValues(ns.trn.testProp);
            expect(values).to.be.an('array').with.lengthOf(2);
        });
    });
});
```

## 2. ProcessorSettings Implementation
```javascript
import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';

class ProcessorSettings {
    constructor(config) {
        this.config = config;
        this.settingsNode = null;
    }

    getValues(property, fallback = undefined) {
        if (!this.config?.dataset || !this.settingsNode) {
            return fallback ? [fallback] : [];
        }

        const values = [];
        const dataset = this.config.dataset;

        // Direct properties
        for (const quad of dataset.match(this.settingsNode, property)) {
            values.push(quad.object.value);
        }
        
        if (values.length > 0) {
            return values;
        }

        // Referenced settings
        for (const settingsQuad of dataset.match(
            this.settingsNode, 
            ns.trn.settings
        )) {
            const settingsId = settingsQuad.object;
            for (const quad of dataset.match(settingsId, property)) {
                values.push(quad.object.value);
            }
            if (values.length > 0) {
                return values;
            }
        }

        return fallback ? [fallback] : [];
    }

    getValue(property, fallback = undefined) {
        const values = this.getValues(property, fallback);
        return values.length > 0 ? values[0] : fallback;
    }
}

export default ProcessorSettings;
```

## 3. Processor Class Update
```javascript
import { EventEmitter } from 'events';
import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';
import ProcessorSettings from './ProcessorSettings.js';

class Processor extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.settings = new ProcessorSettings(config);
        this.messageQueue = [];
        this.processing = false;
        this.outputs = [];
    }

    getValues(property, fallback) {
        logger.debug(`Processor.getValues looking for ${property}`);
        
        const shortName = ns.getShortname(property);
        if (this.message && this.message[shortName]) {
            return [this.message[shortName]];
        }

        this.settings.settingsNode = this.settingsNode;
        return this.settings.getValues(property, fallback);
    }

    getProperty(property, fallback) {
        return this.settings.getValue(property, fallback);
    }

    // Rest of Processor implementation...
}

export default Processor;
```

## Testing Strategy
1. Unit test each method in isolation
2. Test error conditions explicitly
3. Test with various RDF dataset structures
4. Verify backward compatibility
5. Test edge cases with empty/invalid data

## Success Criteria for Core Phase
1. All unit tests passing
2. No regressions in existing functionality
3. Clear separation of concerns between Processor and ProcessorSettings
4. Proper error handling
5. Complete type consistency
