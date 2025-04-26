// Node.js-only wrapper for rdf-utils-fs
import { fromFile, toFile } from 'rdf-utils-fs'
export async function getFromFile() {
    // Use require to avoid static import for Webpack
    return fromFile
    //require('rdf-utils-fs').fromFile
}

export async function getToFile() {
    return toFile
    //  return require('rdf-utils-fs').toFile
} 