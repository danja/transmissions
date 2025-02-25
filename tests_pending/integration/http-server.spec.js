import { expect } from 'chai';
import fetch from 'node-fetch';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('HTTP Server Integration', () => {
    const SERVER_URL = 'http://localhost:4000';
    const TEST_VALUES = { testKey: 'testValue' };
    let serverProcess;

    before(async () => {
        serverProcess = exec('node src/api/cli/run.js test_http-server');
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    after(async () => {
        try {
            await fetch(`${SERVER_URL}/shutdown`, {
                method: 'POST'
            });
        } catch (e) {
            console.log('Server already stopped');
        }
    });

    it('should serve static files', async () => {
        const response = await fetch(`${SERVER_URL}/transmissions/test/`);
        expect(response.status).to.equal(200);
        const html = await response.text();
        expect(html).to.include('HTTP Server Test Interface');
    });

    it('should accept message values and shutdown', async () => {
        const response = await fetch(`${SERVER_URL}/shutdown`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_VALUES)
        });
        expect(response.status).to.equal(200);
    });
});
