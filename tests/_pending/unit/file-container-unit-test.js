import { expect } from 'chai';
import FileContainer from '../../../src/processors/packer/FileContainer.js';

describe('FileContainer', () => {
    let container;
    const config = { destination: 'test-output.json' };

    beforeEach(() => {
        container = new FileContainer(config);
    });

    it('should store file content and metadata', async () => {
        const message = {
            filepath: '/test/file.js',
            content: 'console.log("test")',
            rootDir: '/test'
        };

        let outputMessage;
        container.on('message', (msg) => {
            outputMessage = msg;
        });

        await container.process(message);
        
        expect(container.container.files['file.js']).to.exist;
        expect(container.container.files['file.js'].content).to.equal(message.content);
        expect(container.container.files['file.js'].type).to.equal('.js');
    });

    it('should update summary statistics', async () => {
        await container.process({
            filepath: '/test/file1.js',
            content: 'test',
            rootDir: '/test'
        });

        expect(container.container.summary.totalFiles).to.equal(1);
        expect(container.container.summary.fileTypes['.js']).to.equal(1);
    });

    it('should handle done message correctly', async () => {
        await container.process({
            filepath: '/test/file.js',
            content: 'test',
            rootDir: '/test'
        });

        let finalMessage;
        container.on('message', (msg) => {
            finalMessage = msg;
        });

        await container.process({ done: true });
        
        expect(finalMessage.content).to.be.a('string');
        expect(finalMessage.filepath).to.equal(config.destination);
    });
});