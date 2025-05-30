import { expect } from 'chai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('filename-mapper test', () => {
    const workingDir = path.join(__dirname, '../../src/apps/test_filename-mapper/data');
    const inputDir = path.join(workingDir, 'input');
    const outputDir = path.join(workingDir, 'output');

    async function setupTestFiles() {
        await fs.mkdir(outputDir, { recursive: true });
        const inputContent = 'Test content for filename mapping';
        await fs.writeFile(path.join(inputDir, 'input-01.txt'), inputContent);
    }

    async function cleanup() {
        try {
            const files = await fs.readdir(outputDir);
            for (const file of files) {
                if (file.startsWith('output-')) {
                    await fs.unlink(path.join(outputDir, file));
                }
            }
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }
    }

    beforeEach(async () => {
        await cleanup();
        await setupTestFiles();
    });

    afterAll(async () => {
        await cleanup();
    });

    async function compareFiles() {
        const outputFile = path.join(outputDir, 'output-01.txt');
        const requiredFile = path.join(outputDir, 'required-01.txt');

        const [output, required] = await Promise.all([
            fs.readFile(outputFile, 'utf8'),
            fs.readFile(requiredFile, 'utf8')
        ]);

        return output.trim() === required.trim();
    }

    it('should process files correctly', async () => {
        const { exec } = await import('child_process');
        const util = await import('util');
        const execAsync = util.promisify(exec);

        const result = await execAsync('node src/api/cli/run.js test_filename-mapper', {
            cwd: path.resolve(__dirname, '../..')
        });

        const matched = await compareFiles();
        expect(matched).to.be.true;
    });
});