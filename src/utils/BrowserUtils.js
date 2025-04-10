/**
 * Utility functions for browser compatibility
 * Provides browser-friendly alternatives to Node.js specific functionality
 */

// Mock implementation of fs for browser environment
export const mockFs = {
  readFile: async (filePath) => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load file: ${filePath}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Error reading file: ${filePath}`, error);
      throw error;
    }
  },
  
  writeFile: async (filePath, content) => {
    console.log(`[Browser] Would write to ${filePath}:`, content);
    // In browser, trigger a download instead
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop();
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    return true;
  }
};

// Browser-friendly path utilities
export const mockPath = {
  join: (...paths) => {
    return paths.filter(Boolean).join('/').replace(/\/+/g, '/');
  },
  
  resolve: (...paths) => {
    // Simple path resolution for browser context
    return paths.filter(Boolean).join('/').replace(/\/+/g, '/');
  },
  
  dirname: (path) => {
    if (!path) return '.';
    const parts = path.split('/');
    parts.pop();
    return parts.join('/') || '.';
  },
  
  basename: (path, ext) => {
    if (!path) return '';
    const base = path.split('/').pop() || '';
    if (!ext) return base;
    return base.endsWith(ext) ? base.slice(0, -ext.length) : base;
  }
};

// Utility to detect if code is running in browser
export const isBrowser = () => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

// Helper for conditional imports
export const conditionalRequire = (moduleName) => {
  if (isBrowser()) {
    if (moduleName === 'fs') return mockFs;
    if (moduleName === 'path') return mockPath;
    return {};
  }
  // In Node.js environment, use actual modules
  try {
    return require(moduleName);
  } catch (error) {
    console.error(`Failed to load module: ${moduleName}`, error);
    return {};
  }
};
