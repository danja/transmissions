import { vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Set up a basic DOM environment using jsdom
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', {
  url: 'http://localhost:9000',
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true
});

// Assign global properties without modifying the global object directly
Object.defineProperties(global, {
  window: { value: dom.window },
  document: { value: dom.window.document },
  navigator: { value: { ...dom.window.navigator, userAgent: 'node.js' }},
  HTMLElement: { value: dom.window.HTMLElement },
  CustomEvent: { value: dom.window.CustomEvent }
});

// Mock ResizeObserver
class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}

global.ResizeObserver = ResizeObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Clean up after each test
afterEach(() => {
  // Clean up the DOM
  document.body.innerHTML = '<div id="app"></div>';
  vi.clearAllMocks();
});

// Helper function to create a test element in the DOM
export function createTestElement(html = '') {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}

// Helper to wait for the next frame
export function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

// Helper to simulate events
export function dispatchEvent(element, eventName, options = {}) {
  const event = new Event(eventName, { bubbles: true, ...options });
  element.dispatchEvent(event);
  return event;
}
