import footpath from '../../src/utils/footpath.js'

import path from 'path'
import { fileURLToPath } from 'url'
import { expect } from 'chai'
import { exec } from 'child_process'
import fs from 'fs'


describe('file-pipeline', function () {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename)
    const rootDir = path.resolve(__dirname, '../../')

    const dataFile = footpath.resolve(import.meta.url, '../../src/transmissions/file-pipeline/data/', 'output.txt')
    console.log('in f spec dataFile = ' + dataFile)
    it('produces correct output', function (done) {
        // Delete the output file if it exists
        if (fs.existsSync(dataFile)) {
            fs.unlinkSync(dataFile);
        }

        exec('node src/transmissions/file-pipeline/run.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            // Read the output file
            fs.readFile(dataFile, 'utf8', (err, data) => {
                if (err) {
                    console.error(`readFile error: ${err}`);
                    return;
                }

                // Check the output
                expect(data.trim()).to.equal('Hello world world');
                done();
            });
        });
    });
});