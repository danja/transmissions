# Transmissions Framework Documentation

Welcome to the Transmissions Framework documentation. 

Below refers to JSDoc documentation.

## Namespace Structure

- **Transmissions** - Core framework
  - **Engine** - Core engine components
  - **Model** - Data models and base classes
  - **API** - Public interfaces for CLI and HTTP access
  - **Utils** - Utility functions and helper classes
  - **Processors** - All processor implementations
    - **Flow** - Control flow processors
    - **FileSystem** - File system operations
    - **Text** - Text processing
    - **HTTP** - HTTP client/server processors

## Viewing Documentation

Browse the navigation menu to explore the API documentation. Start with the [Transmissions](module-Transmissions.html) namespace to get an overview of the framework.

## Building Documentation Locally

```bash
npm run docs
```

The documentation will be available in the `docs/jsdoc` directory.
