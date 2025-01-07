import footpath from '../../src/utils/footpath.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect } from 'chai';
import { exec } from 'child_process';
import fs from 'fs/promises';

describe('filename-mapper test', function () {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dataDir = path.join(__dirname, '../../src/applications/test_filename-mapper/data');

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    async function clearOutputFiles() {
        const outputDir = path.join(dataDir, 'output');
        const files = await fs.readdir(outputDir);
        for (const file of files) {
            if (file.startsWith('output-')) {
                await fs.unlink(path.join(outputDir, file));
            }
        }
    }

    async function compareFiles(index) {
        const outputFile = path.join(dataDir, 'output', `output-${index}.txt`);
        const requiredFile = path.join(dataDir, 'output', `required-${index}.txt`);

        console.log(`Comparing:
        Output: ${outputFile}
        Required: ${requiredFile}`);

        const output = await fs.readFile(outputFile, 'utf8');
        const required = await fs.readFile(requiredFile, 'utf8');

        return output.trim() === required.trim();
    }

    beforeEach(async () => {
        await clearOutputFiles();
    });

    it('should process files correctly', (done) => {
        exec('node src/api/cli/run.js test_filename-mapper', async (error, stdout, stderr) => {
            if (error) {
                console.error('Exec error:', error);
                done(error);
                return;
            }

            try {
                console.log('Transmission output:', stdout);
                if (stderr) console.error('Stderr:', stderr);

                const matched = await compareFiles('01');
                expect(matched).to.be.true;
                done();
            } catch (err) {
                console.error('Test error:', err);
                done(err);
            }
        });
    });

    it('should handle missing input file gracefully', (done) => {
        const testMessage = {
            filepath: 'nonexistent.txt',
            format: 'html'
        };

        exec(
            `node src/api/cli/run.js test_filename-mapper -m '${JSON.stringify(testMessage)}'`,
            (error) => {
                expect(error).to.not.be.null;
                done();
            }
        );
    });
});
