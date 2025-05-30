# SPARQL Processors Documentation

## Overview
The SPARQL processors provide functionality for interacting with SPARQL endpoints through the Transmissions pipeline framework. Two main processors are provided:
- SPARQLSelect: Executes SELECT queries
- SPARQLUpdate: Executes UPDATE operations

## Configuration
Configuration is managed through endpoint.json:
```json
{
    "name": "local query",
    "type": "query|update",
    "url": "http://localhost:3030/dataset/query",
    "credentials": {
        "user": "username",
        "password": "password"
    }
}
```

## SPARQLSelect Processor
Executes templated SELECT queries against a SPARQL endpoint.

### Usage
```turtle
:query a :Transmission ;
    :pipe (:p10) .

:p10 a :SPARQLSelect ;
    :settings [
        :templateFilename "queries/select.njk" ;
        :endpointSettings "endpoint.json"
    ] .
```

### Template Variables
- startDate: ISO datetime for filtering
- Additional variables from message object

## SPARQLUpdate Processor
Executes templated UPDATE operations against a SPARQL endpoint.

### Usage
```turtle
:update a :Transmission ;
    :pipe (:p10) .

:p10 a :SPARQLUpdate ;
    :settings [
        :templateFilename "queries/update.njk" ;
        :endpointSettings "endpoint.json"
    ] .
```

### Template Variables
- id: Auto-generated UUID
- title: From message.meta.title
- content: From message.content
- published/modified: Current timestamp
- author: From message.meta.author

## Error Handling
- Connection failures throw network errors
- Authentication failures throw 401/403 errors
- Invalid queries throw 400 errors
- All errors include detailed messages in logs