import { isBrowser } from './BrowserUtils.js'

// Usage:
//   const fromFile = await getFromFile();
//   const toFile = await getToFile();

export async function getFromFile() {
    if (isBrowser()) {
        const browser = await import('./RDFUtilsBrowser.js')
        return browser.fromFile
    } else {
        const node = await import('rdf-utils-fs')
        return node.fromFile
    }
}

export async function getToFile() {
    if (isBrowser()) {
        const browser = await import('./RDFUtilsBrowser.js')
        return browser.toFile
    } else {
        const node = await import('rdf-utils-fs')
        return node.toFile
    }
} 