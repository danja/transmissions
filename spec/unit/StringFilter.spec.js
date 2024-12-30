// tests/unit/StringFilter.spec.js

/**
 * This test file covers various scenarios for the StringFilter processor, including:
 *
 * empty include and exclude patterns
 * undefined content
 * include patterns separately
 * include patterns separately
 * combinations of include and exclude patterns
 *
 * The tests use a variety of filesystem paths and glob-like patterns to ensure comprehensive coverage of the StringFilter's functionality.
 * 
 * Run in isolation with :
 * `npm test -- tests/unit/StringFilter.spec.js`
 */

import StringFilter from '../../src/processors/text/StringFilter.js';
import { expect } from 'chai';

describe('StringFilter', function () {
    // Helper function to create test messages
    function compose(content, include, exclude) {
        return { content, include, exclude };
    }

    // Sample data
    const contentSamples = [
        '/home/user/documents/',
        '/home/user/documents/file.txt',
        '/var/log/',
        '/etc/config.conf',
        '/usr/local/bin/app',
        '/home/user/pictures/vacation/',
        '/home/user/pictures/vacation/photo.jpg',
        '/opt/',
        '/tmp/temp.file',
        '/home/user/.config/',
        '',
        undefined
    ];

    const patternSamples = [
        '*.txt',
        '*.jpg',
        '/home/user/*',
        '/var/*',
        '*/bin/*',
        ['*.txt', '*.jpg'],
        ['/home/user/*', '/var/*'],
        ['*/bin/*', '*.conf'],
        ['*.file', '/tmp/*'],
        ['/opt/*', '/etc/*'],
        '',
        [],
        undefined
    ];

    describe('isAccepted()', function () {
        it('should accept all content when include and exclude are empty', function () {
            const filter = new StringFilter();
            contentSamples.forEach(content => {
                if (content !== undefined) {
                    const message = compose(content, '', '');
                    expect(filter.isAccepted(message.content, message.exclude, message.include)).to.be.true;
                }
            });
        });

        it('should reject undefined content', function () {
            const filter = new StringFilter();
            const message = compose(undefined, '', '');
            expect(filter.isAccepted(message.content, message.exclude, message.include)).to.be.false;
        });

        it('should correctly apply include patterns', function () {
            const filter = new StringFilter();
            const includeTests = [
                { content: '/home/user/documents/file.txt', include: '*.txt', expected: true },
                { content: '/home/user/pictures/vacation/photo.jpg', include: '*.jpg', expected: true },
                { content: '/var/log/', include: '/var/*', expected: true },
                { content: '/home/user/documents/', include: '/home/user/*', expected: true },
                { content: '/usr/local/bin/app', include: '*/bin/*', expected: true },
                { content: '/etc/config.conf', include: ['*.conf', '*.txt'], expected: true },
                { content: '/opt/', include: ['/var/*', '/opt/*'], expected: true },
                { content: '/tmp/temp.file', include: '*.doc', expected: false }
            ];

            includeTests.forEach(test => {
                const message = compose(test.content, test.include, '');
                expect(filter.isAccepted(message.content, message.exclude, message.include)).to.equal(test.expected);
            });
        });

        it('should correctly apply exclude patterns', function () {
            const filter = new StringFilter();
            const excludeTests = [
                { content: '/home/user/documents/file.txt', exclude: '*.txt', expected: false },
                { content: '/home/user/pictures/vacation/photo.jpg', exclude: '*.jpg', expected: false },
                { content: '/var/log/', exclude: '/var/*', expected: false },
                { content: '/home/user/documents/', exclude: '/home/user/*', expected: false },
                { content: '/usr/local/bin/app', exclude: '*/bin/*', expected: false },
                { content: '/etc/config.conf', exclude: ['*.conf', '*.txt'], expected: false },
                { content: '/opt/', exclude: ['/var/*', '/tmp/*'], expected: true },
                { content: '/tmp/temp.file', exclude: '*.doc', expected: true }
            ];

            excludeTests.forEach(test => {
                const message = compose(test.content, '', test.exclude);
                expect(filter.isAccepted(message.content, message.exclude, message.include)).to.equal(test.expected);
            });
        });

        it('should correctly apply both include and exclude patterns', function () {
            const filter = new StringFilter();
            const combinedTests = [
                { content: '/home/user/documents/file.txt', include: '*.txt', exclude: '/var/*', expected: true },
                { content: '/var/log/system.log', include: '*.log', exclude: '/var/*', expected: false },
                { content: '/home/user/pictures/vacation/photo.jpg', include: ['/home/user/*', '*.jpg'], exclude: '*.png', expected: true },
                { content: '/etc/config.conf', include: ['*.conf', '*.txt'], exclude: ['/home/*', '/var/*'], expected: true },
                { content: '/usr/local/bin/app', include: '*/bin/*', exclude: '*/local/*', expected: false }
            ];

            combinedTests.forEach(test => {
                const message = compose(test.content, test.include, test.exclude);
                expect(filter.isAccepted(message.content, message.exclude, message.include)).to.equal(test.expected);
            });
        });
    });
});