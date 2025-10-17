# Testing Transmissions Applications

## Testing Strategy

### 1. Manual Testing (Development)
Quick iteration during development

### 2. Integration Testing (CI/CD)
Automated testing of full workflows

### 3. Unit Testing (Processor-level)
Test individual processors in isolation

## Manual Testing

### Basic Test Run

```bash
# Run with verbose output
./trans my-app -v

# Run with custom message
./trans my-app -m '{"field": "value"}'

# Run with debug logging
LOG_LEVEL=debug ./trans my-app -v
```

### Test Different Scenarios

```bash
# Test with different inputs
./trans my-app -m '{"type": "premium"}'
./trans my-app -m '{"type": "standard"}'

# Test with file paths
./trans my-app -m '{"inputFile": "test1.json"}'
./trans my-app -m '{"inputFile": "test2.json"}'

# Test error conditions
./trans my-app -m '{"invalid": true}'
```

### Debugging Tools

Add debug processors to pipeline:

```turtle
:test-pipeline a :EntryTransmission ;
    :pipe (
        :SM              # Show initial message
        :setup
        :SM              # Show after setup
        :process
        :SM              # Show after process
        :output
    ) .
```

### Verbose Logging Levels

```bash
# Standard verbose
./trans my-app -v

# Debug level
LOG_LEVEL=debug ./trans my-app -v

# Trace level (very detailed)
LOG_LEVEL=trace ./trans my-app -v
```

## Integration Testing

### Add to Test Suite

Edit `tests/integration/apps.json`:

```json
{
    "command": "./trans my-app",
    "label": "my-app",
    "description": "Test my-app basic functionality",
    "requiredMatchCount": 1
}
```

### Run Integration Tests

```bash
# Run all integration tests
npm test

# Run specific test
npm test -- --grep my-app
```

### Test Variations

Create multiple test entries:

```json
[
    {
        "command": "./trans my-app -m '{\"type\":\"premium\"}'",
        "label": "my-app-premium",
        "description": "Test premium flow",
        "requiredMatchCount": 1
    },
    {
        "command": "./trans my-app -m '{\"type\":\"standard\"}'",
        "label": "my-app-standard",
        "description": "Test standard flow",
        "requiredMatchCount": 1
    }
]
```

## Unit Testing

### Test App Structure

Create test apps for specific scenarios:

```
src/apps/test/
├── my-app-basic/          # Basic functionality
│   ├── transmissions.ttl
│   └── about.md
├── my-app-errors/         # Error handling
│   ├── transmissions.ttl
│   └── about.md
└── my-app-edge/           # Edge cases
    ├── transmissions.ttl
    └── about.md
```

### Example Test App

**src/apps/test/my-app-basic/transmissions.ttl:**
```turtle
@prefix : <http://purl.org/stuff/transmissions/> .

:test-basic a :EntryTransmission ;
    :pipe (
        :setup-test-data
        :run-my-app-core
        :verify-output
    ) .

:setup-test-data a :SetField ;
    :settings [
        :field "testInput" ;
        :value "expected-value"
    ] .

:run-my-app-core a :GOTO ;
    :settings [ :gotoTarget "my-app" ] .

:verify-output a :Choice ;
    :settings [
        :testProperty "result" ;
        :testOperator "equals" ;
        :testValue "expected-result" ;
        :trueProperty "testPassed" ;
        :trueValue true ;
        :falseProperty "testPassed" ;
        :falseValue false
    ] .
```

### Run Unit Tests

```bash
# Run test app
./trans test.my-app-basic -v

# Check exit code
echo $?  # Should be 0 for success
```

## Test Data Management

### Test Data Directory

```
my-app/
├── transmissions.ttl
├── data/
│   ├── test/              # Test data
│   │   ├── input/
│   │   │   ├── test1.json
│   │   │   └── test2.json
│   │   └── expected/
│   │       ├── output1.json
│   │       └── output2.json
│   └── actual/            # Generated during tests
```

### Setup Test Data

```bash
# Copy test fixtures
mkdir -p data/test/{input,expected}

# Create test input
cat > data/test/input/test1.json << EOF
{
    "field": "test-value"
}
EOF

# Create expected output
cat > data/test/expected/output1.json << EOF
{
    "field": "test-value",
    "processed": true
}
EOF
```

## Automated Testing

### Test Script

**tests/test-my-app.sh:**
```bash
#!/bin/bash

set -e

echo "Testing my-app..."

# Test 1: Basic functionality
echo "Test 1: Basic run"
./trans my-app -m '{"test": true}' > /tmp/test1-output.json
grep -q "expected-value" /tmp/test1-output.json || exit 1

# Test 2: Error handling
echo "Test 2: Error handling"
./trans my-app -m '{"invalid": true}' 2>&1 | grep -q "error" || exit 1

# Test 3: Different paths
echo "Test 3: Premium flow"
./trans my-app -m '{"type": "premium"}' > /tmp/test3-output.json
grep -q "premium-result" /tmp/test3-output.json || exit 1

echo "All tests passed!"
```

Make executable and run:
```bash
chmod +x tests/test-my-app.sh
./tests/test-my-app.sh
```

### CI/CD Integration

**GitHub Actions example (.github/workflows/test.yml):**
```yaml
name: Test My App

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run my-app tests
        run: |
          ./trans my-app -v
          ./tests/test-my-app.sh
```

## Testing Patterns

### Test Input Variations

```bash
# Minimum input
./trans my-app -m '{}'

# Typical input
./trans my-app -m '{"field": "normal-value"}'

# Maximum input
./trans my-app -m '{"field": "value", "extra": "data", "complex": {"nested": true}}'

# Invalid input
./trans my-app -m '{"invalid": "structure"}'
```

### Test Output Verification

```bash
# Capture output
RESULT=$(./trans my-app -m '{"test": true}')

# Check specific field
echo "$RESULT" | jq -e '.expectedField == "expectedValue"'

# Check file output
test -f data/output/result.json || exit 1
grep -q "expected-content" data/output/result.json
```

### Test Error Conditions

```bash
# Missing required field
./trans my-app -m '{}' 2>&1 | grep -q "required field" || exit 1

# Invalid file path
./trans my-app -m '{"file": "/nonexistent"}' 2>&1 | grep -q "not found" || exit 1

# Invalid configuration
./trans my-app-invalid -v 2>&1 | grep -q "error" || exit 1
```

## Performance Testing

### Timing Tests

```bash
# Time execution
time ./trans my-app -m '{"field": "value"}'

# Multiple runs
for i in {1..10}; do
    time ./trans my-app -m "{\"run\": $i}"
done
```

### Load Testing

```bash
# Process multiple files
for file in data/input/*.json; do
    ./trans my-app -m "{\"file\": \"$file\"}"
done

# Concurrent execution
for i in {1..10}; do
    ./trans my-app -m "{\"id\": $i}" &
done
wait
```

## Regression Testing

### Baseline Capture

```bash
# Capture current output as baseline
./trans my-app -m '{"test": true}' > tests/baseline/output.json
```

### Comparison

```bash
# Run and compare to baseline
./trans my-app -m '{"test": true}' > /tmp/current.json
diff tests/baseline/output.json /tmp/current.json || echo "Regression detected!"
```

## Best Practices

1. **Test early**: Write tests as you develop
2. **Test often**: Run tests after each change
3. **Test variations**: Cover different input scenarios
4. **Test errors**: Verify error handling
5. **Automate**: Add to CI/CD pipeline
6. **Version test data**: Keep test fixtures in git
7. **Document tests**: Explain what each test verifies
8. **Clean up**: Remove test output files
9. **Use verbose mode**: `-v` flag helps debugging
10. **Check exit codes**: Verify success/failure

## Troubleshooting Tests

**Test fails intermittently:**
- Check for timing dependencies
- Verify file system state
- Look for race conditions

**Test passes locally, fails in CI:**
- Check environment differences
- Verify file paths
- Check dependencies

**Output differs from expected:**
- Use `diff` to see differences
- Check for timestamps or generated IDs
- Normalize output before comparison

## Next Steps

1. Write basic manual tests first
2. Add integration test entries
3. Create test apps for edge cases
4. Automate with test scripts
5. Add to CI/CD pipeline
6. Monitor test results
7. Iterate on test coverage
