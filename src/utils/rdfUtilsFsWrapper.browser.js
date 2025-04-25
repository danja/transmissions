// Browser-only wrapper for RDFUtilsBrowser

export async function getFromFile() {
    return (await import('./RDFUtilsBrowser.js')).fromFile
}

export async function getToFile() {
    return (await import('./RDFUtilsBrowser.js')).toFile
} 