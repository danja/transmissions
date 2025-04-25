import * as BrowserUtils from './BrowserUtils.js'
import logger from './Logger.js'
import N3Parser from '@rdfjs/parser-n3'
import { getFromFile, getToFile } from './rdfUtilsFsWrapper.node.js'

class RDFUtils {

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
                logger.error(`Error loading dataset in Node.js: ${error.message}`)
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
}

export default RDFUtils
