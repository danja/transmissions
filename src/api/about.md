# API Interfaces

The `src/api` directory provides four interface modes for the Transmissions framework:

## CLI Interface (`cli/`)
- **`run.js`** - Main command-line entry point using yargs, handles application execution, web server startup, and visual editor launching
- **`about.md`** - CLI usage documentation

## HTTP API (`http/`)
- **`server/WebRunner.js`** - Express.js-based HTTP API server for running applications via REST endpoints
- **`server/EditorWebRunner.js`** - Specialized server for the visual pipeline editor with webpack build integration
- **`client/`** - Browser-based test client with UI and API communication library
- **`openapi-spec.yaml`** - OpenAPI specification for the HTTP API
- **`about.md`** - HTTP API documentation and usage examples

## File System Utilities (`fs/`)
- **`FileWatcher.js`** - A filesystem monitoring utility that watches for changes in a directory tree and sends notifications to a specified URL. Features include:
  - Recursive directory watching
  - Configurable debouncing of rapid changes
  - Pattern-based file exclusion (e.g., node_modules, .git)
  - Graceful error handling and validation
  - Signal handling for clean shutdown

## Common Utilities (`common/`)
- **`CommandUtils.js`** - Core command processing, application initialization, argument parsing, and execution coordination
- **`Defaults.js`** - Default configuration constants for directories and filenames

## REPL Interface (`repl/`)
- **`REPL.js`** - Provides an interactive Read-Eval-Print Loop for working with Transmissions apps from the command line. Features include:
  - Interactive message input and immediate app response
  - Slash commands (e.g., `/quit`, `/app <name>`, `/help`) handled by `Commands.js`
  - Ability to switch app context at runtime
  - Verbosity control and extensible command set
  - Start with the CLI option `--repl` or `-r`
- **`Commands.js`** - Implements handlers for slash commands, allowing for extensible REPL control and utility features
- **`about.md`** - Documentation for the REPL interface and its commands

## Usage Patterns
- **CLI**: `./trans <app> [options] [target]`
- **HTTP**: `POST /api/<application>` with JSON payload
- **Editor**: `./trans --editor` launches visual pipeline editor
- **REPL**: `./trans --repl` or `./trans -r`

All interfaces ultimately delegate to the same core engine for pipeline execution.