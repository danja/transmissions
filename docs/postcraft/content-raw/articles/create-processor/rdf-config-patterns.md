# RDF Configuration Patterns

## Basic Settings
```turtle
@prefix trn: <http://purl.org/stuff/transmissions/> .
@prefix : <http://example.org/config#> .

:processorSettings a trn:ConfigSet ;
    trn:key "uniqueKey" ;
    trn:value "value" .
```

## Path Settings
```turtle
@base <http://purl.org/stuff/path/> .

:fileSettings a trn:ConfigSet ;
    trn:sourceFile <input/data.json> ;
    trn:targetFile <output/result.json> .
```

## Composite Settings
```turtle
:complexSettings a trn:ConfigSet ;
    trn:settings (
        :setting1
        :setting2
    ) .

:setting1 trn:key "key1" ;
         trn:value "value1" .

:setting2 trn:key "key2" ;
         trn:value "value2" .
```

## Inheritance
```turtle
:baseSettings a trn:ConfigSet ;
    trn:commonSetting "shared" .

:specificSettings a trn:ConfigSet ;
    rdfs:subClassOf :baseSettings ;
    trn:uniqueSetting "specific" .
```

## Best Practices
1. Use consistent namespaces
2. Define clear hierarchies
3. Group related settings
4. Use semantic relationships
5. Include type declarations