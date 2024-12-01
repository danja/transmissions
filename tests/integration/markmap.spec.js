import path from 'path';
import { fileURLToPath } from 'url';
import { expect } from 'chai';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Markmap Integration', () => {
    const testDir = path.join(__dirname, '../../src/applications/markmap/data/test');
    const testFiles = ['test1.md', 'test2.md'];
    
    beforeAll(async () => {
        // Create test directory and files
        await fs.mkdir(testDir, { recursive: true });
        
        // Create test markdown files
        await fs.writeFile(
            path.join(testDir, 'test1.md'),
            '# Test 1\n## Section 1\n* Item 1\n* Item 2'
        );
        
        await fs.writeFile(
            path.join(testDir, 'test2.md'),
            '# Test 2\n## Section 2\n* Item A\n* Item B'
        );
    });

    afterAll(async () => {
        // Clean up test files
        await fs.rm(testDir, { recursive: true, force: true });
    });

    it('should process multiple markdown files through ForEach', async () => {
        const message = {
            paths: testFiles.map(f => path.join(testDir, f))
        };

        const result = await execAsync(
            `./trans markmap -m '${JSON.stringify(message)}'`
        );

        // Verify outputs exist
        for (const file of testFiles) {
            const basePath = path.join(testDir, path.parse(file).name);
            
            // Check HTML output
            const htmlPath = `${basePath}.mm.html`;
            const htmlExists = await fs.access(htmlPath)
                .then(() => true)
                .catch(() => false);
            expect(htmlExists).to.be.true;
            
            // Verify HTML content
            const html = await fs.readFile(htmlPath, 'utf8');
            expect(html).to.include('<html');
            expect(html).to.include(`Test ${file[4]}`); // Check title from original file
            
            // Check SVG output
            const svgPath = `${basePath}.mm.svg`;
            const svgExists = await fs.access(svgPath)
                .then(() => true)
                .catch(() => false);
            expect(svgExists).to.be.true;
            
            // Verify SVG content
            const svg = await fs.readFile(svgPath, 'utf8');
            expect(svg).to.include('<svg');
            expect(svg).to.include(`Test ${file[4]}`);
        }
    });

    it('should handle empty input paths array', async () => {
        const message = { paths: [] };
        
        const result = await execAsync(
            `./trans markmap -m '${JSON.stringify(message)}'`
        );
        
        // Verify no files were created
        const files = await fs.readdir(testDir);
        expect(files.filter(f => f.endsWith('.mm.html') || f.endsWith('.mm.svg')))
            .to.have.lengthOf(0);
    });

    it('should handle invalid markdown files gracefully', async () => {
        // Create invalid markdown file
        const invalidPath = path.join(testDir, 'invalid.md');
        await fs.writeFile(invalidPath, '# Title\n## [Invalid markdown');
        
        const message = {
            paths: [invalidPath]
        };

        try {
            await execAsync(`./trans markmap -m '${JSON.stringify(message)}'`);
        } catch (error) {
            expect(error.message).to.include('Error processing markdown');
        }
    });
});
