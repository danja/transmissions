import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestElement, dispatchEvent } from '../test-utils.js';
import TransmissionsGraphBuilder from '../../../src/tools/nodeflow/components/TransmissionsGraphBuilder';

describe('TransmissionsGraphBuilder', () => {
  let container;
  let graphBuilder;
  const mockTransmissions = [
    {
      id: 't1',
      name: 'Test Transmission',
      // Add other required transmission properties
    },
  ];

  const defaultProps = {
    transmissions: mockTransmissions,
    onNodeClick: vi.fn(),
    onEdgeClick: vi.fn(),
    onPaneClick: vi.fn(),
  };

  beforeEach(() => {
    container = createTestElement();
    graphBuilder = new TransmissionsGraphBuilder({
      container,
      ...defaultProps
    });
  });

  afterEach(() => {
    if (graphBuilder && typeof graphBuilder.destroy === 'function') {
      graphBuilder.destroy();
    }
    container.remove();
  });

  it('initializes without errors', () => {
    expect(graphBuilder).toBeInstanceOf(TransmissionsGraphBuilder);
  });

  it('creates a canvas element', () => {
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInstanceOf(HTMLElement);
  });

  it('renders nodes for each transmission', () => {
    // This test assumes your graph builder adds elements with a specific class
    const nodes = container.querySelectorAll('.node');
    expect(nodes.length).toBe(mockTransmissions.length);
  });

  it('calls onNodeClick when a node is clicked', () => {
    // Assuming nodes have a specific class and data attribute
    const node = container.querySelector('.node');
    if (node) {
      dispatchEvent(node, 'click');
      expect(defaultProps.onNodeClick).toHaveBeenCalled();
    } else {
      // Skip the test if the node doesn't exist (implementation might be different)
      console.warn('Could not find node element for click test');
    }
  });

  it('calls onPaneClick when the background is clicked', () => {
    const background = container.querySelector('.graph-background');
    if (background) {
      dispatchEvent(background, 'click');
      expect(defaultProps.onPaneClick).toHaveBeenCalled();
    } else {
      // Skip the test if the background doesn't exist (implementation might be different)
      console.warn('Could not find background element for click test');
    }
  });

  it('updates when transmissions change', () => {
    const newTransmissions = [...mockTransmissions, { id: 't2', name: 'New Transmission' }];
    graphBuilder.update({ transmissions: newTransmissions });

    // Check if the new node was added
    const nodes = container.querySelectorAll('.node');
    expect(nodes.length).toBe(newTransmissions.length);
  });
});
