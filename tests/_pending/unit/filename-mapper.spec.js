import FilenameMapper from '../../src/processors/fs/FilenameMapper.js';
import { expect } from 'chai';

describe('FilenameMapper', () => {
    let filenameMapper;

    beforeEach(() => {
        filenameMapper = new FilenameMapper({
            extensions: {
                html: '.mm.html',
                svg: '.mm.svg'
            }
        });
    });

    it('should map HTML extension correctly', async () => {
        const message = {
            filepath: '/test/example.md',
            format: 'html'
        };

        let outputMessage;
        filenameMapper.on('message', (msg) => {
            outputMessage = msg;
        });

        await filenameMapper.process(message);
        expect(outputMessage.filepath).to.equal('/test/example.mm.html');
    });

    it('should map SVG extension correctly', async () => {
        const message = {
            filepath: '/test/example.md',
            format: 'svg'
        };

        let outputMessage;
        filenameMapper.on('message', (msg) => {
            outputMessage = msg;
        });

        await filenameMapper.process(message);
        expect(outputMessage.filepath).to.equal('/test/example.mm.svg');
    });

    it('should throw error for missing filepath', async () => {
        const message = {
            format: 'html'
        };

        try {
            await filenameMapper.process(message);
            expect.fail('Should have thrown error');
        } catch (error) {
            expect(error.message).to.equal('No filepath provided in message');
        }
    });

    it('should throw error for unknown format', async () => {
        const message = {
            filepath: '/test/example.md',
            format: 'unknown'
        };

        try {
            await filenameMapper.process(message);
            expect.fail('Should have thrown error');
        } catch (error) {
            expect(error.message).to.equal('Unknown format: unknown');
        }
    });

    it('should preserve directory structure', async () => {
        const message = {
            filepath: '/deep/nested/path/example.md',
            format: 'html'
        };

        let outputMessage;
        filenameMapper.on('message', (msg) => {
            outputMessage = msg;
        });

        await filenameMapper.process(message);
        expect(outputMessage.filepath).to.equal('/deep/nested/path/example.mm.html');
    });
});
