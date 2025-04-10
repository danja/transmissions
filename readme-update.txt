# Transmissions

A flexible pipeline processing system with RDF-based configuration.

## Overview

Transmissions is a dataflow pipeline system that allows you to define processing pipelines using RDF/Turtle syntax and execute them in Node.js. It includes both a command-line interface and a visual editor for creating and editing pipelines.

## Installation

```bash
npm install
```

## Usage

### Command Line Interface

Run a transmission pipeline:

```bash
./trans <application-name> [target]
```

Example:

```bash
./trans example-application
```

### Visual Pipeline Editor

Transmissions includes a visual editor for creating and editing pipeline configurations using a web-based interface.

#### Development Server

Start the development server:

```bash
npm run start
```

This will open a browser window with the visual editor. You can load existing transmission files, create new ones, and save your changes.

#### Building for Production

Build the editor for production:

```bash
npm run build
```

This will create a production build in the `dist` directory.

## Development

### Project Structure

- `src/api`: API interfaces (CLI, HTTP)
- `src/applications`: Application definitions
- `src/engine`: Core engine components
- `src/model`: Data models
- `src/processors`: Pipeline processors
- `src/tools`: Development tools
- `src/utils`: Utility functions
- `tests`: Test files

### Running Tests

Run tests with:

```bash
npm test
```

## Working with the Visual Editor

The visual editor allows you to:

1. Load existing transmission files
2. Create new transmissions
3. Add and connect processors
4. Edit processor configurations
5. Save transmissions as TTL files

### Editor Controls

- **Load TTL**: Load a transmission TTL file
- **Save TTL**: Save the current transmission as a TTL file
- **New Transmission**: Create a new transmission
- **Organize**: Automatically organize the graph layout

## License

MIT
