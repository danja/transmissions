# Transmission Pipeline Editor - Handover Document

## Project Overview

This project implements a visual editor for transmission pipelines using the node-flow library. It enables developers to:

1. Visualize transmission pipelines defined in TTL format
2. Edit these pipelines through an interactive graphical interface
3. Save changes back to the original TTL format

The implementation follows a loosely-coupled architecture that bridges the transmission system and the node-flow library without creating tight dependencies between them. This design ensures that changes to either system will have minimal impact on the integration.

## Architecture

The implementation follows a model-view-controller pattern with specialized components:

![Architecture Diagram](https://i.imgur.com/IzOc5X8.png)

### Core Components

1. **TransmissionsLoader** - Parses TTL files into an intermediate data structure
2. **ProcessorNodePublisher** - Defines processor types as node-flow node types
3. **TransmissionsGraphBuilder** - Constructs node-flow graphs from transmission data
4. **TransmissionsExporter** - Serializes node-flow graphs back to TTL format
5. **TransmissionEditor** - Coordinates the other components and provides the main API

## Implementation Details

### File Structure

```
src/tools/nodeflow/
├── TransmissionsLoader.js
├── ProcessorNodePublisher.js
├── TransmissionsGraphBuilder.js
├── TransmissionsExporter.js
├── TransmissionEditor.js
├── index.html
└── README.md
```

### Component Breakdown

#### 1. TransmissionsLoader.js

This component loads transmission TTL files and parses them into a standardized intermediate format:

```javascript
{
  id: "http://purl.org/stuff/transmissions/ccc",
  shortId: "ccc",
  label: "ccc",
  comment: "Claude conversations.json converter",
  processors: [
    {
      id: "http://purl.org/stuff/transmissions/ccc10",
      shortId: "ccc10",
      type: "http://purl.org/stuff/transmissions/FileReader",
      shortType: "FileReader",
      settings: "http://purl.org/stuff/transmissions/readFile",
      shortSettings: "readFile",
      comments: ["Claude conversations.json"]
    },
    // More processors...
  ],
  connections: [
    {
      from: "http://purl.org/stuff/transmissions/ccc10",
      to: "http://purl.org/stuff/transmissions/ccc20"
    },
    // More connections...
  ]
}
```

It uses the existing RDF utilities and Grapoi helpers to traverse the RDF graph and extract necessary information.

#### 2. ProcessorNodePublisher.js

Registers processor types as node definitions in node-flow. It preregisters common processor types and can dynamically register additional types found in loaded transmissions.

Each processor type is represented as a node with:
- Input and output ports for messages
- Styling based on the transmission system's theme
- Metadata to track its relation to the original TTL definitions

#### 3. TransmissionsGraphBuilder.js

Constructs a node-flow graph from the intermediate transmission data format:
- Creates nodes for each processor
- Positions them in a simple horizontal layout
- Establishes connections between nodes
- Sets metadata on nodes to maintain the link to TTL

#### 4. TransmissionsExporter.js

Performs the reverse of the loader, converting a node-flow graph back to TTL format:
- Extracts transmission structure from the graph
- Organizes nodes by their connections
- Generates an RDF dataset
- Serializes to TTL format

#### 5. TransmissionEditor.js

The main entry point that coordinates the other components:
- Initializes node-flow graph
- Handles loading TTL files
- Manages the graph building process
- Provides API for saving changes
- Sets up event handlers for the editor

## Usage Guide

### Basic Usage

```javascript
import TransmissionEditor from './tools/nodeflow/TransmissionEditor.js';

// Initialize the editor with a canvas element
const canvas = document.getElementById('editor-canvas');
const editor = new TransmissionEditor(canvas);

// Load a transmission TTL file
await editor.loadFromFile('path/to/transmission.ttl');

// Save changes back to TTL
await editor.saveToFile('path/to/output.ttl');
```

### Using the Editor UI

The included `index.html` provides a complete editor interface with:
- Load/Save buttons
- New transmission creation
- Graph organization
- Status indicators

## Technical Implementation Notes

### RDF Integration

The implementation relies on your existing RDF utilities:
- `RDFUtils.readDataset` and `RDFUtils.writeDataset` for file I/O
- `GrapoiHelpers.listToArray` for parsing RDF lists
- `ns` namespace helper for URI handling

### Node-Flow Integration

The integration uses these key features of node-flow:
- Publisher for defining node types
- Custom node styling and configuration
- Flow connections for representing pipeline links
- Node metadata for storing TTL-specific information

### Data Flow

1. TTL file → RDF dataset → Intermediate format → node-flow graph
2. User edits graph
3. node-flow graph → Intermediate format → RDF dataset → TTL file

## Tips and Hints

### Working with RDF

- The transmission system uses RDF lists extensively, particularly for the `trn:pipe` property
- Processor settings are referenced by URI, not embedded in the processor node
- Comments in the TTL are preserved as node metadata

### Node-Flow Limitations

- Node-flow doesn't provide a built-in method to remove nodes programmatically
- Visual positioning relies on manual calculation rather than auto-layout
- Connection logic must be handled explicitly between ports

### Common Issues

- **Missing processor types**: If a TTL file references a processor type that isn't registered, add it to the ProcessorNodePublisher
- **RDF parsing errors**: Check for malformed TTL syntax if loading fails
- **Connection failures**: Ensure input/output port types match (they're all 'message' by default)

## Suggested Next Steps

### Short Term Improvements

1. **Settings Editor**: Add support for editing processor settings directly
   - Create a UI for modifying `trn:settings` references
   - Implement settings form based on processor type

2. **Visual Enhancements**:
   - Add icons or visual indicators for different processor types
   - Implement processor state visualization (success/error/processing)
   - Add tooltips showing processor descriptions

3. **Usability Features**:
   - Proper file dialogs for loading/saving TTL files
   - Keyboard shortcuts for common operations
   - Undo/redo functionality

### Medium Term Goals

1. **Multi-Transmission Support**:
   - Edit multiple transmissions in a single graph
   - Visual differentiation between transmissions
   - Copy/paste between transmissions

2. **Integration with Runtime**:
   - Connect to running transmission instances
   - Visualize message flow through the pipeline
   - Debug mode with breakpoints and step execution

3. **Validation**:
   - Validate connections between incompatible processors
   - Warning for missing settings or invalid configurations
   - Type checking for processor inputs/outputs

### Long Term Vision

1. **Processor SDK**:
   - UI for creating new processor types
   - Testing framework for processors
   - Documentation generation

2. **Collaborative Editing**:
   - Real-time collaborative editing of transmissions
   - Change tracking and versioning
   - Comments and annotations

3. **Advanced Visualization**:
   - 3D visualization of complex pipelines
   - Flow animation showing message progression
   - Performance metrics visualization

## Conclusion

This implementation provides a solid foundation for visually editing transmission pipelines. The loosely-coupled architecture ensures that both the transmission system and node-flow can evolve independently while maintaining compatibility through the bridge components.

The most immediate value will come from implementing the settings editor and improving the visual design to make processor types more distinguishable. These improvements will make the editor more practical for daily use in transmission pipeline development.
