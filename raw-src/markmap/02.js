import { Transformer } from 'markmap-lib';
import { fillTemplate } from 'markmap-render';
import fs from 'fs/promises';

const input = '# A markdown string\n## Subheading\n- List item 1\n- List item 2';

async function generateMarkmap() {
    // Step 1: Transform markdown to markmap data
    const transformer = new Transformer();
    const { root, features } = transformer.transform(input);

    // Step 2: Get assets (CSS and JS) needed for rendering
    const assets = transformer.getUsedAssets(features);

    // Step 3: Generate HTML with embedded SVG
    const html = fillTemplate(root, assets);

    // Step 4: Extract SVG (this is a simplification and may not be perfect)
    const svgMatch = html.match(/<svg[^>]*>[\s\S]*?<\/svg>/i);
    const svg = svgMatch ? svgMatch[0] : '';

    // Save outputs
    await fs.writeFile('output.html', html);
    await fs.writeFile('output.svg', svg);

    console.log('HTML and SVG files have been generated.');
}

generateMarkmap().catch(console.error);