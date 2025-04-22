import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import Processor from '../../src/model/Processor.js'
import ProcessorImpl from '../../src/engine/ProcessorImpl.js'
import SysUtils from '../../src/utils/SysUtils.js'
import ns from '../../src/utils/ns.js'
import logger from '../../src/utils/Logger.js'

describe('Processor', () => {
    let processor
    let mockConfigDataset
    let mockProcessor
    
    beforeEach(() => {
        // Create a test dataset
        mockConfigDataset = rdf.dataset()
        
        // Create a processor instance
        processor = new Processor(mockConfigDataset)
        
        // Spy on the processor methods
        spyOn(processor, 'emit').and.callThrough()
        
        // Spy on logger methods
        spyOn(logger, 'debug').and.callThrough()
        spyOn(logger, 'trace').and.callThrough()
        spyOn(logger, 'log').and.callThrough()
    })
    
    describe('#constructor', () => {
        it('should initialize correctly with a config dataset', () => {
            expect(processor.configDataset).toBe(mockConfigDataset)
            expect(processor.messageQueue).toEqual([])
            expect(processor.processing).toBe(false)
            expect(processor.outputs).toEqual([])
        })
        
        it('should extend ProcessorImpl', () => {
            expect(processor instanceof ProcessorImpl).toBe(true)
        })
    })
    
    describe('#process', () => {
        it('should delegate to the parent class method', async () => {
            // Spy on the parent class method
            spyOn(ProcessorImpl.prototype, 'process').and.resolveTo({})
            
            const message = { test: 'test message' }
            await processor.process(message)
            
            expect(ProcessorImpl.prototype.process).toHaveBeenCalledWith(message)
        })
    })
    
    describe('#getValues and #getProperty', () => {
        it('should delegate to the parent class methods', () => {
            // Spy on the parent class methods
            spyOn(ProcessorImpl.prototype, 'getValues').and.returnValue(['value'])
            spyOn(ProcessorImpl.prototype, 'getProperty').and.returnValue('value')
            
            const property = ns.trn.testProperty
            const fallback = 'fallback'
            
            const valuesResult = processor.getValues(property, fallback)
            const propertyResult = processor.getProperty(property, fallback)
            
            expect(ProcessorImpl.prototype.getValues).toHaveBeenCalledWith(property, fallback)
            expect(ProcessorImpl.prototype.getProperty).toHaveBeenCalledWith(property, fallback)
            expect(valuesResult).toEqual(['value'])
            expect(propertyResult).toBe('value')
        })
    })
    
    describe('#preProcess', () => {
        it('should configure processor with app settings', async () => {
            // Setup message with app
            const mockApp = { 
                dataset: rdf.dataset()
            }
            const message = { 
                app: mockApp,
                tags: 'test-tags'
            }
            
            // Additional spy
            spyOn(processor, 'getProperty')
            
            await processor.preProcess(message)
            
            expect(processor.app).toBe(mockApp)
            expect(processor.message).toBe(message)
        })
        
        it('should set log level from settings if available', async () => {
            // Setup message and settings
            const message = { app: {} }
            
            // Mock getProperty to return a log level
            spyOn(processor, 'getProperty').and.callFake((property) => {
                if (property.equals(ns.trn.loglevel)) {
                    return 'debug'
                }
                return undefined
            })
            
            // Spy on logger.setLogLevel
            spyOn(logger, 'setLogLevel')
            spyOn(logger, 'getLevel').and.returnValue('info')
            
            await processor.preProcess(message)
            
            expect(logger.setLogLevel).toHaveBeenCalledWith('debug')
        })
        
        it('should call onProcess hook if provided in message', async () => {
            // Setup message with onProcess hook
            const onProcessSpy = jasmine.createSpy('onProcess')
            const message = { 
                app: {},
                onProcess: onProcessSpy
            }
            
            await processor.preProcess(message)
            
            expect(onProcessSpy).toHaveBeenCalledWith(processor, message)
        })
    })
    
    describe('#postProcess', () => {
        it('should restore previous log level', async () => {
            // Setup processor with previousLogLevel
            processor.previousLogLevel = 'info'
            
            // Spy on logger.setLogLevel
            spyOn(logger, 'setLogLevel')
            
            await processor.postProcess({})
            
            expect(logger.setLogLevel).toHaveBeenCalledWith('info')
            expect(processor.previousLogLevel).toBeNull()
        })
    })
    
    describe('#receive', () => {
        it('should enqueue the message for processing', async () => {
            // Spy on enqueue method
            spyOn(processor, 'enqueue').and.resolveTo()
            
            const message = { test: 'test message' }
            await processor.receive(message)
            
            expect(processor.enqueue).toHaveBeenCalledWith(message)
        })
    })
    
    describe('#enqueue', () => {
        it('should add message to queue and start processing if not already processing', async () => {
            // Spy on executeQueue method
            spyOn(processor, 'executeQueue').and.resolveTo()
            
            const message = { test: 'test message' }
            await processor.enqueue(message)
            
            expect(processor.messageQueue).toEqual([{ message }])
            expect(processor.executeQueue).toHaveBeenCalled()
        })
        
        it('should just add message to queue if already processing', async () => {
            // Set processing flag
            processor.processing = true
            
            // Spy on executeQueue method
            spyOn(processor, 'executeQueue').and.resolveTo()
            
            const message = { test: 'test message' }
            await processor.enqueue(message)
            
            expect(processor.messageQueue).toEqual([{ message }])
            expect(processor.executeQueue).not.toHaveBeenCalled()
        })
    })
    
    describe('#executeQueue', () => {
        beforeEach(() => {
            // Spy on core methods
            spyOn(processor, 'preProcess').and.resolveTo()
            spyOn(processor, 'process').and.resolveTo({ processed: true })
            spyOn(processor, 'postProcess').and.resolveTo()
            spyOn(SysUtils, 'copyMessage').and.callFake(msg => ({ ...msg, copied: true }))
        })
        
        it('should process all messages in the queue', async () => {
            // Add messages to queue
            processor.messageQueue = [
                { message: { id: 1 } },
                { message: { id: 2 } }
            ]
            
            await processor.executeQueue()
            
            expect(processor.preProcess).toHaveBeenCalledTimes(2)
            expect(processor.process).toHaveBeenCalledTimes(2)
            expect(processor.postProcess).toHaveBeenCalledTimes(2)
            expect(processor.messageQueue).toEqual([])
            expect(processor.processing).toBe(false)
        })
        
        it('should copy messages before processing', async () => {
            // Add a message to queue
            processor.messageQueue = [
                { message: { id: 1 } }
            ]
            
            await processor.executeQueue()
            
            expect(SysUtils.copyMessage).toHaveBeenCalled()
            // The message passed to preProcess should be a copy
            expect(processor.preProcess.calls.argsFor(0)[0].copied).toBe(true)
        })
        
        it('should add tags to messages', async () => {
            // Add a message to queue
            processor.messageQueue = [
                { message: { id: 1 } }
            ]
            
            // Mock getTag
            spyOn(processor, 'getTag').and.returnValue('TestProcessor')
            
            await processor.executeQueue()
            
            // Adding tags happens before copying, so check the args to copyMessage
            expect(SysUtils.copyMessage.calls.argsFor(0)[0].tags).toBe('TestProcessor')
        })
        
        it('should handle messages with existing tags', async () => {
            // Add a message to queue with existing tags
            processor.messageQueue = [
                { message: { id: 1, tags: 'ExistingTag' } }
            ]
            
            // Mock getTag
            spyOn(processor, 'getTag').and.returnValue('TestProcessor')
            
            await processor.executeQueue()
            
            // Tags should be appended
            expect(SysUtils.copyMessage.calls.argsFor(0)[0].tags).toBe('ExistingTag.TestProcessor')
        })
    })
    
    describe('#addTag', () => {
        it('should add a tag to a message without tags', () => {
            const message = {}
            
            // Mock getTag
            spyOn(processor, 'getTag').and.returnValue('TestProcessor')
            
            processor.addTag(message)
            
            expect(message.tags).toBe('TestProcessor')
        })
        
        it('should append a tag to a message with existing tags', () => {
            const message = { tags: 'ExistingTag' }
            
            // Mock getTag
            spyOn(processor, 'getTag').and.returnValue('TestProcessor')
            
            processor.addTag(message)
            
            expect(message.tags).toBe('ExistingTag.TestProcessor')
        })
    })
    
    describe('#getTag', () => {
        it('should return the short name of the processor ID', () => {
            processor.id = 'http://example.org/processors/TestProcessor'
            
            const result = processor.getTag()
            
            expect(result).toBe('TestProcessor')
        })
    })
    
    describe('#emit', () => {
        it('should emit an event asynchronously', async () => {
            const event = 'test-event'
            const message = { test: 'test-message' }
            
            // Call emit directly
            const result = await processor.emit(event, message)
            
            // Should have called the parent emit
            expect(ProcessorImpl.prototype.emit).toHaveBeenCalledWith(event, message)
            
            // Should have returned the message
            expect(result).toBe(message)
        })
    })
    
    describe('#getOutputs', () => {
        it('should return and clear the outputs array', () => {
            // Set some outputs
            processor.outputs = [1, 2, 3]
            
            const result = processor.getOutputs()
            
            expect(result).toEqual([1, 2, 3])
            expect(processor.outputs).toEqual([])
        })
    })
    
    describe('#toString', () => {
        it('should return a string representation of the processor', () => {
            processor.id = 'http://example.org/processors/TestProcessor'
            processor.type = ns.trn.TestProcessor
            
            const result = processor.toString()
            
            expect(typeof result).toBe('string')
            expect(result).toContain('TestProcessor')
            expect(result).toContain('http://example.org/processors/TestProcessor')
        })
    })
})
