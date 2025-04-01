# Transmission Pipeline Editor - Setup Guide

## Project Setup

### 1. Create Directory Structure

First, create the necessary directory structure:

```
src/
└── tools/
    └── nodeflow/
```

### 2. Install Dependencies

The editor requires the `node-flow` library from npm:

```bash
npm install @elicdavis/node-flow
```

### 3. Create ESM Import Map

Create an `import-map.json` file in your project root:

```json
{
  "imports": {
    "@elicdavis/node-flow": "./node_modules/@elicdavis/node-flow/dist/index.mjs",
    "node-flow-components": "./src/tools/nodeflow/components/index.js"
  }
}
```

### 4. Project Entry Point

Create an `index.html` file that correctly loads the modules:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transmission Pipeline Editor</title>
  <script type="importmap">
    {
      "imports": {
        "@elicdavis/node-flow": "./node_modules/@elicdavis/node-flow/dist/index.mjs",
        "node-flow-components": "./src/tools/nodeflow/components/index.js"
      }
    }
  </script>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }
    
    #editor-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    #canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
    
    #toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding: 10px;
      background-color: #0c2b35;
      color: #afb9bb;
      display: flex;
      gap: 10px;
      z-index: 100;
    }
    
    button {
      padding: 5px 10px;
      background-color: #154050;
      color: #afb9bb;
      border: 1px solid #1c1c1c;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    button:hover {
      background-color: #195366;
    }
    
    #status {
      margin-left: auto;
      padding: 5px 10px;
      background-color: #07212a;
      border-radius: 4px;
    }
    
    .dialog {
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #0c2b35;
      border: 1px solid #154050;
      border-radius: 8px;
      padding: 20px;
      z-index: 200;
      min-width: 300px;
    }
    
    .dialog h2 {
      margin-top: 0;
      color: #afb9bb;
    }
    
    .dialog label {
      display: block;
      margin-bottom: 5px;
      color: #afb9bb;
    }
    
    .dialog input {
      width: 100%;
      padding: 8px;
      background-color: #07212a;
      border: 1px solid #154050;
      border-radius: 4px;
      color: #afb9bb;
      margin-bottom: 15px;
    }
    
    .dialog-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  </style>
</head>
<body>
  <div id="toolbar">
    <button id="load-btn">Load TTL</button>
    <button id="save-btn">Save TTL</button>
    <button id="new-btn">New Transmission</button>
    <button id="organize-btn">Organize</button>
    <span id="status">Ready</span>
  </div>
  
  <div id="editor-container">
    <canvas id="canvas"></canvas>
  </div>
  
  <div id="new-dialog" class="dialog">
    <h2>New Transmission</h2>
    <label for="transmission-name">Transmission Name:</label>
    <input type="text" id="transmission-name" value="New Transmission">
    <div class="dialog-buttons">
      <button id="cancel-new">Cancel</button>
      <button id="create-new">Create</button>
    </div>
  </div>
  
  <!-- Hidden file input -->
  <input type="file" id="file-input" accept=".ttl" style="display:none">
  
  <script type="module">
    import { TransmissionEditor } from "./src/tools/nodeflow/components/index.js";
    
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize the editor
      const canvas = document.getElementById('canvas');
      const editor = new TransmissionEditor(canvas);
      
      // Set up UI elements
      const fileInput = document.getElementById('file-input');
      const loadBtn = document.getElementById('load-btn');
      const saveBtn = document.getElementById('save-btn');
      const newBtn = document.getElementById('new-btn');
      const organizeBtn = document.getElementById('organize-btn');
      const status = document.getElementById('status');
      
      // New transmission dialog
      const newDialog = document.getElementById('new-dialog');
      const transmissionName = document.getElementById('transmission-name');
      const cancelNewBtn = document.getElementById('cancel-new');
      const createNewBtn = document.getElementById('create-new');
      
      // Load TTL file
      loadBtn.addEventListener('click', () => {
        fileInput.click();
      });
      
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            status.textContent = `Loading ${file.name}...`;
            await editor.loadFromFile(file.path || URL.createObjectURL(file));
            status.textContent = `Loaded ${file.name}`;
          } catch (error) {
            status.textContent = `Error: ${error.message}`;
            console.error(error);
          }
        }
      });
      
      // Save TTL file
      saveBtn.addEventListener('click', async () => {
        try {
          status.textContent = 'Saving...';
          
          // In a real application, we would show a file dialog here
          // For now, we'll just save to the loaded file
          await editor.saveToFile();
          
          status.textContent = 'Saved!';
        } catch (error) {
          status.textContent = `Error: ${error.message}`;
          console.error(error);
        }
      });
      
      // New transmission
      newBtn.addEventListener('click', () => {
        newDialog.style.display = 'block';
      });
      
      cancelNewBtn.addEventListener('click', () => {
        newDialog.style.display = 'none';
      });
      
      createNewBtn.addEventListener('click', () => {
        const name = transmissionName.value.trim() || 'New Transmission';
        editor.createNewTransmission(name);
        newDialog.style.display = 'none';
        status.textContent = `Created new transmission: ${name}`;
      });
      
      // Organize graph
      organizeBtn.addEventListener('click', () => {
        try {
          editor.getGraph().organize();
          status.textContent = 'Graph organized!';
        } catch (error) {
          status.textContent = `Error: ${error.message}`;
          console.error(error);
        }
      });
      
      // Initial status
      status.textContent = 'Ready - Click "Load TTL" to open a transmission file';
    });
  </script>
</body>
</html>
```

## 5. Create Components Directory

Create a components directory to organize your editor modules:

```
src/tools/nodeflow/
└── components/
    ├── TransmissionsLoader.js
    ├── ProcessorNodePublisher.js
    ├── TransmissionsGraphBuilder.js
    ├── TransmissionsExporter.js
    ├── TransmissionEditor.js
    └── index.js
```

## 6. Create index.js

Create a barrel file to export all components:

```javascript
// src/tools/nodeflow/components/index.js
export { default as TransmissionsLoader } from './TransmissionsLoader.js';
export { default as ProcessorNodePublisher } from './ProcessorNodePublisher.js';
export { default as TransmissionsGraphBuilder } from './TransmissionsGraphBuilder.js';
export { default as TransmissionsExporter } from './TransmissionsExporter.js';
export { default as TransmissionEditor } from './TransmissionEditor.js';
```

## Component Files with Correct Imports

### TransmissionEditor.js

```javascript
// src/tools/nodeflow/components/TransmissionEditor.js
import { NodeFlowGraph } from '@elicdavis/node-flow';
import TransmissionsLoader from './TransmissionsLoader.js';
import TransmissionsGraphBuilder from './TransmissionsGraphBuilder.js';
import TransmissionsExporter from './TransmissionsExporter.js';
import ProcessorNodePublisher from './ProcessorNodePublisher.js';
import logger from '../../../utils/Logger.js';

class TransmissionEditor {
  // Implementation remains the same
}

export default TransmissionEditor;
```

### ProcessorNodePublisher.js

```javascript
// src/tools/nodeflow/components/ProcessorNodePublisher.js
import { Publisher } from '@elicdavis/node-flow';
import ns from '../../../utils/ns.js';
import logger from '../../../utils/Logger.js';
import rdf from 'rdf-ext';

class ProcessorNodePublisher extends Publisher {
  // Implementation remains the same
}

export default ProcessorNodePublisher;
```

### TransmissionsGraphBuilder.js

```javascript
// src/tools/nodeflow/components/TransmissionsGraphBuilder.js
import { FlowNode } from '@elicdavis/node-flow';
import ns from '../../../utils/ns.js';
import logger from '../../../utils/Logger.js';

class TransmissionsGraphBuilder {
  // Implementation remains the same
}

export default TransmissionsGraphBuilder;
```

## Running the Editor

1. Start a local web server in your project root:

```bash
npx http-server -p 8080
```

2. Open http://localhost:8080 in your browser

3. The editor will be available and ready to use

## Troubleshooting

### Common Import Errors

If you see errors like this:

```
Uncaught TypeError: Failed to resolve module specifier "@elicdavis/node-flow"
```

Check that:
1. The import map is correctly defined in your HTML
2. You've installed the package with npm
3. The path in the import map matches the actual location of the file

### CORS Issues

If you experience CORS issues when loading files:
1. Make sure you're using a proper web server (not opening the HTML file directly)
2. For file operations, consider using a tool like Electron for desktop app capabilities

### Module Loading Issues

Modern browsers require proper MIME types for ES modules. Ensure your server is configured to serve JavaScript files with the correct MIME type:

```
Content-Type: application/javascript
```
