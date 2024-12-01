import MarkMap from '../../../src/applications/markmap/processors/MarkMap.js';
import { expect } from 'chai';

describe('MarkMap', () => {
    let markMap;
    
    beforeEach(() => {
        markMap = new MarkMap({});
    });

    it('should transform markdown to HTML and SVG', async () => {
        const message = {
            filepath: '/test/example.md',
            content: '# Test Heading\n## Subheading\n* Item 1\n* Item 2'
        };

        let htmlMessage, svgMessage;

        markMap.on('message', (msg) => {
            if (msg.filepath.endsWith('.mm.html')) {
                htmlMessage = msg;
            } else if (msg.filepath.endsWith('.mm.svg')) {
                svgMessage = msg;
            }
        });

        await markMap.process(message);

        expect(htmlMessage).to.exist;
        expect(htmlMessage.content).to.include('<html');
        expect(htmlMessage.content).to.include('Test Heading');
        expect(htmlMessage.filepath).to.equal('/test/example.mm.html');

        expect(svgMessage).to.exist;
        expect(svgMessage.content).to.include('<svg');
        expect(svgMessage.content).to.include('Test Heading');
        expect(svgMessage.filepath).to.equal('/test/example.mm.svg');
    });

    it('should handle empty content', async () => {
        const message = {
            filepath: '/test/empty.md',
            content: ''
        };

        try {
            await markMap.process(message);
            expect.fail('Should have thrown error');
        } catch (error) {
            expect(error.message).to.equal('No content provided in message');
        }
    });
});
