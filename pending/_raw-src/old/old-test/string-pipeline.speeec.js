import { expect } from 'chai'
import { exec } from 'child_process'
// import fs from 'fs'

// const chai = require('chai');
// const exec = require('child_process').exec;
// const expect = chai.expect;

describe('string-transmission', function () {
    it('produces correct output', function (done) {
        exec('node run.js string-transmission Hello', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            // Extract the quoted part from stdout
            const match = stdout.match(/"([^"]+)"/)
            const output = match ? match[1] : ''

            expect(output).to.equal('Hello world world')
            //  expect(stdout.trim()).to.equal('Hello world world');
            done();
        });
    });
});