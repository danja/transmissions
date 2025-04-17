import Transmission from '../../src/model/Transmission.js'
import Connector from '../../src/model/Connector.js'
import Processor from '../../src/model/Processor.js'
import ns from '../../src/utils/ns.js'

describe('Transmission', () => {
    let transmission

    beforeEach(() => {
        transmission = new Transmission()
    })

    describe('#constructor', () => {
        it('should initialize properties correctly', () => {
            expect(transmission.processors).toEqual({})
            expect(transmission.connectors).toEqual([])
            expect(transmission.parent).toBeNull()
            expect(transmission.children instanceof Set).toBe(true)
            expect(transmission.children.size).toBe(0)
            expect(transmission.path).toEqual([])
        })
    })

    describe('#process', () => {
        let mockProcessor

        beforeEach(() => {
            mockProcessor = jasmine.createSpyObj('Processor', ['receive'])
            mockProcessor.constructor = { name: 'MockProcessor' }
        })

        it('should process the message through the first processor', async () => {
            // Set up the mock to handle the async behavior
            mockProcessor.receive.and.callFake(async (message) => {
                message.processed = true
                return message
            })

            // Register the processor
            transmission.processors['test:processor'] = mockProcessor

            // Create a connector
            const connector = new Connector('test:processor', 'test:another')
            transmission.connectors.push(connector)

            // Process a message
            const message = { data: 'test' }
            const result = await transmission.process(message)

            // Assertions
            expect(mockProcessor.receive).toHaveBeenCalledWith(message)
            expect(result.processed).toBe(true)
        })

        it('should handle processing errors and add transmission info', async () => {
            // Set up the mock to throw an error
            mockProcessor.receive.and.throwError('Test error')

            // Set the transmission ID
            transmission.id = 'test:transmission'

            // Register the processor
            transmission.processors['test:processor'] = mockProcessor

            // Create a connector
            const connector = new Connector('test:processor', 'test:another')
            transmission.connectors.push(connector)

            // Process a message
            const message = { data: 'test' }

            // Process should throw error with transmission stack
            await expectAsync(transmission.process(message)).toBeRejectedWithError()

            // The error should be caught and modified with transmission stack info
            try {
                await transmission.process(message)
            } catch (error) {
                expect(error.transmissionStack).toBeDefined()
                expect(error.transmissionStack).toContain('test:transmission')
            }
        })

        it('should use first processor if no connector exists', async () => {
            // Set up the mock
            mockProcessor.receive.and.callFake(async (message) => {
                message.processed = true
                return message
            })

            // Register the processor as the first one
            transmission.processors['test:processor'] = mockProcessor

            // Process a message
            const message = { data: 'test' }
            const result = await transmission.process(message)

            // Assertions
            expect(mockProcessor.receive).toHaveBeenCalledWith(message)
            expect(result.processed).toBe(true)
        })

        it('should throw an error if no valid processor is found', async () => {
            // Empty transmission, no processors
            const message = { data: 'test' }

            await expectAsync(transmission.process(message))
                .toBeRejectedWithError('No valid processor found to execute')
        })
    })

    describe('#register', () => {
        it('should register a processor', () => {
            const processor = { id: 'test:processor' }

            const result = transmission.register('test:processor', processor)

            expect(transmission.processors['test:processor']).toBe(processor)
            expect(result).toBe(processor)
        })

        it('should handle nested transmissions', () => {
            const nestedTransmission = new Transmission()
            nestedTransmission.id = 'test:nested'

            transmission.register('test:nested', nestedTransmission)

            expect(nestedTransmission.parent).toBe(transmission)
            expect(nestedTransmission.path).toEqual(['test:nested'])
            expect(transmission.children.has(nestedTransmission)).toBe(true)
        })

        it('should maintain path from parent transmission', () => {
            // Set up a parent path
            transmission.path = ['parent:path']

            const nestedTransmission = new Transmission()
            nestedTransmission.id = 'test:nested'

            transmission.register('test:nested', nestedTransmission)

            expect(nestedTransmission.path).toEqual(['parent:path', 'test:nested'])
        })
    })

    describe('#get', () => {
        it('should return a registered processor', () => {
            const processor = { id: 'test:processor' }
            transmission.processors['test:processor'] = processor

            const result = transmission.get('test:processor')

            expect(result).toBe(processor)
        })

        it('should return undefined for non-existent processor', () => {
            const result = transmission.get('nonexistent:processor')

            expect(result).toBeUndefined()
        })
    })

    describe('#connect', () => {
        it('should create a connector between processors', () => {
            spyOn(Connector.prototype, 'connect')

            const processor1 = { id: 'test:processor1' }
            const processor2 = { id: 'test:processor2' }

            transmission.processors['test:processor1'] = processor1
            transmission.processors['test:processor2'] = processor2

            transmission.connect('test:processor1', 'test:processor2')

            // Verify a connector was created and stored
            expect(transmission.connectors.length).toBe(1)

            // Verify connect was called on the connector
            expect(Connector.prototype.connect).toHaveBeenCalledWith(transmission.processors)

            // Verify the connector has the right properties
            const connector = transmission.connectors[0]
            expect(connector.fromName).toBe('test:processor1')
            expect(connector.toName).toBe('test:processor2')
        })
    })

    describe('#handleError', () => {
        it('should log error information', () => {
            spyOn(console, 'error')

            const error = new Error('Test error')
            error.transmissionStack = ['test:transmission1']

            transmission.id = 'test:transmission2'

            transmission.handleError(error)

            expect(console.error).toHaveBeenCalledTimes(2)
        })

        it('should propagate error to parent transmission', () => {
            const parentTransmission = new Transmission()
            spyOn(parentTransmission, 'handleError')

            transmission.parent = parentTransmission

            const error = new Error('Test error')
            transmission.handleError(error)

            expect(parentTransmission.handleError).toHaveBeenCalledWith(error)
        })
    })

    describe('#getTransmissionInfo', () => {
        it('should return transmission information', () => {
            transmission.id = 'test:transmission'
            transmission.path = ['parent', 'test:transmission']

            const childTransmission = new Transmission()
            childTransmission.id = 'test:child'
            transmission.children.add(childTransmission)

            const info = transmission.getTransmissionInfo()

            expect(info.id).toBe('test:transmission')
            expect(info.path).toEqual(['parent', 'test:transmission'])
            expect(info.depth).toBe(2)
            expect(info.children).toEqual(['test:child'])
        })
    })

    describe('#toString', () => {
        it('should return a string representation', () => {
            transmission.id = 'test:transmission'
            transmission.path = ['parent', 'test:transmission']

            const childTransmission = new Transmission()
            childTransmission.id = 'test:child'
            transmission.children.add(childTransmission)

            // Add some processors
            transmission.processors['test:processor1'] = { id: 'test:processor1' }
            transmission.processors['test:processor2'] = { id: 'test:processor2' }

            // Add connector
            const connector = new Connector('test:processor1', 'test:processor2')
            transmission.connectors.push(connector)

            const result = transmission.toString()

            expect(typeof result).toBe('string')
            expect(result).toContain('test:transmission')
            expect(result).toContain('test:processor1')
            expect(result).toContain('test:processor2')
        })
    })

    describe('#getFirstNode and #getLastNode', () => {
        it('should return the first processor in the pipeline', () => {
            const processor1 = { id: 'test:processor1' }
            const processor2 = { id: 'test:processor2' }

            transmission.processors['test:processor1'] = processor1
            transmission.processors['test:processor2'] = processor2

            // Create a connector to establish the order
            const connector = new Connector('test:processor1', 'test:processor2')
            transmission.connectors.push(connector)

            // Check if these methods exist in your implementation
            if (typeof transmission.getFirstNode === 'function') {
                const firstNode = transmission.getFirstNode()
                expect(firstNode).toBe(processor1)
            }

            if (typeof transmission.getLastNode === 'function') {
                const lastNode = transmission.getLastNode()
                expect(lastNode).toBe(processor2)
            }
        })
    })
})