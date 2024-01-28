
const { expect } = require('chai');
const { Piper } = require('../di/Piper.js');
const fs = require('fs');

describe('Piper Integration Tests', function() {
    let piper;
    const outputFilePath = './output.txt';

    before(() => {
        piper = new Piper();
    });

    after(() => {
        // Clean up: remove the output file if it exists
        if (fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
        }
    });

    it('should execute the pipeline correctly', function() {
        piper.run();
        expect(fs.existsSync(outputFilePath)).to.be.true;
        const outputContent = fs.readFileSync(outputFilePath, 'utf8');
        expect(outputContent).to.contain('hello'); // Expecting the Process class to prepend 'hello'
    });

    // Additional integration tests can be added here
});

module.exports = piper_test_code;
