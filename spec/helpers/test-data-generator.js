import path from 'path';
import fs from 'fs/promises';
import logger from '../../src/utils/Logger.js';

class TestDataGenerator {
    constructor(baseDir) {
        this.baseDir = baseDir;
    }

    async init() {
        await fs.mkdir(this.baseDir, { recursive: true });
        await fs.mkdir(path.join(this.baseDir, 'input'), { recursive: true });
        await fs.mkdir(path.join(this.baseDir, 'output'), { recursive: true });
    }

    async generateMarkdownFiles(count = 5) {
        const files = [];
        for (let i = 1; i <= count; i++) {
            const content = this.generateMarkdownContent(i);
            const filename = `test-${String(i).padStart(2, '0')}.md`;
            const filepath = path.join(this.baseDir, 'input', filename);
            
            await fs.writeFile(filepath, content);
            files.push(filepath);
        }
        return files;
    }

    generateMarkdownContent(depth = 3) {
        const content = [];
        content.push(`# Test Document ${depth}`);
        
        for (let i = 1; i <= depth; i++) {
            content.push(`\n${'#'.repeat(i + 1)} Section ${i}`);
            content.push(this.generateListItems(i));
            
            if (i < depth) {
                content.push(this.generateParagraph(i));
            }
        }
        
        return content.join('\n');
    }

    generateListItems(count) {
        const items = [];
        for (let i = 1; i <= count; i++) {
            items.push(`* List item ${i}`);
            if (Math.random() > 0.5) {
                for (let j = 1; j <= 2; j++) {
                    items.push(`  * Nested item ${i}.${j}`);
                }
            }
        }
        return items.join('\n');
    }

    generateParagraph(seed) {
        const sentences = [
            "Lorem ipsum dolor sit amet.",
            "Consectetur adipiscing elit.",
            "Sed do eiusmod tempor incididunt.",
            "Ut labore et dolore magna aliqua.",
            "Ut enim ad minim veniam."
        ];
        
        return sentences.slice(0, seed + 1).join(' ');
    }

    async generateNestedStructure(depth = 3) {
        for (let i = 1; i <= depth; i++) {
            const dirPath = path.join(this.baseDir, 'input', 'nested', 
                ...Array(i).fill(0).map((_, idx) => `level-${idx + 1}`));
            
            await fs.mkdir(dirPath, { recursive: true });
            
            const content = this.generateMarkdownContent(i);
            const filepath = path.join(dirPath, `nested-${i}.md`);
            await fs.writeFile(filepath, content);
        }
    }

    async generateEdgeCases() {
        const cases = {
            'empty.md': '',
            'only-title.md': '# Solo Title',
            'special-chars.md': '# Test & < > " \' Document',
            'very-deep.md': this.generateDeepStructure(10),
            'wide.md': this.generateWideStructure(10)
        };

        const edgeCaseDir = path.join(this.baseDir, 'input', 'edge-cases');
        await fs.mkdir(edgeCaseDir, { recursive: true });

        for (const [filename, content] of Object.entries(cases)) {
            await fs.writeFile(path.join(edgeCaseDir, filename), content);
        }
    }

    generateDeepStructure(depth) {
        return Array(depth)
            .fill(0)
            .map((_, i) => `${'#'.repeat(i + 1)} Level ${i + 1}`)
            .join('\n');
    }

    generateWideStructure(width) {
        const content = ['# Wide Document'];
        for (let i = 1; i <= width; i++) {
            content.push(`## Section ${i}`);
            for (let j = 1; j <= width; j++) {
                content.push(`* Item ${i}.${j}`);
            }
        }
        return content.join('\n');
    }

    async generateRequiredOutputs(sourceDir) {
        const files = await fs.readdir(sourceDir);
        for (const file of files) {
            if (file.endsWith('.md')) {
                const content = await fs.readFile(path.join(sourceDir, file));
                
                // Generate HTML required output
                await fs.writeFile(
                    path.join(this.baseDir, 'output', `required-${file.replace('.md', '.mm.html')}`),
                    this.wrapHTML(content.toString())
                );
                
                // Generate SVG required output
                await fs.writeFile(
                    path.join(this.baseDir, 'output', `required-${file.replace('.md', '.mm.svg')}`),
                    this.generateSVG(content.toString())
                );
            }
        }
    }

    wrapHTML(content) {
        return `<!DOCTYPE html>
<html>
<head>
    <title>Markmap</title>
</head>
<body>
    <div class="markmap">
        ${content}
    </div>
</body>
</html>`;
    }

    generateSVG(content) {
        // Simple SVG wrapper for test purposes
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
    <text x="10" y="20">Test SVG for: ${content.split('\n')[0]}</text>
</svg>`;
    }

    async cleanup() {
        try {
            await fs.rm(this.baseDir, { recursive: true, force: true });
        } catch (error) {
            logger.error('Cleanup error:', error);
        }
    }
}

export default TestDataGenerator;
