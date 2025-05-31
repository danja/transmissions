# API Interfaces

The `src/api` directory provides three interface modes for the Transmissions framework:

## CLI Interface (`cli/`)
- **`run.js`** - Main command-line entry point using yargs, handles application execution, web server startup, and visual editor launching
- **`about.md`** - CLI usage documentation

## HTTP API (`http/`)
- **`server/WebRunner.js`** - Express.js-based HTTP API server for running applications via REST endpoints
- **`server/EditorWebRunner.js`** - Specialized server for the visual pipeline editor with webpack build integration
- **`client/`** - Browser-based test client with UI and API communication library
- **`openapi-spec.yaml`** - OpenAPI specification for the HTTP API
- **`about.md`** - HTTP API documentation and usage examples

## Common Utilities (`common/`)
- **`CommandUtils.js`** - Core command processing, application initialization, argument parsing, and execution coordination
- **`Defaults.js`** - Default configuration constants for directories and filenames

## Usage Patterns
- **CLI**: `./trans <app> [options] [target]`
- **HTTP**: `POST /api/<application>` with JSON payload
- **Editor**: `./trans --editor` launches visual pipeline editor

All interfaces ultimately delegate to the same core engine for pipeline execution.