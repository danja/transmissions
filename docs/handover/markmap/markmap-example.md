# Markmap Usage Example

1. Create a test markdown file `example.md`:
```markdown
# Project Overview
## Goals
* Improve performance
* Add new features
* Fix bugs

## Timeline
* Q1: Planning
* Q2: Development
* Q3: Testing
* Q4: Release

## Team
* Development
  * Frontend
  * Backend
* QA
* DevOps
```

2. Run the processor:
```bash
./trans markmap -m '{"paths": ["example.md"]}'
```

3. Check the generated files:
- `example.mm.html`: Interactive HTML mind map
- `example.mm.svg`: Static SVG mind map
