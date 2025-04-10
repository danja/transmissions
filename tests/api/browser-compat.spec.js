import { isBrowser, mockFs, mockPath } from '../../src/utils/BrowserUtils.js'

describe('BrowserUtils', () => {
  it('should correctly identify browser environment', () => {
    // This test runs in Node.js environment during testing
    expect(isBrowser()).toBe(false)

    // Mock browser environment
    const originalWindow = global.window
    const originalDocument = global.document

    global.window = { location: { href: 'http://localhost' } }
    global.document = { createElement: () => { } }

    expect(isBrowser()).toBe(true)

    // Restore original
    global.window = originalWindow
    global.document = originalDocument
  })

  describe('mockFs', () => {
    it('should have readFile method', () => {
      expect(typeof mockFs.readFile).toBe('function')
    })

    it('should have writeFile method', () => {
      expect(typeof mockFs.writeFile).toBe('function')
    })
  })

  describe('mockPath', () => {
    it('should correctly join paths', () => {
      expect(mockPath.join('a', 'b', 'c')).toBe('a/b/c')
      expect(mockPath.join('a/', '/b', 'c')).toBe('a/b/c')
      expect(mockPath.join('', 'b', 'c')).toBe('b/c')
    })

    it('should correctly resolve paths', () => {
      expect(mockPath.resolve('a', 'b', 'c')).toBe('a/b/c')
    })

    it('should correctly get directory name', () => {
      expect(mockPath.dirname('a/b/c')).toBe('a/b')
      expect(mockPath.dirname('a/b/c.js')).toBe('a/b')
    })

    it('should correctly get basename', () => {
      expect(mockPath.basename('a/b/c.js')).toBe('c.js')
      expect(mockPath.basename('a/b/c.js', '.js')).toBe('c')
    })
  })
})