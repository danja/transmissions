
const { expect } = require('chai');
const fs = require('fs');
const { DependencyInjector } = require('../di/DependencyInjector.js');
const { Piper } = require('../di/Piper.js');

describe('Pipeline Integration Test', function() {
    it('should read, process, and save a file correctly', async function() {
        const di = new DependencyInjector();
        const app = di.make(Piper);
        const inputFilePath = '/mnt/data/pipeline_project/test.txt';
        const outputFilePath = '/mnt/data/pipeline_project/output.txt';

        await app.run(inputFilePath, outputFilePath);

        // Check if output file exists
        expect(fs.existsSync(outputFilePath)).to.be.true;

        // Verify the content of the output file (this depends on the processing logic)
        const outputContent = fs.readFileSync(outputFilePath, 'utf8');
        // Here we need to add an assertion based on the expected processing result
        // For example, if the processing capitalizes text:
        // expect(outputContent).to.equal('EXPECTED PROCESSED CONTENT');
    });
});
