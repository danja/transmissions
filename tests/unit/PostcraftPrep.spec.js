import PostcraftPrep from '../../src/services/postcraft/PostcraftPrep.js'
import { expect } from 'chai'

describe('PostcraftPrep', function () {
    beforeEach(function () {
        this.context = {
            content: 'only text',
            filename: 'minimal-filename.md'
        }
    })

    it('extractTitle(context) should lift the title from the filename', function () {
        this.context.filename = '2024-05-10_this-thing.md'
        const input = this.context
        const expectedOutput = 'This Thing'
        const pp = new PostcraftPrep()
        const output = pp.extractTitle(input)
        expect(output).to.equal(expectedOutput)
    })

    it('extractSlug(context) should return filename without path and extension', function () {
        this.context.filename = '2024-05-10_hello-postcraft.md'
        const input = this.context
        const expectedOutput = '2024-05-10_hello-postcraft'
        const pp = new PostcraftPrep()
        const output = pp.extractSlug(input)
        expect(output).to.equal(expectedOutput)
    })

    it('extractTargetFilename(context) should return the correct target filename', function () {
        this.context.filename = '2024-05-10_hello-postcraft.md'
        this.context.rootDir = '/root'
        this.context.entryContentMeta = {
            targetDir: 'target'  // Remove the leading slash
        }
        const input = this.context
        const expectedOutput = '/root/target/2024-05-10_hello-postcraft.html'
        const pp = new PostcraftPrep()
        const output = pp.extractTargetFilename(input)
        expect(output).to.equal(expectedOutput)
    })

    it('extractDates(context) should return the correct dates', function () {
        this.context.filename = '2024-05-10_hello-postcraft.md'
        const input = this.context
        const expectedOutput = { created: '2024-05-10', updated: (new Date()).toISOString().split('T')[0] }
        const pp = new PostcraftPrep()
        const output = pp.extractDates(input)
        expect(output).to.deep.equal(expectedOutput)
    })
})