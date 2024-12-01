# MarkMap Implementation Project Plan

## Overview
Create a Transmissions application to convert markdown files into interactive HTML/SVG mind maps using the markmap library.

## Prerequisites
- Existing ForEach processor
- Markmap library examples in raw-src
- Base transmission and config files

## Implementation Steps

### 1. Verify ForEach Processor
- Test ForEach with basic input paths
- Fix any issues with message handling
- Ensure proper cloning of context

### 2. Create MarkMap Processor
- Create initial MarkMap.js class structure
- Implement markmap library integration
- Add HTML generation logic
- Add SVG generation logic 
- Handle message input/output formats

### 3. Create FilenameMapper Processor
- Create simple processor to map input filenames
- Add .mm.html and .mm.svg suffixes
- Configure proper output paths

### 4. Integration Tasks
- Wire up processors in transmissions.ttl
- Set up configuration in config.ttl
- Add any required manifest entries
- Create basic test files

### 5. Testing Plan
- Test with single markdown file
- Test with multiple files
- Verify HTML output
- Verify SVG output
- Test error handling

## Key Components

### Message Formats
Input message:
```javascript
{
  filepath: "path/to/example.md",
  content: "# Markdown content..."
}
```

Output messages:
```javascript
{
  filepath: "path/to/example.mm.html",
  content: "<html>...</html>"
}
{
  filepath: "path/to/example.mm.svg", 
  content: "<svg>...</svg>"
}
```

### File Structure
```
markmap/
  ├── processors/
  │   ├── MarkMap.js
  │   └── FilenameMapper.js
  ├── transmissions.ttl
  ├── config.ttl
  └── manifest.ttl
```
