# SPARQL Store Test Application

## Purpose
Tests complete pipeline functionality for reading files, converting to RDF, storing in a SPARQL database, and verifying storage through queries.

## Quick Start
1. Configure SPARQL endpoint in endpoint.json
2. Place test markdown in data/input/input.md
3. Run application:
```bash
./trans test_file-to-sparqlstore
```

## Components
1. FileReader processor:
   - Reads input markdown
   - Extracts metadata and content

2. SPARQLUpdate processor:
   - Converts markdown to RDF using schema.org vocabulary
   - Stores in SPARQL database

3. SPARQLSelect processor:
   - Queries stored data
   - Verifies successful storage

## Testing
### Manual Testing
Use provided test scripts:
```bash
# Using bash script
./test-queries.sh

# Using Python script
python3 test-queries.py
```

### Example Queries
```sparql
# Find recently added posts
SELECT ?post ?title WHERE {
  ?post a schema:BlogPosting ;
        schema:headline ?title ;
        schema:datePublished ?date .
  FILTER(?date >= "2024-01-01T00:00:00Z"^^xsd:dateTime)
}
```

## Configuration
1. endpoint.json: SPARQL endpoint details
2. config.ttl: Transmission configuration
3. transmissions.ttl: Pipeline definition
4. diamonds/*.njk: Query templates

## Error Cases Handled
- Missing input files
- SPARQL endpoint connection failures
- Authentication errors
- Invalid markdown format
- Failed data verification