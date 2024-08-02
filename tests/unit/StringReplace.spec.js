// tests/unit/StringReplace.spec.js

import StringReplace from '../../src/services/text/StringReplace.js'
import { expect } from 'chai'

/**
 * Unit tests for the StringReplace service
 */
describe('StringReplace', function () {
    /**
     * Test case for the execute method of StringReplace
     */
    it('execute() should replace all occurrences of the match string with the replace string', function () {
        // Arrange
        const stringReplace = new StringReplace()
        const message = {
            content: 'Hello world! Hello universe!',
            match: 'Hello',
            replace: 'Hi'
        }

        // Act
        stringReplace.execute(message)

        // Assert
        const expectedOutput = 'Hi world! Hi universe!'
        expect(message.content).to.equal(expectedOutput)
    })

    /**
     * Test case for when the match string is not found in the content
     */
    it('execute() should not modify the content if the match string is not found', function () {
        // Arrange
        const stringReplace = new StringReplace()
        const message = {
            content: 'Hello world!',
            match: 'Goodbye',
            replace: 'Hi'
        }

        // Act
        stringReplace.execute(message)

        // Assert
        const expectedOutput = 'Hello world!'
        expect(message.content).to.equal(expectedOutput)
    })

    /**
     * Test case for when the content is an empty string
     */
    it('execute() should handle empty content string', function () {
        // Arrange
        const stringReplace = new StringReplace()
        const message = {
            content: '',
            match: 'Hello',
            replace: 'Hi'
        }

        // Act
        stringReplace.execute(message)

        // Assert
        const expectedOutput = ''
        expect(message.content).to.equal(expectedOutput)
    })
})