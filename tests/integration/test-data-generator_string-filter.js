import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

class TestDataGenerator {
    constructor(baseDir) {
        this.baseDir = baseDir;
        this.inputDir = path.join(baseDir, 'input');
        this.outputDir = path.join(baseDir, 'output');
        this.fileTypes = new Set(['.txt', '.js', '.log', '.md', '.json']);
    }

    async init() {
        await fs.mkdir(this.inputDir, { recursive: true });
        await fs.mkdir(this.outputDir, { recursive: true });
    }

    async cleanup() {
        await fs.rm(this.baseDir, { recursive: true, force: true });
    }

    async createDirectoryStructure() {
        const structure = {
            'docs': {
                'api': ['config.md', 'overview.md'],
                'examples': ['basic.js', 'advanced.js']
            },
            'src': {
                'lib': ['util.js', 'core.js'],
                'test': ['test.js', 'mock.js']
            },
            'temp': ['temp1.log', 'temp2.log'],
            'data': ['data.json', 'schema.json']
        };

        for (const [dir, contents] of Object.entries(structure)) {
            const dirPath = path.join(this.inputDir, dir);
            await fs.mkdir(dirPath, { recursive: true });

            if (Array.isArray(contents)) {
                for (const file of contents) {
                    await this.createTestFile(path.join(dir, file));
                }
            } else {
                for (const [subdir, files] of Object.entries(contents)) {
                    const subdirPath = path.join(dirPath, subdir);
                    await fs.mkdir(subdirPath, { recursive: true });
                    
                    for (const file of files) {
                        await this.createTestFile(path.join(dir, subdir, file));
                    }
                }
            }
        }
    }

    async createTestFile(relativePath, content = '') {
        const filePath = path.join(this.inputDir, relativePath);
        const ext = path.extname(filePath);
        
        if (!content) {
            content = this.generateContent(ext);
        }
        
        await fs.writeFile(filePath, content);
        return filePath;
    }

    generateContent(ext) {
        const timestamp = new Date().toISOString();
        
        switch (ext) {
            case '.js':
                return `// Test file generated ${timestamp}
export function test() {
    return 'test content';
}`;

            case '.json':
                return JSON.stringify({
                    generated: timestamp,
                    type: 'test',
                    version: '1.0.0'
                }, null, 2);

            case '.md':
                return `# Test File
Generated: ${timestamp}

## Content
Test content for markdown file.`;

            case '.log':
                return `[${timestamp}] INFO Test log content
[${timestamp}] DEBUG Additional details`;

            default:
                return `Test content generated at ${timestamp}`;
        }
    }

    async createPatternTestSet() {
        const testCases = [
            { file: 'include.js', shouldMatch: true },
            { file: 'exclude.txt', shouldMatch: false },
            { file: '.hidden.js', shouldMatch: false },
            { file: 'temp.dat', shouldMatch: false },
            { file: 'test.min.js', shouldMatch: true },
            { file: 'backup.js.bak', shouldMatch: false }
        ];

        const files = await Promise.all(testCases.map(async ({ file }) => {
            const filePath = await this.createTestFile(file);
            return { path: filePath, name: file };
        }));

        return {
            files,
            testCases: testCases.reduce((acc, { file, shouldMatch }) => {
                acc[file] = shouldMatch;
                return acc;
            }, {})
        };
    }

    async createNestedStructure(depth = 3, filesPerLevel = 2) {
        const files = [];
        
        async function createLevel(currentPath, currentDepth) {
            if (currentDepth > depth) return;

            const dirPath = path.join(this.inputDir, currentPath);
            await fs.mkdir(dirPath, { recursive: true });

            for (let i = 1; i <= filesPerLevel; i++) {
                const filename = `level${currentDepth}-file${i}.js`;
                const filePath = path.join(currentPath, filename);
                await this.createTestFile(filePath);
                files.push(filePath);
            }

            await createLevel.call(
                this,
                path.join(currentPath, `level${currentDepth + 1}`),
                currentDepth + 1
            );
        }

        await createLevel.call(this, 'nested', 1);
        return files;
    }

    async createLargeFileSet(count = 1000) {
        const files = [];
        const types = Array.from(this.fileTypes);
        
        for (let i = 1; i <= count; i++) {
            const type = types[i % types.size];
            const filename = `file${String(i).padStart(5, '0')}${type}`;
            const filePath = await this.createTestFile(filename);
            files.push(filePath);
        }

        return files;
    }

    getExpectedOutput(inputPath) {
        const filename = path.basename(inputPath);
        if (!filename.includes('.')) return null;
        
        const [name, ...extensions] = filename.split('.');
        const baseExt = extensions.pop();
        
        return {
            html: path.join(this.outputDir, `${name}.mm.html`),
            svg: path.join(this.outputDir, `${name}.mm.svg`)
        };
    }
}

export default TestDataGenerator;