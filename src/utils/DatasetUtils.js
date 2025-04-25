import { isBrowser } from './BrowserUtils.js'
import { getFromFile, getToFile } from 'rdfUtilsFsWrapper'

// Read dataset from file (Node or browser)
export async function readDataset(filename) {
    const fromFile = await getFromFile()
    let rdf
    if (isBrowser()) {
        rdf = (await import('./RDFExtBrowser.js')).default
    } else {
        rdf = (await import('rdf-ext')).default || (await import('rdf-ext'))
    }
    const stream = fromFile(filename)
    const dataset = await rdf.dataset().import(stream)
    return dataset
}

// Write dataset to file (Node or browser)
export async function writeDataset(dataset, filename) {
    const toFile = await getToFile()
    await toFile(dataset.toStream(), filename)
}
