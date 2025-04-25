// Node.js-only wrapper for rdf-utils-fs

export async function getFromFile() {
    // Use require to avoid static import for Webpack
    return require('rdf-utils-fs').fromFile
}

export async function getToFile() {
    return require('rdf-utils-fs').toFile
} 