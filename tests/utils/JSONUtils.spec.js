// tests/utils/JSONUtils.spec.js
import { describe, it, expect, beforeEach } from 'vitest'
import JSONUtils from '../../src/utils/JSONUtils.js'

describe('JSONUtils', () => {
    let testObj

    beforeEach(() => {
        testObj = {
            simple: 'value',
            nested: {
                deep: {
                    value: 42
                }
            },
            array: [1, 2, 3],
            mixed: {
                array: [
                    { id: 1, name: 'first' },
                    { id: 2, name: 'second' }
                ]
            }
        }
    })

    describe('set', () => {
        it('should set simple property', () => {
            JSONUtils.set(testObj, 'simple', 'new value')
            expect(testObj.simple).toBe('new value')
        })

        it('should set nested property', () => {
            JSONUtils.set(testObj, 'nested.deep.value', 100)
            expect(testObj.nested.deep.value).toBe(100)
        })

        it('should create new nested path when it does not exist', () => {
            JSONUtils.set(testObj, 'this.is.path', 'yes')
            expect(testObj.this.is.path).toBe('yes')
        })

        it('should create deeply nested path', () => {
            JSONUtils.set(testObj, 'very.deep.nested.path.value', 'deep value')
            expect(testObj.very.deep.nested.path.value).toBe('deep value')
        })

        it('should set array element', () => {
            JSONUtils.set(testObj, 'array[1]', 99)
            expect(testObj.array[1]).toBe(99)
        })

        it('should set nested object property in array', () => {
            JSONUtils.set(testObj, 'mixed.array[0].name', 'updated')
            expect(testObj.mixed.array[0].name).toBe('updated')
        })

        it('should handle null and undefined values', () => {
            JSONUtils.set(testObj, 'nullValue', null)
            JSONUtils.set(testObj, 'undefinedValue', undefined)
            expect(testObj.nullValue).toBe(null)
            expect(testObj.undefinedValue).toBe(undefined)
        })

        it('should handle boolean values', () => {
            JSONUtils.set(testObj, 'boolTrue', true)
            JSONUtils.set(testObj, 'boolFalse', false)
            expect(testObj.boolTrue).toBe(true)
            expect(testObj.boolFalse).toBe(false)
        })

        it('should handle number values', () => {
            JSONUtils.set(testObj, 'zero', 0)
            JSONUtils.set(testObj, 'negative', -42)
            JSONUtils.set(testObj, 'float', 3.14)
            expect(testObj.zero).toBe(0)
            expect(testObj.negative).toBe(-42)
            expect(testObj.float).toBe(3.14)
        })

        it('should return the modified object', () => {
            const result = JSONUtils.set(testObj, 'newProp', 'value')
            expect(result).toBe(testObj)
            expect(result.newProp).toBe('value')
        })
    })

    describe('get', () => {
        it('should get simple property', () => {
            expect(JSONUtils.get(testObj, 'simple')).toBe('value')
        })

        it('should get nested property', () => {
            expect(JSONUtils.get(testObj, 'nested.deep.value')).toBe(42)
        })

        it('should get array element', () => {
            expect(JSONUtils.get(testObj, 'array[1]')).toBe(2)
        })

        it('should get nested object property in array', () => {
            expect(JSONUtils.get(testObj, 'mixed.array[0].name')).toBe('first')
        })

        it('should return undefined for non-existent paths', () => {
            expect(JSONUtils.get(testObj, 'nonexistent')).toBe(undefined)
            expect(JSONUtils.get(testObj, 'nested.nonexistent')).toBe(undefined)
            expect(JSONUtils.get(testObj, 'array[10]')).toBe(undefined)
        })
    })

    describe('remove', () => {
        it('should remove simple property', () => {
            JSONUtils.remove(testObj, 'simple')
            expect(testObj.simple).toBe(null)
        })

        it('should remove nested property', () => {
            JSONUtils.remove(testObj, 'nested.deep.value')
            expect(testObj.nested.deep.value).toBe(undefined)
            expect('value' in testObj.nested.deep).toBe(false)
        })

        it('should remove array element', () => {
            const originalLength = testObj.array.length
            JSONUtils.remove(testObj, 'array[1]')
            expect(testObj.array.length).toBe(originalLength - 1)
            expect(testObj.array).toEqual([1, 3])
        })
    })

    describe('integration tests', () => {
        it('should handle complex set and get operations', () => {
            // Create nested structure
            JSONUtils.set(testObj, 'complex.nested.array[0].deep.value', 'success')
            
            // Verify it was set correctly
            expect(JSONUtils.get(testObj, 'complex.nested.array[0].deep.value')).toBe('success')
            
            // Verify structure exists
            expect(testObj.complex).toBeDefined()
            expect(testObj.complex.nested).toBeDefined()
            expect(Array.isArray(testObj.complex.nested.array)).toBe(true)
            expect(testObj.complex.nested.array[0]).toBeDefined()
            expect(testObj.complex.nested.array[0].deep).toBeDefined()
        })

        it('should handle the original example case', () => {
            const message = {}
            JSONUtils.set(message, "this.is.path", "yes")
            expect(JSONUtils.get(message, "this.is.path")).toBe("yes")
            expect(message.this.is.path).toBe("yes")
        })
    })
})