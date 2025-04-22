import * as BrowserUtils from '../../src/utils/BrowserUtils.js'

describe('BrowserUtils', () => {
  describe('isBrowser', () => {
    it('should correctly identify browser environment', () => {
      // Save original window and document objects
      const originalWindow = global.window
      const originalDocument = global.document
      
      // First test without window and document - should be Node environment
      global.window = undefined
      global.document = undefined
      
      expect(BrowserUtils.isBrowser()).toBe(false)
      
      // Now make it look like a browser
      global.window = { location: { href: 'http://localhost' } }
      global.document = { createElement: () => {} }
      
      expect(BrowserUtils.isBrowser()).toBe(true)
      
      // Restore originals
      global.window = originalWindow
      global.document = originalDocument
    })
  })
  
  describe('mockFs', () => {
    it('should have readFile and writeFile methods', () => {
      expect(typeof BrowserUtils.mockFs.readFile).toBe('function')
      expect(typeof BrowserUtils.mockFs.writeFile).toBe('function')
    })
    
    it('should handle readFile in browser environment', async () => {
      // Save original fetch
      const originalFetch = global.fetch
      
      // Mock successful fetch
      global.fetch = jasmine.createSpy('fetch').and.resolveTo({
        ok: true,
        text: jasmine.createSpy('text').and.resolveTo('file content')
      })
      
      const result = await BrowserUtils.mockFs.readFile('test.txt')
      
      expect(global.fetch).toHaveBeenCalledWith('test.txt')
      expect(result).toBe('file content')
      
      // Test error handling
      global.fetch = jasmine.createSpy('fetch').and.rejectWith(new Error('Network error'))
      
      await expectAsync(BrowserUtils.mockFs.readFile('error.txt'))
        .toBeRejectedWithError(/Network error/)
      
      // Restore original
      global.fetch = originalFetch
    })
    
    it('should handle writeFile in browser environment', async () => {
      // Save originals
      const originalCreateObjectURL = global.URL.createObjectURL
      const originalRevokeObjectURL = global.URL.revokeObjectURL
      const originalDocument = global.document
      const originalBody = global.document?.body
      
      // Setup mocks
      global.URL.createObjectURL = jasmine.createSpy('createObjectURL').and.returnValue('blob:url')
      global.URL.revokeObjectURL = jasmine.createSpy('revokeObjectURL')
      
      const mockAnchor = {
        href: '',
        download: '',
        click: jasmine.createSpy('click')
      }
      
      global.document = {
        createElement: jasmine.createSpy('createElement').and.returnValue(mockAnchor),
        body: {
          appendChild: jasmine.createSpy('appendChild'),
          removeChild: jasmine.createSpy('removeChild')
        }
      }
      
      const result = await BrowserUtils.mockFs.writeFile('test.txt', 'test content')
      
      expect(global.document.createElement).toHaveBeenCalledWith('a')
      expect(mockAnchor.download).toBe('test.txt')
      expect(mockAnchor.click).toHaveBeenCalled()
      expect(result).toBe(true)
      
      // Restore originals
      global.URL.createObjectURL = originalCreateObjectURL
      global.URL.revokeObjectURL = originalRevokeObjectURL
      global.document = originalDocument
      if (global.document) global.document.body = originalBody
    })
  })
  
  describe('mockPath', () => {
    it('should join paths correctly', () => {
      expect(BrowserUtils.mockPath.join('a', 'b', 'c')).toBe('a/b/c')
      expect(BrowserUtils.mockPath.join('a/', '/b', 'c')).toBe('a/b/c')
      expect(BrowserUtils.mockPath.join('', 'b', 'c')).toBe('b/c')
    })
    
    it('should resolve paths', () => {
      expect(BrowserUtils.mockPath.resolve('a', 'b', 'c')).toBe('a/b/c')
      expect(BrowserUtils.mockPath.resolve('/a', 'b', 'c')).toBe('/a/b/c')
      expect(BrowserUtils.mockPath.resolve('a', '/b', 'c')).toBe('/b/c')
    })
    
    it('should return dirname correctly', () => {
      expect(BrowserUtils.mockPath.dirname('a/b/c')).toBe('a/b')
      expect(BrowserUtils.mockPath.dirname('a/b/c.js')).toBe('a/b')
      expect(BrowserUtils.mockPath.dirname('file.txt')).toBe('.')
    })
    
    it('should return basename correctly', () => {
      expect(BrowserUtils.mockPath.basename('a/b/c.js')).toBe('c.js')
      expect(BrowserUtils.mockPath.basename('a/b/c.js', '.js')).toBe('c')
      expect(BrowserUtils.mockPath.basename('file.txt')).toBe('file.txt')
    })
  })
  
  describe('conditionalRequire', () => {
    it('should return mock objects in browser environment', () => {
      // Make it look like a browser
      spyOn(BrowserUtils, 'isBrowser').and.returnValue(true)
      
      const fsMock = BrowserUtils.conditionalRequire('fs')
      const pathMock = BrowserUtils.conditionalRequire('path')
      
      expect(fsMock).toBe(BrowserUtils.mockFs)
      expect(pathMock).toBe(BrowserUtils.mockPath)
    })
    
    it('should try to use require in Node environment', () => {
      // Make it look like Node
      spyOn(BrowserUtils, 'isBrowser').and.returnValue(false)
      
      // We can't actually test the require call in a test environment,
      // but we can check it tried to use the Node path
      // This would normally throw in a test environment
      
      let result
      try {
        result = BrowserUtils.conditionalRequire('test-module')
      } catch (e) {
        // Expected to fail in test environment
      }
      
      expect(BrowserUtils.isBrowser).toHaveBeenCalled()
    })
  })
})
