import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestElement } from '../test-utils.js';
import CustomNodeRenderer from '../../../src/tools/nodeflow/components/CustomNodeRenderer';

describe('CustomNodeRenderer', () => {
  let container;
  let renderer;
  let mockGraph;
  let mockNodeRenderer;
  
  const mockNode = {
    id: 'test-node',
    data: {
      label: 'Test Node',
    },
    position: { x: 0, y: 0 },
  };

  function createRenderer() {
    // Create a mock graph with a nodeRenderer
    mockNodeRenderer = {
      renderNode: vi.fn()
    };
    
    mockGraph = {
      nodeRenderer: mockNodeRenderer
    };
    
    return new CustomNodeRenderer(mockGraph);
  }

  beforeEach(() => {
    container = createTestElement();
    renderer = createRenderer();
  });

  afterEach(() => {
    // Clean up any DOM elements
    container.remove();
  });

  it('should initialize with the graph reference', () => {
    expect(renderer.graph).toBe(mockGraph);
  });

  it('should store the original render function', () => {
    // The original render function should be stored and be a function
    expect(renderer.originalRenderFunction).toBeDefined();
    expect(typeof renderer.originalRenderFunction).toBe('function');
    
    // The stored function should not be the same as the current renderNode
    // since we replaced it with our custom implementation
    expect(renderer.originalRenderFunction).not.toBe(mockNodeRenderer.renderNode);
  });

  it('should replace the node renderer with custom implementation', () => {
    expect(mockNodeRenderer.renderNode).not.toBe(renderer.originalRenderFunction);
    expect(typeof mockNodeRenderer.renderNode).toBe('function');
  });

  describe('customRenderNode', () => {
    it('should call the original render function', () => {
      const mockCtx = {};
      const originalRenderSpy = vi.spyOn(renderer, 'originalRenderFunction');
      
      mockNodeRenderer.renderNode(mockNode, mockCtx);
      
      expect(originalRenderSpy).toHaveBeenCalledWith(mockNode, mockCtx);
    });

    it('should call renderSettingsSection', () => {
      const mockCtx = {};
      const renderSettingsSpy = vi.spyOn(renderer, 'renderSettingsSection');
      
      mockNodeRenderer.renderNode(mockNode, mockCtx);
      
      expect(renderSettingsSpy).toHaveBeenCalledWith(mockNode, mockCtx);
    });

    it('should handle errors during rendering', () => {
      const mockCtx = {};
      const error = new Error('Test error');
      
      // Make originalRenderFunction throw an error
      mockNodeRenderer.renderNode = vi.fn().mockImplementationOnce(() => {
        throw error;
      });
      
      // Recreate renderer with the failing mock
      renderer = new CustomNodeRenderer(mockGraph);
      
      // Spy on console.error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // This should not throw
      expect(() => {
        mockNodeRenderer.renderNode(mockNode, mockCtx);
      }).not.toThrow();
      
      // Should log the error
      expect(consoleSpy).toHaveBeenCalledWith('Error in custom node rendering:', error);
      
      // Clean up
      consoleSpy.mockRestore();
    });
  });
});
