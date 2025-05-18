import * as BrowserUtils from './BrowserUtils.js'
import logger from './Logger.js'
import N3Parser from '@rdfjs/parser-n3'
import rdfExt from 'rdf-ext'
import { getFromFile, getToFile } from './rdfUtilsFsWrapper.node.js'

class RDFUtils {

    // Creates an empty dataset with a dummy triple to prevent null issues
    static createEmptyDataset() {
        const dataset = rdfExt.dataset()
        // Add a dummy triple to prevent null issues
        /*
        const triple = rdfExt.triple(
            rdfExt.namedNode('http://example.org/dummy'),
            rdfExt.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            rdfExt.namedNode('http://example.org/App')
        );
        dataset.add(triple);
        */
        return dataset
    }

    async fromFile(filename) {
        if (BrowserUtils.isBrowser()) {
            const browser = await import('./RDFUtilsBrowser.js')
            return browser.fromFile(filename)
        }
        const fromFile = await getFromFile()
        return fromFile(filename)
    }

    async toFile(dataset, filename) {
        if (BrowserUtils.isBrowser()) {
            const browser = await import('./RDFUtilsBrowser.js')
            return browser.toFile(dataset, filename)
        }
        const toFile = await getToFile()
        return toFile(dataset, filename)
    }

    async readDataset(path) {
        if (BrowserUtils.isBrowser()) {
            try {
                const response = await fetch(path)
                if (!response.ok) {
                    throw new Error(`Failed to load dataset from ${path}`)
                }
                const text = await response.text()
                //  const parseFunction = (await import('@rdfjs/parser-turtle')).default
                //   return parseFunction(text)
                return N3Parser.parse(text)

            } catch (error) {
                logger.error(`Error loading dataset in browser: ${error.message}`)
                throw error
            }
        } else {
            try {
                if (!path) {
                    throw new Error('Path is required for reading dataset in Node.js environment')
                }

                const rdfExt = await import('rdf-ext').then(m => m.default)
                const fromFile = await getFromFile()
                const stream = fromFile(path)
                const dataset = await rdfExt.dataset().import(stream)
                return dataset
            } catch (error) {
                logger.warn(`Warning : RDFUtils.readDataset (from Node.js): ${error.message}`)
                // console.trace()
                throw error
            }
        }
    }

    async writeDataset(dataset, path) {
        if (BrowserUtils.isBrowser()) {
            try {
                const dataString = dataset.toString()
                const blob = new Blob([dataString], { type: 'text/turtle' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = path
                link.click()

                URL.revokeObjectURL(url)
                return true
            } catch (error) {
                logger.error(`Error saving dataset in browser: ${error.message}`)
                throw error
            }
        } else {
            try {
                const toFile = await getToFile()
                await toFile(dataset.toStream(), path)
                return true
            } catch (error) {
                logger.error(`Error saving dataset in Node.js: ${error.message}`)
                throw error
            }
        }
    }

    async loadDataset(path) {
        try {
            return await this.readDataset(path)
        } catch (error) {
            logger.error(`Error loading dataset from ${path}: ${error.message}`)
            logger.error(`Stack: ${error.stack}`)
            throw error
        }
    }

    /** HACK!!!!
     * Escapes any URIs enclosed in angle brackets in the input string
     * <http://example.org/here a space> becomes <http://example.org/here%20a%20space>
     * @param {string} inputText - Text containing URIs in angle brackets
     * @return {string} Text with properly escaped URIs
     */
    static escapeAngleBracketURIs(inputText) {
        // Regular expression to match URIs in angle brackets
        // Captures the entire URI including the angle brackets
        return inputText.replace(/<(https?:\/\/[^>]+)>/g, (match, uri) => {
            try {
                // Create URL object to handle the URI
                const url = new URL(uri);

                // Properly encode the pathname and search portions
                // This preserves the structure of the URL while escaping spaces and special chars
                url.pathname = encodeURI(url.pathname);

                // Handle query parameters if they exist
                if (url.search) {
                    // Remove the leading ? before encoding
                    const searchParams = url.search.substring(1);
                    // Encode the search parameters and add the ? back
                    url.search = '?' + encodeURIComponent(searchParams).replace(/%3D/g, '=').replace(/%26/g, '&');
                }

                // Return the escaped URI within angle brackets
                return `<${url.toString()}>`;
            } catch (e) {
                // If URL parsing fails, use a more basic approach
                const escapedUri = encodeURI(uri);
                return `<${escapedUri}>`;
            }
        });
    }

}

export default RDFUtils
