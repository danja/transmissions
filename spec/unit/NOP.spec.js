import NOP from '../../src/processors/util/NOP.js'
import { expect } from 'chai'

describe('NOP', function () {
    it('double() should return the input string concatenated with itself', function () {
        const nop = new NOP()
        const input = 'test'
        const expectedOutput = 'testtest'
        const output = nop.double(input)
        expect(output).to.equal(expectedOutput)
    })
})