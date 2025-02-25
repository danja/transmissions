import { expect } from 'chai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('FileContainer Integration', () => {
    const testDir = path.join(__dirname, '../../src/applications/test_file-container/data');
    const inputDir = path.join(testDir, 'input');
    const outputDir = path.join(testDir, 'output');

    beforeEach(async () => {
        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(
            path.join(inputDir, 'test1.js'),
            'console.log("test1");'
        );
        await fs.writeFile(
            path.join(inputDir, 'test2.js'),
            'console.log("test2");'
        );
    });

    afterEach(async () => {
        try {
            await fs.rm(outputDir, { recursive: true });
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }
    });

    it('should process files in pipeline', async () => {
        const { exec } = await import('child_process');
        const util = await import('util');
        const execAsync = util.promisify(exec);

        const result = await execAsync('node src/api/cli/run.js test_file-container', {
            cwd: path.resolve(__dirname, '../../')
        });

        const output = JSON.parse(await fs.readFile(
            path.join(outputDir, 'container-output.json'),
            'utf8'
        ));

        expect(output.files).to.have.property('test1.js');
        expect(output.files).to.have.property('test2.js');
        expect(output.summary.totalFiles).to.equal(2);
        expect(output.summary.fileTypes['.js']).to.equal(2);
    });
});