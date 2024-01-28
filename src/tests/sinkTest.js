
const { expect } = require('chai');
const { Sink } = require('../services/Sink.js');
const fs = require('fs');

describe('Sink Component Tests', function() {
    let sink;
    const testOutputFile = 'test_output.txt';

    before(() => {
        sink = new Sink();
    });

    after(() => {
        // Clean up: remove the test output file if it exists
        if (fs.existsSync(testOutputFile)) {
            fs.unlinkSync(testOutputFile);
        }
    });

    it('should write content to a file', function() {
        const testContent = 'Test content';
        sink.write(testOutputFile, testContent);
        expect(fs.existsSync(testOutputFile)).to.be.true;
        const writtenContent = fs.readFileSync(testOutputFile, 'utf8');
        expect(writtenContent).to.equal(testContent);
    });

    // Additional tests can be added here
});

module.exports = sink_test_code;
