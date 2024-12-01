# Markmap Processor Documentation

## Message Formats

### Input Message
```javascript
{
    filepath: string,    // Path to markdown file
    content: string,     // Markdown content
    format?: string      // Optional format override (html|svg)
}
```

### Output Messages
Two messages are emitted for each input:

HTML Message:
```javascript
{
    filepath: string,    // Original path with .mm.html extension
    content: string,     // Complete HTML document with markmap
    format: "html"       // Format identifier
}
```

SVG Message:
```javascript
{
    filepath: string,    // Original path with .mm.svg extension
    content: string,    // SVG markup only
    format: "svg"       // Format identifier
}
```

## Configuration

### Processor Config
```turtle
t:markmapConfig a trm:ServiceConfig ;
    trm:template "default" .    # Template to use for HTML generation
```

### ForEach Config
```turtle
t:forEachConfig a trm:ServiceConfig ;
    trm:inputKey "paths" ;     # Input array key in message
    trm:outputKey "filepath" . # Output key per iteration
```

### Filename Config
```turtle
t:filenameConfig a trm:ServiceConfig ;
    trm:extensions (           # List of extension mappings
        [
            trm:format "html" ;
            trm:extension ".mm.html"
        ]
        [
            trm:format "svg" ;
            trm:extension ".mm.svg"
        ]
    ) .
```

### Error Handling
- Missing content: Throws error with message "No content provided in message"
- Invalid markdown: Passes through markmap parser errors
- Missing filepath: Throws error with message "No filepath provided in message"
