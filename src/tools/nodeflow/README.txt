when I do Load TTL in the editor and point it to @src/applications/trial/transmissions.ttl it should refresh the view with the loaded data

# Transmission Pipeline Editor

This module provides a visual editor for transmission pipelines using the node-flow library. It allows you to:

- Load existing transmission TTL files
- Visualize processors and connections
- Edit the pipeline by adding, removing, and connecting nodes
- Save changes back to TTL format

## Architecture

The editor is built with a loosely-coupled architecture that allows the transmission system and node-flow to work together without tight dependencies:

1. **TransmissionsLoader** - Loads TTL files and extracts transmission data
2. **ProcessorNodePublisher** - Defines node types for transmission processors
3. **TransmissionsGraphBuilder** - Builds node-flow graphs from transmission data
4. **TransmissionsExporter** - Exports node-flow graphs back to TTL format
5. **TransmissionEditor** - Main component that provides the editing functionality

## Installation

1. Place these files in the `src/tools/nodeflow` directory
2. Make sure node-flow is installed (npm package `@elicdavis/node-flow`)

## Usage

### Basic Setup

```javascript
import TransmissionEditor from './tools/nodeflow/TransmissionEditor.js';

// Initialize the editor with a canvas element
const canvas = document.getElementById('editor-canvas');
const editor = new TransmissionEditor(canvas);

// Load a transmission TTL file
await editor.loadFromFile('path/to/transmission.ttl');

// Save changes
await editor.saveToFile('path/to/output.ttl');
```

### Running the Editor

The simplest way to use the editor is to open the included `index.html` file in a browser that supports ES modules.

## Key Features

- **Visualization** - See processors and their connections graphically
- **Editing** - Add, remove, and connect processors visually
- **Organization** - Automatically organize the graph layout
- **Persistence** - Load and save transmission files in TTL format

## Integration Notes

This editor is designed to work with both the transmission system and node-flow without modifying either. The editor acts as a bridge between the two systems, translating between RDF-based transmission definitions and node-flow's visual graph representation.

## Extension Points

- **Adding Processor Types** - Modify `ProcessorNodePublisher.js` to add new processor types
- **Custom Styling** - Adjust node appearance in `ProcessorNodePublisher.js`
- **Advanced Features** - Extend `TransmissionEditor.js` to add new editing capabilities

## Future Improvements

- Support for editing processor settings
- Better handling of comments and documentation
- Multi-transmission editing in a single graph
- Visual indication of processor types
- Proper file dialogs for loading/saving
