# Transmissions Template Generator

## Overview
Command-line tool to generate scaffold for new Transmissions applications.

## Installation
```bash
npm install -g trans-template
```

## Usage
```bash
# Generate new application template
trans-template create my-app

# Specify output format
trans-template create my-app --format turtle

# Help
trans-template --help
```

## Generated Structure
```
my-app/
├── processors/      # New processors
├── tests/          # Test files
├── config/         # Configuration files
├── transmissions.ttl  # Pipeline definition
├── config.ttl         # Service configuration
└── about.md          # Application documentation
```

## Template Formats

### JSON
- Full application definition
- Validates against JSON schema
- Used for tooling/automation

### Turtle
- RDF representation
- Linked data model
- Integration with semantic tools

### Markdown
- Human-readable format
- Documentation focus
- GitHub-friendly

## Environment Variables
- `TRANS_TEMPLATE_PATH`: Base path for templates
- `TRANS_CONFIG_PATH`: Path to configuration

## Error Handling
- Validates input parameters
- Creates missing directories
- Reports detailed errors

## Extension
Custom templates can be added in:
```bash
~/.config/trans-template/templates/
```
