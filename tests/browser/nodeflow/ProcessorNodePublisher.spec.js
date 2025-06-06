import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestElement, dispatchEvent } from '../test-utils.js';
import ProcessorNodePublisher from '../../../src/tools/nodeflow/components/ProcessorNodePublisher';

describe('ProcessorNodePublisher', () => {
  let container;
  let publisher;
  const mockOnPublish = vi.fn();
  const mockOnClose = vi.fn();

  const mockNode = {
    id: 'node-1',
    data: {
      label: 'Test Node',
      // Add other required node data properties
    },
    position: { x: 0, y: 0 },
  };

  function createPublisher(props = {}) {
    const element = document.createElement('div');
    container.appendChild(element);
    return new ProcessorNodePublisher(element, {
      node: mockNode,
      onPublish: mockOnPublish,
      onClose: mockOnClose,
      ...props
    });
  }

  beforeEach(() => {
    container = createTestElement();
    publisher = createPublisher();
  });

  afterEach(() => {
    if (publisher && typeof publisher.destroy === 'function') {
      publisher.destroy();
    }
    container.remove();
    mockOnPublish.mockClear();
    mockOnClose.mockClear();
  });

  it('creates the publisher dialog when initialized', () => {
    const dialog = container.querySelector('.processor-publisher');
    expect(dialog).toBeInstanceOf(HTMLElement);
  });

  it('populates form with node data', () => {
    const nameInput = container.querySelector('input[name="name"]');
    expect(nameInput.value).toBe(mockNode.data.label);
  });

  it('calls onPublish with form data when publish button is clicked', () => {
    const publishButton = container.querySelector('.publish-button');
    const nameInput = container.querySelector('input[name="name"]');
    const descriptionInput = container.querySelector('textarea[name="description"]');

    // Update form fields
    const testName = 'Test Processor';
    const testDescription = 'Test processor description';

    nameInput.value = testName;
    dispatchEvent(nameInput, 'input');

    descriptionInput.value = testDescription;
    dispatchEvent(descriptionInput, 'input');

    // Submit the form
    dispatchEvent(publishButton, 'click');

    expect(mockOnPublish).toHaveBeenCalledWith({
      name: testName,
      description: testDescription,
      nodeId: mockNode.id,
      // Add other expected properties
    });
  });

  it('calls onClose when cancel button is clicked', () => {
    const cancelButton = container.querySelector('.cancel-button');
    dispatchEvent(cancelButton, 'click');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('validates required fields before publishing', () => {
    const publishButton = container.querySelector('.publish-button');
    const nameInput = container.querySelector('input[name="name"]');

    // Clear required field
    nameInput.value = '';
    dispatchEvent(nameInput, 'input');

    // Try to publish
    dispatchEvent(publishButton, 'click');

    // Should not call onPublish
    expect(mockOnPublish).not.toHaveBeenCalled();

    // Check for validation error
    const errorMessage = container.querySelector('.error-message');
    expect(errorMessage).toBeInstanceOf(HTMLElement);
  });

  it('updates when node data changes', () => {
    const newNode = {
      ...mockNode,
      data: { ...mockNode.data, label: 'Updated Node' }
    };

    publisher.update({ node: newNode });

    const nameInput = container.querySelector('input[name="name"]');
    expect(nameInput.value).toBe(newNode.data.label);
  });
});
