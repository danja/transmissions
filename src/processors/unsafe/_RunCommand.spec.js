import RunCommand from '../../src/processors/unsafe/RunCommand.js';
import { expect } from 'chai';
import fs from 'fs/promises';
import path from 'path';

describe('RunCommand', function () {
    let runCommand;
    const workingDir = 'src/applications/test_runcommand/data';

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
        runCommand = new RunCommand({
            simples: true,
            allowedCommands: ['echo', 'ls'],
            blockedPatterns: ['rm', '|']
        });
    });

    it('should validate command output against required file', async function () {
        const requiredPath = path.join(workingDir, 'output', 'required-01.txt');
        const required = await fs.readFile(requiredPath, 'utf8');
        const message = { command: 'echo "Hello from RunCommand!"' };

        const result = await runCommand.process(message);
        expect(result.content.trim()).to.equal(required.trim());
    });

    it('should handle timeouts', async function () {
        try {
            await runCommand.executeCommand('sleep 10');
            expect.fail('Should have timed out');
        } catch (error) {
            expect(error.message).to.include('timeout');
        }
    });
});