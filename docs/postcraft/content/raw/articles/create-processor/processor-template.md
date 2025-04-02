# New Processor Template

## Core Information Required

1. Processor Name & Purpose
- Unique identifier 
- Primary functionality
- Input/output data types
- Success criteria

2. Configuration Requirements
- RDF configuration format
- Required settings
- Optional settings
- Default values

3. Message Structure
- Expected input fields
- Output fields
- Error conditions

4. Integration Points  
- Required modules
- Dependencies 
- Event triggers

## Example Usage

```javascript
// Example transmission.ttl
:myPipe a trm:Transmission ;
    trm:pipe (:p10) .

:p10 a :NewProcessor ;
    trm:settings :processorSettings .

// Example config.ttl  
:processorSettings a trm:ConfigSet ;
    trm:key :requiredSetting ;
    trm:value "value" .

// Example message
{
  "input": "data",
  "config": {}
}
```

## Testing Requirements
- Unit test cases
- Integration test scenarios
- Error handling tests

## Documentation Requirements
- Public API
- Configuration options
- Example usage
- Error handling