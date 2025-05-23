// Wrapper for rdf-utils-fs that works in both Node.js and browser environments

// Check if we're in a browser or Node.js environment
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export async function getFromFile() {
    if (isBrowser) {
        // In browser, return a no-op function or implement browser-specific logic
        return async () => {
            throw new Error('File operations are not supported in the browser');
        };
    } else {
        // In Node.js, use the actual file system functions
        const { fromFile } = await import('rdf-utils-fs');
        return fromFile;
    }
}

export async function getToFile() {
    if (isBrowser) {
        // In browser, return a no-op function or implement browser-specific logic
        return async () => {
            throw new Error('File operations are not supported in the browser');
        };
    } else {
        // In Node.js, use the actual file system functions
        const { toFile } = await import('rdf-utils-fs');
        return toFile;
    }
} 