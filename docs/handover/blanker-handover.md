# Blanker Processor Enhancement

## Overview
Added functionality to preserve specified nodes when blanking JSON trees.

## Key Changes

1. Added path preservation:
   - New config option `trm:preserve` specifies paths to preserve
   - Uses dot notation for paths (e.g., "content.payload.test.third")
   - Path matching checks parent paths
   
2. Core functions:
   - `shouldPreserve()`: Path matching logic
   - Enhanced `blankValues()`: Tracks current path during tree traversal
   - Updated `process()`: Handles preserve path from config

## Testing
Test app: `test_blanker`
- Input: `data/input/input-01.json`
- Config: `config.ttl` specifies `trm:preserve "content.payload.test.third"`
- Validation: Compare against `data/output/required-01.json`

## Usage Example
```ttl
t:blanko a trm:ServiceConfig ;
    trm:configKey t:blankin ;
    trm:pointer "content.payload.test" ;
    trm:preserve "content.payload.test.third" .
```

## Implementation Notes
- Empty string used as blank value
- Arrays processed recursively
- Full path tracking during traversal
- Preserves full subtree at preserved paths

## RDF Summary
```turtle
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix prj: <http://purl.org/stuff/project/> .
@prefix prov: <http://www.w3.org/ns/prov#> .

[
    a prj:Enhancement ;
    dcterms:title "Blanker JSON Processor Path Preservation" ;
    dcterms:description "Added functionality to preserve specified paths when blanking JSON trees" ;
    dcterms:creator <http://purl.org/stuff/agents/ClaudeAI> ;
    prj:status "Complete" ;
    prj:keywords "JSON processing, path preservation, blanking, tree traversal" ;
    prov:wasGeneratedBy [
        a prov:Activity ;
        prj:includes <http://hyperdata.it/prompts/system-prompt>
    ]
] .
```
