import SysUtils from '../../src/utils/SysUtils.js'
import logger from '../../src/utils/Logger.js'

describe('SysUtils', () => {
  beforeEach(() => {
    spyOn(logger, 'debug').and.callThrough()
  })
  
  describe('#copyMessage', () => {
    it('should create a deep copy of a message object', () => {
      // Create a message object with a nested structure
      const originalMessage = {
        content: 'test content',
        meta: {
          title: 'Test Title',
          author: 'Test Author'
        },
        data: [1, 2, 3],
        app: {
          dataset: { /* complex dataset that needs special handling */ }
        }
      }
      
      const copy = SysUtils.copyMessage(originalMessage)
      
      // The copied object should be a different reference
      expect(copy).not.toBe(originalMessage)
      
      // But it should have the same values
      expect(copy.content).toBe('test content')
      expect(copy.meta.title).toBe('Test Title')
      expect(copy.meta.author).toBe('Test Author')
      expect(copy.data).toEqual([1, 2, 3])
      
      // Nested objects should be deep-copied
      expect(copy.meta).not.toBe(originalMessage.meta)
      
      // The dataset should be preserved (not cloned), since it's a special case
      expect(copy.app.dataset).toBe(originalMessage.app.dataset)
    })
    
    it('should handle null and undefined values', () => {
      const originalMessage = {
        nullValue: null,
        undefinedValue: undefined,
        content: 'content'
      }
      
      const copy = SysUtils.copyMessage(originalMessage)
      
      expect(copy.nullValue).toBeNull()
      expect(copy.undefinedValue).toBeUndefined()
      expect(copy.content).toBe('content')
    })
    
    it('should handle messages without app property', () => {
      const originalMessage = {
        content: 'test content',
        meta: { title: 'Test' }
      }
      
      const copy = SysUtils.copyMessage(originalMessage)
      
      expect(copy.content).toBe('test content')
      expect(copy.meta.title).toBe('Test')
      expect(copy.app).toBeUndefined()
    })
  })
  
  describe('#sleep', () => {
    // Using Jasmine's async/await support
    it('should resolve after specified time', async () => {
      spyOn(global, 'setTimeout').and.callFake((callback) => {
        callback();
        return 123; // Mock timer ID
      });
      
      const start = Date.now()
      await SysUtils.sleep(100)
      const elapsed = Date.now() - start
      
      // In our test environment with mocked setTimeout, this will be near-instant
      // In a real environment, it would wait approximately 100ms
      expect(global.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 100)
    })
    
    it('should use default timeout if none specified', async () => {
      spyOn(global, 'setTimeout').and.callFake((callback) => {
        callback();
        return 123; // Mock timer ID
      });
      
      await SysUtils.sleep()
      
      // Should use the default timeout from the implementation
      expect(global.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 100)
    })
  })
  
  describe('#gc', () => {
    beforeEach(() => {
      spyOn(logger, 'warn').and.callThrough()
    })
    
    it('should call global.gc if available', () => {
      // Mock global.gc
      const originalGc = global.gc
      global.gc = jasmine.createSpy('gc')
      
      SysUtils.gc()
      
      expect(global.gc).toHaveBeenCalled()
      expect(logger.debug).toHaveBeenCalledWith('<<<Garbage collection triggered>>>')
      
      // Restore original
      global.gc = originalGc
    })
    
    it('should log a warning if global.gc is not available', () => {
      // Remove global.gc temporarily
      const originalGc = global.gc
      global.gc = undefined
      
      SysUtils.gc()
      
      expect(logger.warn).toHaveBeenCalledWith('Garbage collection triggered without global.gc, check ./trans-gc')
      
      // Restore original
      global.gc = originalGc
    })
  })
  
  // Since resolveFilePath would typically interact with the file system,
  // it's more challenging to test in isolation. We could add tests for it
  // if needed with more extensive mocking.
})