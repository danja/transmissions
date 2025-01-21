import { expect } from 'chai';
import path from 'path';
import fs from 'fs/promises';
import rdf from 'rdf-ext';
import StringFilter from '../../src/processors/text/StringFilter.js';
import ns from '../../src/utils/ns.js';

describe('StringFilter Integration', () => {
    let filter;
    let testDir;

    beforeEach(async () => {
        testDir = path.join(process.cwd(), 'test-data', 'string-filter');
        await fs.mkdir(testDir, { recursive: true });
    });

    afterEach(async () => {
        await fs.rm(testDir, { recursive: true, force: true });
    });

    async function createTestFiles() {
        await Promise.all([
            fs.writeFile(path.join(testDir, 'test.js'), ''),
            fs.writeFile(path.join(testDir, 'test.css'), ''),
            fs.writeFile(path.join(testDir, 'build/test.js'), ''),
            fs.writeFile(path.join(testDir, 'node_modules/test.js'), '')
        ]);
    }

    function createConfigDataset(patterns) {
        const dataset = rdf.dataset();
        const subject = rdf.namedNode('http://example.org/config');

        dataset.add(rdf.quad(
            subject,
            ns.rdf.type,
            ns.trn.ConfigSet
        ));

        if (patterns.commaPattern) {
            dataset.add(rdf.quad(
                subject,
                ns.trn.excludePatterns,
                rdf.literal(patterns.commaPattern)
            ));
        }

        if (patterns.singlePatterns) {
            patterns.singlePatterns.forEach(pattern => {
                dataset.add(rdf.quad(
                    subject,
                    ns.trn.excludePattern,
                    rdf.literal(pattern)
                ));
            });
        }

        return { dataset, subject };
    }

    it('should handle comma-separated patterns', async () => {
        const { dataset, subject } = createConfigDataset({
            commaPattern: 'node_modules/*,build/*'
        });

        filter = new StringFilter({ dataset });
        filter.settingsNode = subject;

        await createTestFiles();

        const messages = await Promise.all([
            filter.process({ filepath: path.join(testDir, 'test.js') }),
            filter.process({ filepath: path.join(testDir, 'build/test.js') }),
            filter.process({ filepath: path.join(testDir, 'node_modules/test.js') })
        ]);

        const passedFiles = messages.filter(Boolean);
        expect(passedFiles).to.have.lengthOf(1);
        expect(passedFiles[0].filepath).to.include('test.js');
        expect(passedFiles[0].filepath).to.not.include('build');
        expect(passedFiles[0].filepath).to.not.include('node_modules');
    });

    it('should handle multiple single patterns', async () => {
        const { dataset, subject } = createConfigDataset({
            singlePatterns: ['node_modules/*', 'build/*']
        });

        filter = new StringFilter({ dataset });
        filter.settingsNode = subject;

        await createTestFiles();

        const messages = await Promise.all([
            filter.process({ filepath: path.join(testDir, 'test.js') }),
            filter.process({ filepath: path.join(testDir, 'build/test.js') }),
            filter.process({ filepath: path.join(testDir, 'node_modules/test.js') })
        ]);

        const passedFiles = messages.filter(Boolean);
        expect(passedFiles).to.have.lengthOf(1);
        expect(passedFiles[0].filepath).to.include('test.js');
        expect(passedFiles[0].filepath).to.not.include('build');
        expect(passedFiles[0].filepath).to.not.include('node_modules');
    });

    it('should handle mixed pattern styles', async () => {
        const { dataset, subject } = createConfigDataset({
            commaPattern: 'node_modules/*',
            singlePatterns: ['build/*']
        });

        filter = new StringFilter({ dataset });
        filter.settingsNode = subject;

        await createTestFiles();

        const messages = await Promise.all([
            filter.process({ filepath: path.join(testDir, 'test.js') }),
            filter.process({ filepath: path.join(testDir, 'build/test.js') }),
            filter.process({ filepath: path.join(testDir, 'node_modules/test.js') })
        ]);

        const passedFiles = messages.filter(Boolean);
        expect(passedFiles).to.have.lengthOf(1);
        expect(passedFiles[0].filepath).to.include('test.js');
        expect(passedFiles[0].filepath).to.not.include('build');
        expect(passedFiles[0].filepath).to.not.include('node_modules');
    });
});