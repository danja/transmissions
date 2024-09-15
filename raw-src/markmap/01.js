import { Transformer } from 'markmap-lib';
import { fillTemplate } from 'markmap-render';

const input = `# A markdown string
## another

* bullet1
* bullet2`

function expandNode(node, depth = 0) {
    const indent = '  '.repeat(depth);
    console.log(`${indent}content: ${JSON.stringify(node.content)}`);
    if (node.payload) {
        console.log(`${indent}payload: ${JSON.stringify(node.payload)}`);
    }
    if (node.children && node.children.length > 0) {
        console.log(`${indent}children:`);
        node.children.forEach(child => expandNode(child, depth + 1));
    }
}

// Step 1: Transform markdown to markmap data
const transformer = new Transformer();
const A = transformer.transform(input);

// Step 2: Get assets (CSS and JS) needed for rendering
const B = transformer.getAssets();

// Step 3: Generate HTML with embedded SVG
const C = fillTemplate(A.root, B);


// Now C contains the final HTML with embedded SVG

// console.log(A)
//console.log(B)
// console.log(C)
expandNode(A.root);