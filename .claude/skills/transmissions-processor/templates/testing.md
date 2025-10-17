# Processor Testing Guide

## Testing Strategy

### 1. Unit Tests (Isolated)
Test processor logic in isolation

### 2. Integration Tests (Pipeline)
Test processor in complete pipeline

### 3. Manual Tests (Development)
Quick iteration during development

## Unit Testing

### Test Structure

```javascript
// tests/unit/processors/{Group}/{ProcessorName}.test.js

import { expect } from 'chai'
import {ProcessorName} from '../../../src/processors/{group}/{ProcessorName}.js'

describe('{ProcessorName}', () => {
    describe('Basic functionality', () => {
        it('should transform input correctly', async () => {
            const processor = new {ProcessorName}({})
            const message = {
                inputField: 'test-value'
            }

            await processor.process(message)

            expect(message.outputField).to.equal('expected-result')
        })
    })

    describe('Configuration', () => {
        it('should use default values', async () => {
            const processor = new {ProcessorName}({})
            const message = {}

            await processor.process(message)

            expect(message.result).to.exist
        })

        it('should use provided configuration', async () => {
            const config = {
                getProperty: (key, defaultValue) => {
                    if (key.value === 'settingName') return 'custom-value'
                    return defaultValue
                }
            }

            const processor = new {ProcessorName}(config)
            const message = { input: 'test' }

            await processor.process(message)

            expect(message.result).to.include('custom-value')
        })
    })

    describe('Error handling', () => {
        it('should handle missing input gracefully', async () => {
            const processor = new {ProcessorName}({})
            const message = {}

            await processor.process(message)

            expect(message.error).to.not.exist
        })

        it('should handle invalid input', async () => {
            const processor = new {ProcessorName}({})
            const message = { input: null }

            await processor.process(message)

            // Should not throw
            expect(message).to.exist
        })
    })

    describe('Done flag', () => {
        it('should skip processing when done is true', async () => {
            const processor = new {ProcessorName}({})
            const message = {
                done: true,
                input: 'should-not-process'
            }

            await processor.process(message)

            expect(message.output).to.not.exist
        })
    })
})
```

### Run Unit Tests

```bash
# Run all unit tests
npm test

# Run specific test file
npm test tests/unit/processors/{Group}/{ProcessorName}.test.js

# Run with coverage
npm run test:coverage
```

## Integration Testing

### Test App Structure

```
src/apps/test/{processor-name}-test/
├── transmissions.ttl    # Test pipeline
├── about.md            # Test documentation
└── data/               # Test data if needed
    ├── input/
    └── expected/
```

### Basic Integration Test

**transmissions.ttl:**
```turtle
@prefix : <http://purl.org/stuff/transmissions/> .

:test a :EntryTransmission ;
    :pipe (
        :setup
        :test-processor
        :verify
    ) .

:setup a :SetField ;
    :settings [
        :field "testInput" ;
        :value "test-value"
    ] .

:test-processor a :{ProcessorName} ;
    :settings [
        :inputField "testInput" ;
        :outputField "testOutput"
    ] .

:verify a :ShowMessage .
```

**about.md:**
```markdown
# {ProcessorName} Test

## Runner
```sh
./trans test.{processor-name}-test
```

## Description
Tests {ProcessorName} functionality with sample data.

## Expected Output
- testOutput should contain processed value
- No errors should occur
```

### Multiple Test Scenarios

Create multiple test apps:

**test.{processor-name}-basic/**
```turtle
:test a :EntryTransmission ;
    :pipe (:setup-basic :test-processor :verify) .
```

**test.{processor-name}-edge/**
```turtle
:test a :EntryTransmission ;
    :pipe (:setup-edge-cases :test-processor :verify) .
```

**test.{processor-name}-errors/**
```turtle
:test a :EntryTransmission ;
    :pipe (:setup-invalid :test-processor :check-error) .
```

### Run Integration Tests

```bash
# Run single test
./trans test.{processor-name}-test -v

# Run all test scenarios
./trans test.{processor-name}-basic -v
./trans test.{processor-name}-edge -v
./trans test.{processor-name}-errors -v

# Check exit codes
./trans test.{processor-name}-test && echo "PASSED" || echo "FAILED"
```

## Manual Testing

### Quick Test Pipeline

Create temporary test transmission:

```turtle
# /tmp/test-processor.ttl

@prefix : <http://purl.org/stuff/transmissions/> .

:quick-test a :EntryTransmission ;
    :pipe (:SM :test :SM) .

:test a :{ProcessorName} ;
    :settings [
        :settingName "test-value"
    ] .

:SM a :ShowMessage .
```

Run with message:
```bash
./trans /tmp/test-processor -m '{"input": "test"}' -v
```

### Interactive Testing

```bash
# Test with different inputs
./trans test.my-processor -m '{"input": "case1"}' -v
./trans test.my-processor -m '{"input": "case2"}' -v
./trans test.my-processor -m '{"input": "edge-case"}' -v

# Test with debug logging
LOG_LEVEL=debug ./trans test.my-processor -v

# Test with trace logging
LOG_LEVEL=trace ./trans test.my-processor -v
```

## Test Data Management

### Test Fixtures

**tests/fixtures/processor-data.json:**
```json
{
    "basicInput": {
        "field": "value",
        "type": "standard"
    },
    "edgeCase": {
        "field": "",
        "type": "empty"
    },
    "invalidInput": {
        "field": null
    }
}
```

### Load Fixtures in Tests

```javascript
import fs from 'fs/promises'
import path from 'path'

describe('MyProcessor with fixtures', () => {
    let fixtures

    before(async () => {
        const fixturesPath = path.join(__dirname, '../../fixtures/processor-data.json')
        const data = await fs.readFile(fixturesPath, 'utf8')
        fixtures = JSON.parse(data)
    })

    it('should handle basic input', async () => {
        const processor = new MyProcessor({})
        const message = { ...fixtures.basicInput }

        await processor.process(message)

        expect(message.result).to.exist
    })
})
```

## Testing Patterns

### Test Configuration Variations

```javascript
describe('Configuration variations', () => {
    const testCases = [
        { setting: 'value1', expected: 'result1' },
        { setting: 'value2', expected: 'result2' },
        { setting: 'value3', expected: 'result3' }
    ]

    testCases.forEach(({ setting, expected }) => {
        it(`should handle setting=${setting}`, async () => {
            const processor = createProcessor({ setting })
            const message = { input: 'test' }

            await processor.process(message)

            expect(message.result).to.equal(expected)
        })
    })
})
```

### Test Error Conditions

```javascript
describe('Error conditions', () => {
    it('should handle missing required field', async () => {
        const processor = new MyProcessor({})
        const message = {}

        await processor.process(message)

        expect(message.error).to.exist
    })

    it('should handle invalid field type', async () => {
        const processor = new MyProcessor({})
        const message = { input: 123 } // Expected string

        await processor.process(message)

        expect(message.error).to.exist
    })

    it('should handle async operation failure', async () => {
        const processor = new MyProcessor({})
        const message = { url: 'http://invalid-url' }

        await processor.process(message)

        expect(message.error).to.exist
    })
})
```

### Test Async Operations

```javascript
describe('Async operations', () => {
    it('should complete async operation', async function() {
        this.timeout(5000) // Extend timeout for async

        const processor = new MyProcessor({})
        const message = { url: 'http://example.com' }

        await processor.process(message)

        expect(message.result).to.exist
    })

    it('should handle timeout', async function() {
        this.timeout(1000)

        const processor = new MyProcessor({})
        const message = { url: 'http://slow-endpoint.com' }

        try {
            await processor.process(message)
        } catch (error) {
            expect(error.message).to.include('timeout')
        }
    })
})
```

### Test State Management

```javascript
describe('State management', () => {
    it('should maintain state across messages', async () => {
        const processor = new StatefulProcessor({})

        await processor.process({ id: 'a', data: 'value1' })
        await processor.process({ id: 'b', data: 'value2' })

        expect(processor.state.counter).to.equal(2)
        expect(processor.state.cache.size).to.equal(2)
    })

    it('should cleanup on done', async () => {
        const processor = new StatefulProcessor({})

        await processor.process({ id: 'a', data: 'value1' })
        await processor.process({ done: true })

        expect(processor.state.cache.size).to.equal(0)
    })
})
```

## Automated Testing

### Test Script

**tests/scripts/test-processor.sh:**
```bash
#!/bin/bash

set -e

echo "Testing {ProcessorName}..."

# Test 1: Basic functionality
echo "Test 1: Basic functionality"
OUTPUT=$(./trans test.processor-basic -m '{"input": "test"}')
echo "$OUTPUT" | grep -q "expected-output" || {
    echo "FAIL: Basic test"
    exit 1
}
echo "PASS"

# Test 2: Edge cases
echo "Test 2: Edge cases"
./trans test.processor-edge -v || {
    echo "FAIL: Edge case test"
    exit 1
}
echo "PASS"

# Test 3: Error handling
echo "Test 3: Error handling"
./trans test.processor-errors 2>&1 | grep -q "error" || {
    echo "FAIL: Error handling test"
    exit 1
}
echo "PASS"

echo "All tests passed!"
```

Run:
```bash
chmod +x tests/scripts/test-processor.sh
./tests/scripts/test-processor.sh
```

### CI/CD Integration

**Add to `tests/integration/apps.json`:**
```json
[
    {
        "command": "./trans test.processor-basic",
        "label": "processor-basic",
        "description": "Test processor basic functionality",
        "requiredMatchCount": 1
    },
    {
        "command": "./trans test.processor-edge",
        "label": "processor-edge",
        "description": "Test processor edge cases",
        "requiredMatchCount": 1
    },
    {
        "command": "./trans test.processor-errors",
        "label": "processor-errors",
        "description": "Test processor error handling",
        "requiredMatchCount": 1
    }
]
```

## Test Utilities

### Mock Configuration

```javascript
function createMockConfig(settings = {}) {
    return {
        getProperty: (key, defaultValue) => {
            const keyName = key.value || key
            return settings[keyName] !== undefined
                ? settings[keyName]
                : defaultValue
        }
    }
}

// Usage
const config = createMockConfig({
    'inputField': 'custom-input',
    'outputField': 'custom-output'
})
```

### Test Message Factory

```javascript
function createTestMessage(overrides = {}) {
    return {
        appPath: '/test/path',
        workingDir: '/test/working',
        testMode: true,
        ...overrides
    }
}

// Usage
const message = createTestMessage({
    input: 'test-data',
    customField: 'value'
})
```

### Assertion Helpers

```javascript
function assertMessageStructure(message, required = []) {
    for (const field of required) {
        expect(message).to.have.property(field)
    }
}

function assertNoErrors(message) {
    expect(message.error).to.not.exist
}

function assertProcessed(message) {
    expect(message.processed).to.be.true
}
```

## Debugging Tests

### Add Debug Output

```javascript
it('should process correctly', async () => {
    const processor = new MyProcessor({})
    const message = { input: 'test' }

    console.log('Before:', JSON.stringify(message, null, 2))

    await processor.process(message)

    console.log('After:', JSON.stringify(message, null, 2))

    expect(message.output).to.exist
})
```

### Use Debugger

```javascript
it('should process correctly', async () => {
    const processor = new MyProcessor({})
    const message = { input: 'test' }

    debugger // Breakpoint

    await processor.process(message)

    expect(message.output).to.exist
})
```

Run with:
```bash
node --inspect-brk node_modules/.bin/mocha tests/unit/processors/MyProcessor.test.js
```

## Best Practices

1. **Test early**: Write tests as you develop
2. **Test often**: Run tests after changes
3. **Test thoroughly**: Cover normal and edge cases
4. **Test errors**: Verify error handling
5. **Use fixtures**: Reusable test data
6. **Descriptive names**: Clear test descriptions
7. **Independent tests**: No test interdependencies
8. **Clean state**: Reset between tests
9. **Appropriate timeouts**: For async operations
10. **CI integration**: Automate testing

## Test Checklist

- [ ] Unit tests for basic functionality
- [ ] Unit tests for configuration
- [ ] Unit tests for error handling
- [ ] Unit tests for done flag
- [ ] Integration test app created
- [ ] Test with various inputs
- [ ] Test edge cases
- [ ] Test error conditions
- [ ] Added to integration test suite
- [ ] CI/CD configured if applicable
- [ ] Documentation updated
