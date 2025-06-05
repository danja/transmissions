// tests/unit/engine/ProcessorImpl.spec.js
import { EventEmitter } from 'events'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import ProcessorImpl from '../../../src/engine/ProcessorImpl.js'
import ProcessorSettings from '../../../src/engine/ProcessorSettings.js'
import logger from '../../../src/utils/Logger.js'
import * as nsModule from '../../../src/utils/ns.js'
import SysUtils from '../../../src/utils/SysUtils.js'

// Mock dependencies
vi.mock('../../../src/utils/Logger.js')
vi.mock('../../../src/utils/ns.js', () => ({
  default: {
    rdf: { value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' },
    rdfs: { value: 'http://www.w3.org/2000/01/rdf-schema#' },
    dc: { value: 'http://purl.org/dc/terms/' },
    schema: { value: 'http://schema.org/' },
    xsd: { value: 'http://www.w3.org/2001/XMLSchema#' },
    trn: { value: 'http://purl.org/stuff/transmissions/' },
    getShortname: vi.fn((prop) => {
      if (!prop) return undefined;
      const str = typeof prop === 'string' ? prop : prop.value || '';
      return str.split('/').pop().split('#').pop() || str;
    }),
    shortName: vi.fn((prop) => {
      if (!prop) return undefined;
      const str = typeof prop === 'string' ? prop : prop.value || '';
      return str.split('/').pop().split('#').pop() || str;
    })
  }
}))
vi.mock('../../../src/utils/SysUtils.js')
vi.mock('../../../src/engine/ProcessorSettings.js')

// Import the mocked ns after setting up the mock
import ns from '../../../src/utils/ns.js'

describe('ProcessorImpl', () => {
  let processor
  let mockApp
  let mockSettee

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Mock app
    mockApp = {
      workingDir: '/test/path',
      simpleConfig: { testProp: 'appValue' },
      workerPool: null
    }

    // Mock ProcessorSettings
    mockSettee = {
      getValues: vi.fn(() => [])
    }

    // ns module is now mocked at the module level

    // Mock logger methods
    logger.getLevel = vi.fn(() => 'info')
    logger.setLogLevel = vi.fn()
    logger.debug = vi.fn()
    logger.trace = vi.fn()

    // Mock SysUtils
    SysUtils.copyMessage = vi.fn((msg) => ({ ...msg }))

    // Mock ProcessorSettings constructor
    ProcessorSettings.mockImplementation(() => mockSettee)

    processor = new ProcessorImpl(mockApp)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with app and default values', () => {
      expect(processor.app).toBe(mockApp)
      expect(processor.settingsNode).toBeNull()
      expect(processor.messageQueue).toEqual([])
      expect(processor.processing).toBe(false)
      expect(processor.noProcessWhenDone).toBe(false)
      expect(processor.outputs).toEqual([])
      expect(processor.workerPool).toBeNull()
    })

    it('should create ProcessorSettings instance', () => {
      expect(ProcessorSettings).toHaveBeenCalledWith(mockApp)
      expect(processor.settee).toBe(mockSettee)
    })
  })

  describe('getValues', () => {
    it('should delegate to settee.getValues with settingsNode', () => {
      const property = { value: 'testProp' }
      const fallback = 'fallbackValue'
      processor.settingsNode = { value: 'settingsNode' }

      processor.getValues(property, fallback)

      expect(mockSettee.getValues).toHaveBeenCalledWith(
        processor.settingsNode,
        property,
        fallback
      )
    })
  })

  describe('getProperty', () => {
    const property = { value: 'http://example.org/testProp' }

    beforeEach(() => {
      ns.getShortname.mockReturnValue('testProp')
    })

    it('should return value from message if present', () => {
      processor.message = { testProp: 'messageValue' }

      const result = processor.getProperty(property, 'fallback')

      expect(result).toBe('messageValue')
    })

    it('should return value from simpleConfig if not in message', () => {
      processor.message = {}
      mockApp.simpleConfig = { testProp: 'configValue' }

      const result = processor.getProperty(property, 'fallback')

      expect(result).toBe('configValue')
    })

    it('should delegate to settee if not in message or simpleConfig', () => {
      processor.message = {}
      mockApp.simpleConfig = {}
      mockSettee.getValues.mockReturnValue(['settingsValue'])

      const result = processor.getProperty(property, 'fallback')

      expect(result).toBe('settingsValue')
      expect(mockSettee.getValues).toHaveBeenCalledWith(
        processor.settingsNode,
        property,
        'fallback'
      )
    })

    it('should return array if multiple values from settings', () => {
      processor.message = {}
      mockApp.simpleConfig = {}
      mockSettee.getValues.mockReturnValue(['value1', 'value2'])

      const result = processor.getProperty(property, 'fallback')

      expect(result).toEqual(['value1', 'value2'])
    })

    it('should return fallback if no values found', () => {
      processor.message = {}
      mockApp.simpleConfig = {}
      mockSettee.getValues.mockReturnValue([])

      const result = processor.getProperty(property, 'fallback')

      expect(result).toBe('fallback')
    })
  })

  describe('propertyInObject', () => {
    beforeEach(() => {
      ns.getShortname.mockReturnValue('testProp')
    })

    it('should find property in object using short name', () => {
      const obj = { testProp: 'foundValue' }
      const property = { value: 'http://example.org/testProp' }

      const result = processor.propertyInObject(obj, property)

      expect(result).toBe('foundValue')
    })

    it('should return undefined if property not found', () => {
      const obj = { otherProp: 'value' }
      const property = { value: 'http://example.org/testProp' }

      const result = processor.propertyInObject(obj, property)

      expect(result).toBeUndefined()
    })

    it('should return undefined if object is null', () => {
      const property = { value: 'http://example.org/testProp' }

      const result = processor.propertyInObject(null, property)

      expect(result).toBeUndefined()
    })
  })

  describe('preProcess', () => {
    let mockMessage

    beforeEach(() => {
      mockMessage = { testData: 'value' }
      processor.getProperty = vi.fn()
    })

    it('should set message and call onProcess if present', async () => {
      const onProcess = vi.fn()
      mockMessage.onProcess = onProcess

      await processor.preProcess(mockMessage)

      expect(processor.message).toBe(mockMessage)
      expect(onProcess).toHaveBeenCalledWith(processor, mockMessage)
    })

    it('should set log level if specified in properties', async () => {
      processor.getProperty.mockReturnValue('debug')

      await processor.preProcess(mockMessage)

      expect(logger.setLogLevel).toHaveBeenCalledWith('debug')
    })

    it('should store previous log level', async () => {
      logger.getLevel.mockReturnValue('warn')

      await processor.preProcess(mockMessage)

      expect(processor.previousLogLevel).toBe('warn')
    })
  })

  describe('postProcess', () => {
    it('should restore previous log level', async () => {
      processor.previousLogLevel = 'warn'

      await processor.postProcess({})

      expect(logger.setLogLevel).toHaveBeenCalledWith('warn')
    })

  })

  describe('receive and enqueue', () => {
    it('should add message to queue via receive', async () => {
      const message = { test: 'data' }
      processor.executeQueue = vi.fn()

      await processor.receive(message)

      expect(processor.messageQueue).toHaveLength(1)
      expect(processor.messageQueue[0]).toEqual({ message })
    })

    it('should call executeQueue if not processing', async () => {
      processor.executeQueue = vi.fn()
      processor.processing = false

      await processor.enqueue({ test: 'data' })

      expect(processor.executeQueue).toHaveBeenCalled()
    })

    it('should not call executeQueue if already processing', async () => {
      processor.executeQueue = vi.fn()
      processor.processing = true

      await processor.enqueue({ test: 'data' })

      expect(processor.executeQueue).not.toHaveBeenCalled()
    })
  })

  describe('executeQueue', () => {
    let mockMessage

    beforeEach(() => {
      mockMessage = { test: 'data' }
      processor.preProcess = vi.fn()
      processor.doProcess = vi.fn()
      processor.postProcess = vi.fn()
      processor.addTag = vi.fn()
    })

    it('should process all messages in queue sequentially', async () => {
      processor.messageQueue = [{ message: mockMessage }]
      mockApp.workerPool = null

      await processor.executeQueue()

      expect(processor.processing).toBe(false)
      expect(processor.messageQueue).toHaveLength(0)
      expect(SysUtils.copyMessage).toHaveBeenCalledWith(mockMessage)
      expect(processor.addTag).toHaveBeenCalled()
      expect(processor.preProcess).toHaveBeenCalled()
      expect(processor.doProcess).toHaveBeenCalled()
      expect(processor.postProcess).toHaveBeenCalled()
    })

    it('should handle multiple messages', async () => {
      const message2 = { test: 'data2' }
      processor.messageQueue = [{ message: mockMessage }, { message: message2 }]
      mockApp.workerPool = null

      await processor.executeQueue()

      expect(processor.preProcess).toHaveBeenCalledTimes(2)
      expect(processor.doProcess).toHaveBeenCalledTimes(2)
      expect(processor.postProcess).toHaveBeenCalledTimes(2)
    })

    it('should fall back to sequential processing when worker pool exists', async () => {
      processor.messageQueue = [{ message: mockMessage }]
      mockApp.workerPool = { enqueue: vi.fn() }

      await processor.executeQueue()

      expect(processor.preProcess).toHaveBeenCalled()
      expect(processor.doProcess).toHaveBeenCalled()
      expect(processor.postProcess).toHaveBeenCalled()
    })
  })

  describe('doProcess', () => {
    beforeEach(() => {
      processor.process = vi.fn()
      processor.emit = vi.fn()
      processor.getProperty = vi.fn(() => 'true')
    })

    it('should call process for non-done messages', async () => {
      const message = { done: false }

      await processor.doProcess(message)

      expect(processor.process).toHaveBeenCalledWith(message)
    })

    it('should call process for done messages when processWhenDone is true', async () => {
      const message = { done: true }
      processor.noProcessWhenDone = false

      await processor.doProcess(message)

      expect(processor.process).toHaveBeenCalledWith(message)
    })

    it('should emit message for done messages when processWhenDone is false', async () => {
      const message = { done: true }
      processor.noProcessWhenDone = true

      await processor.doProcess(message)

      expect(processor.process).not.toHaveBeenCalled()
      expect(processor.emit).toHaveBeenCalledWith('message', message)
    })
  })

  describe('addTag', () => {
    beforeEach(() => {
      processor.id = 'http://example.org/processor1'
      processor.getTag = vi.fn(() => 'processor1')
    })

    it('should add tag to message without existing tags', () => {
      const message = {}

      processor.addTag(message)

      expect(message.tags).toBe('processor1')
    })

    it('should append tag to existing tags', () => {
      const message = { tags: 'existing' }

      processor.addTag(message)

      expect(message.tags).toBe('existing.processor1')
    })
  })

  describe('getTag', () => {
    it('should return short name of processor id', () => {
      processor.id = 'http://example.org/processor1'
      ns.shortName.mockReturnValue('processor1')

      const result = processor.getTag()

      expect(result).toBe('processor1')
      expect(ns.shortName).toHaveBeenCalledWith(processor.id)
    })
  })

  describe('getOutputs', () => {
    it('should return outputs and clear array', () => {
      processor.outputs = ['output1', 'output2']

      const result = processor.getOutputs()

      expect(result).toEqual(['output1', 'output2'])
      expect(processor.outputs).toEqual([])
    })
  })

  describe('process', () => {
    it('should emit message by default', async () => {
      const message = { test: 'data' }
      const emitSpy = vi.spyOn(EventEmitter.prototype, 'emit')

      await processor.process(message)

      expect(emitSpy).toHaveBeenCalledWith('message', message)
      emitSpy.mockRestore()
    })
  })

  describe('toString', () => {
    it('should return formatted string representation', () => {
      processor.id = 'test-id'
      processor.label = 'test-label'
      processor.type = { value: 'test-type' }
      processor.description = 'test-description'
      processor.settingsNode = { value: 'test-settings' }

      const result = processor.toString()

      expect(result).toContain('test-id')
      expect(result).toContain('test-label')
      expect(result).toContain('test-type')
      expect(result).toContain('test-description')
      expect(result).toContain('test-settings')
    })

    it('should handle missing type value gracefully', () => {
      processor.type = null

      const result = processor.toString()

      expect(result).toContain('type = ')
      expect(result).not.toThrow
    })
  })
})