# Application Structure Templates

## File Organization

### Minimal App
```
my-app/
├── transmissions.ttl    # Pipeline definition
├── about.md            # Documentation
└── config.ttl          # Optional configuration
```

### Standard App
```
my-app/
├── transmissions.ttl    # Pipeline definition
├── config.ttl          # Configuration
├── about.md            # Documentation
└── data/               # Working directory
    ├── input/          # Input files
    └── output/         # Output files
```

### Advanced App
```
my-app/
├── transmissions.ttl    # Main pipeline
├── config.ttl          # Configuration
├── about.md            # Documentation
├── data/               # Working files
├── processors/         # Custom processors
│   ├── CustomProcessor.js
│   └── CustomProcessorsFactory.js
└── tt.ttl             # Target-specific config
```

## Pipeline Patterns

### 1. Linear Processing

Simple sequence of transformations:

```turtle
@prefix : <http://purl.org/stuff/transmissions/> .

:linear-app a :EntryTransmission ;
    :pipe (
        :read-input
        :transform
        :write-output
    ) .

:read-input a :FileReader ;
    :settings [ :filename "input.json" ] .

:transform a :JSONTransform ;
    :settings [ :operation "process" ] .

:write-output a :FileWriter ;
    :settings [ :filename "output.json" ] .
```

### 2. SPARQL Query → Process → Store

Common pattern for semantic data processing:

```turtle
:sparql-workflow a :EntryTransmission ;
    :pipe (
        :query-data
        :process-results
        :store-updated
    ) .

:query-data a :SPARQLSelect ;
    :settings [
        :endpoint "http://localhost:3030/dataset/query" ;
        :sparql """
            PREFIX ex: <http://example.org/>
            SELECT ?item ?value
            WHERE {
                ?item ex:property ?value .
                FILTER NOT EXISTS { ?item ex:processed true }
            }
        """
    ] .

:process-results a :ForEach ;
    :settings [
        :arrayProperty "results" ;
        :itemProperty "current"
    ] .

:store-updated a :SPARQLUpdate ;
    :settings [
        :endpoint "http://localhost:3030/dataset/update" ;
        :sparql """
            PREFIX ex: <http://example.org/>
            INSERT DATA {
                {{current.item}} ex:processed true .
                {{current.item}} ex:processedDate "{{timestamp}}" .
            }
        """
    ] .
```

### 3. Conditional Processing

Branch based on message properties:

```turtle
:conditional-app a :EntryTransmission ;
    :pipe (
        :setup
        :decide
        :route
        :finalize
    ) .

:setup a :SetField ;
    :settings [
        :field "status" ;
        :value "pending"
    ] .

:decide a :Choice ;
    :settings [
        :testProperty "userType" ;
        :testOperator "equals" ;
        :testValue "premium" ;
        :trueProperty "route" ;
        :trueValue "premium-path" ;
        :falseProperty "route" ;
        :falseValue "standard-path"
    ] .

:route a :GOTO ;
    :settings [
        :gotoTarget "{{route}}"
    ] .

# Called dynamically
:premium-path a :Transmission ;
    :pipe (:enhanced-processing :premium-output) .

:standard-path a :Transmission ;
    :pipe (:basic-processing :standard-output) .
```

### 4. File Processing Batch

Process multiple files:

```turtle
:batch-processor a :EntryTransmission ;
    :pipe (
        :scan-directory
        :process-each-file
        :aggregate-results
    ) .

:scan-directory a :DirWalker ;
    :settings [
        :path "data/input" ;
        :pattern "*.json"
    ] .

:process-each-file a :FileReader .

:aggregate-results a :Accumulate ;
    :settings [
        :field "results" ;
        :operation "append"
    ] .
```

### 5. Multi-Stage Pipeline

Complex workflow with nested transmissions:

```turtle
:main-workflow a :EntryTransmission ;
    :pipe (
        :validation
        :processing
        :output
    ) .

:validation a :GOTO ;
    :settings [ :gotoTarget "validate-input" ] .

:processing a :GOTO ;
    :settings [ :gotoTarget "process-data" ] .

:output a :GOTO ;
    :settings [ :gotoTarget "format-output" ] .

# Nested transmissions
:validate-input a :Transmission ;
    :pipe (
        :check-schema
        :check-required
        :check-format
    ) .

:process-data a :Transmission ;
    :pipe (
        :transform
        :enrich
        :validate
    ) .

:format-output a :Transmission ;
    :pipe (
        :serialize
        :write
        :notify
    ) .
```

### 6. Web Service Integration

API-based processing:

```turtle
:api-integration a :EntryTransmission ;
    :pipe (
        :fetch-data
        :parse-response
        :store-result
    ) .

:fetch-data a :HttpClient ;
    :settings [
        :url "https://api.example.com/data" ;
        :method "GET" ;
        :headers [
            :Authorization "Bearer {{apiToken}}"
        ]
    ] .

:parse-response a :JSONParse .

:store-result a :FileWriter ;
    :settings [
        :filename "data/output/result.json"
    ] .
```

### 7. Markdown Processing

Content transformation workflow:

```turtle
:markdown-workflow a :EntryTransmission ;
    :pipe (
        :read-markdown
        :convert-to-html
        :extract-links
        :generate-toc
        :write-output
    ) .

:read-markdown a :FileReader ;
    :settings [ :filename "{{inputFile}}" ] .

:convert-to-html a :MarkdownToHTML .

:extract-links a :HTMLToLinks .

:generate-toc a :TableOfContents .

:write-output a :FileWriter ;
    :settings [ :filename "{{outputFile}}" ] .
```

## Configuration Patterns

### Inline Settings

```turtle
:processor a :FileReader ;
    :settings [
        :filename "data.json" ;
        :encoding "utf8" ;
        :parseJSON true
    ] .
```

### Named Configuration

```turtle
:processor a :FileReader ;
    :settings :fileConfig .

:fileConfig a :ConfigSet ;
    :filename "data.json" ;
    :encoding "utf8" ;
    :parseJSON true .
```

### Message-Driven Configuration

```turtle
:processor a :FileReader ;
    :settings [
        :filename "{{inputFile}}" ;
        :encoding "{{encoding}}"
    ] .
```

Values replaced from message at runtime:
```bash
./trans my-app -m '{"inputFile": "custom.json", "encoding": "utf8"}'
```

## Debugging Utilities

Add to transmissions.ttl:

```turtle
# Debug processors (add to any pipeline)
:SM a :ShowMessage .     # Display message
:SC a :ShowConfig .      # Display config
:N  a :NOP .            # No-op marker
:DE a :DeadEnd .        # Stop pipeline
:H  a :Halt .           # Kill everything
```

Usage:
```turtle
:debug-pipeline a :EntryTransmission ;
    :pipe (
        :step1
        :SM           # Show message after step1
        :step2
        :SM           # Show message after step2
        :step3
    ) .
```

## Common Processor Sequences

### File → Transform → File
```turtle
:pipe (:FileReader :Transform :FileWriter)
```

### SPARQL → ForEach → SPARQL
```turtle
:pipe (:SPARQLSelect :ForEach :ProcessItem :SPARQLUpdate)
```

### HTTP → Parse → Store
```turtle
:pipe (:HttpClient :JSONParse :FileWriter)
```

### Read → Convert → Write
```turtle
:pipe (:FileReader :MarkdownToHTML :FileWriter)
```

### Fork → Process → Merge
```turtle
:pipe (:Fork :ProcessA :ProcessB :Merge)
```

## Best Practices

1. **One responsibility per transmission**: Keep pipelines focused
2. **Use named configurations**: Reusable, cleaner syntax
3. **Add debug processors**: Essential during development
4. **Document processors**: Comment purpose of each stage
5. **Test incrementally**: Build pipeline step by step
6. **Handle errors**: Use Choice for error paths
7. **Use GOTO for reuse**: Share common logic across transmissions
