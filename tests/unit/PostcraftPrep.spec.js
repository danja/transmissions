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

    it('extractName(context) should return filename without path and extension', function () {
        this.context.filename = '2024-05-10_hello-postcraft.md'
        const input = this.context
        const expectedOutput = '2024-05-10_hello-postcraft.html'

        const pp = new PostcraftPrep()
        const output = pp.extractName(input)
        expect(output).to.equal(expectedOutput)
    })

    it('extractTargetFilename(context) should return the correct target filename', function () {
        this.context.filename = '2024-05-10_hello-postcraft.md'
        this.context.rootDir = '/root'
        this.context.targetDir = '/target'
        const input = this.context
        const expectedOutput = '/root/target/2024-05-10_hello-postcraft.html'

        const pp = new PostcraftPrep()
        const output = pp.extractTargetFilename(input)
        expect(output).to.equal(expectedOutput)
    })

    it('extractLink(context) should return the correct link', function () {
        this.context.filename = '2024-05-10_hello-postcraft.md'
        this.context.targetDir = 'target'
        const input = this.context
        const expectedOutput = '/target/2024-05-10_hello-postcraft.html'

        const pp = new PostcraftPrep()
        const output = pp.extractLink(input)
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