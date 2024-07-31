import { expect } from 'chai';
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDir = path.resolve(__dirname, '../../src/applications/file-copy-remove-test/data');

async function setupInitialStructure() {
    const startDir = path.join(testDir, 'start');
    await fs.mkdir(startDir, { recursive: true });
    await fs.writeFile(path.join(startDir, 'one.txt'), 'Hello from One');
    await fs.writeFile(path.join(startDir, 'two.txt'), 'Hello from Two');
}

describe('file-copy-remove-test', function () {
    // Increase the timeout for the entire test suite
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000; // 30 seconds

    async function getDirContents(dir) {
        try {
            return await fs.readdir(path.join(testDir, dir));
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
    }

    async function clearDir(dir) {
        try {
            await fs.rm(path.join(testDir, dir), { recursive: true, force: true });
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }
    }

    beforeAll(async function () {
        console.log('Starting beforeAll...');
        await setupInitialStructure();
        await Promise.all([
            clearDir('single-empty'),
            clearDir('single-full'),
            clearDir('several-empty'),
            clearDir('several-full')
        ]);
        console.log('Finished beforeAll');
    });

    it('performs file operations correctly', function (done) {
        console.log('Starting test...');
        exec('node run.js file-copy-remove-test', async (error, stdout, stderr) => {
            console.log('Exec completed');
            if (error) {
                console.error(`exec error: ${error}`);
                return done(error);
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);
            try {
                const singleEmpty = await getDirContents('single-empty');
                console.log('single-empty contents:', singleEmpty);
                expect(singleEmpty).to.be.empty;

                const singleFull = await getDirContents('single-full');
                console.log('single-full contents:', singleFull);
                expect(singleFull).to.deep.equal(['one.txt']);

                const severalEmpty = await getDirContents('several-empty');
                console.log('several-empty contents:', severalEmpty);
                expect(severalEmpty).to.be.empty;

                const severalFull = await getDirContents('several-full');
                console.log('several-full contents:', severalFull);
                expect(severalFull).to.have.members(['one.txt', 'two.txt']);

                console.log('All assertions passed');
                done();
            } catch (err) {
                console.error('Error in assertions:', err);
                done(err);
            }
        });
    });
});