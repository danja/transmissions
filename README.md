# Transmissions

## Overview

**Transmissions** is a workflow compositor designed to carry out data processing operations as a series of relatively simple steps. It's a micro-framework intended to simplify construction of small pipeliney data processing applications in JavaScript.

[Manual](https://danja.github.io/transmissions/manual/)

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/danja/transmissions)

**Status 2025-09-18 :** mostly functional, in active dev, potentially useful

Typical use :

![REPL demo](https://github.com/danja/transmissions/blob/main/docs/images/eye-runner.png)

A REPL has just been added, here running the Transmission on the left :

![REPL demo](https://github.com/danja/transmissions/blob/main/docs/images/chain.png)

It has the beginnings of a GUI, I've not had need to use it yet :

![REPL demo](https://github.com/danja/transmissions/blob/main/docs/images/trans-view.png)

### Key Concepts

- **Transmission**: A workflow description expressed in Turtle RDF
- **Processor**: A component that receives a message, processes it, and passes the result to the next processor
- **Message**: A JSON object that flows through the processor pipeline
- **Dataset**: An RDF dataset containing transmission definitions
- **App**: A collection of transmissions defined in `transmissions.ttl`
- **Target**: A directory containing `tt.ttl` files for specific deployments

## Installation

```bash
git clone <repository-url>
cd transmissions
npm install
```

## Usage

### Running Applications

List available applications:
```bash
./trans
```

Run a specific application:
```bash
./trans <app-name> <target-directory>
```

### Testing

Run tests:
```bash
npm test
```

Run all tests (including browser tests):
```bash
npm test:all
```

Generate coverage report:
```bash
npm run cov
```

### Development

Build for production:
```bash
npm run build
```

Start development server:
```bash
npm run dev
```

Generate documentation:
```bash
npm run docs
```

## Configuration

Applications are configured using RDF files:

- `transmissions.ttl` - Defines the workflow
- `config.ttl` - Default configuration
- `tt.ttl` - Target-specific settings (in target directory)

Settings are resolved in order of priority:
1. Current message properties
2. Target definition (`tt.ttl`)
3. Transmissions definition (`transmissions.ttl`)
4. Default configuration (`config.ttl`)

![Nonsense poster](https://github.com/danja/transmissions/blob/main/docs/images/transmissions-poster.png)

## License

MIT License

## Author

Danny Ayers <danny.ayers@gmail.com> (https://danny.ayers.name)





