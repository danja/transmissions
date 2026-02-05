// src/processors/markup/MarkdownBindingsToHTML.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import JSONUtils from '../../utils/JSONUtils.js'
import Processor from '../../model/Processor.js'
import { marked } from 'marked'
import markedFootnote from 'marked-footnote'
import markedCodeFormat from 'marked-code-format'

/**
 * @class MarkdownBindingsToHTML
 * @extends Processor
 * @classdesc
 * Converts markdown fields inside SPARQL result bindings to HTML.
 *
 * Settings:
 * - ns.trn.listField: path to bindings array (default: "queryResults.results.bindings")
 * - ns.trn.sourceField: markdown field within each binding (default: "content.value")
 * - ns.trn.outputField: output field name within each binding (default: "contentHtml")
 */
class MarkdownBindingsToHTML extends Processor {
    async process(message) {
        logger.debug('MarkdownBindingsToHTML.process')

        if (message.done) {
            return this.emit('message', message)
        }

        const listField = super.getProperty(ns.trn.listField, 'queryResults.results.bindings')
        const sourceField = super.getProperty(ns.trn.sourceField, 'content.value')
        const outputField = super.getProperty(ns.trn.outputField, 'contentHtml')

        const bindings = JSONUtils.get(message, listField)
        if (!Array.isArray(bindings) || bindings.length === 0) {
            logger.debug('MarkdownBindingsToHTML: No bindings found, skipping')
            return this.emit('message', message)
        }

        for (const binding of bindings) {
            const markdown = JSONUtils.get(binding, sourceField)
            if (!markdown) {
                continue
            }

            let html = ''
            try {
                html = await marked
                    .use(markedFootnote())
                    .use(markedCodeFormat({}))
                    .setOptions({
                        gfm: true,
                        breaks: false,
                        sanitize: false,
                        smartypants: false,
                        headerIds: true,
                        mangle: false,
                    })
                    .parse(markdown.toString())
            } catch (error) {
                logger.warn(`MarkdownBindingsToHTML: Failed conversion - ${error.message}`)
                continue
            }

            const outputValue = { type: 'literal', value: html }
            if (outputField.includes('.') || outputField.includes('[')) {
                JSONUtils.set(binding, outputField, outputValue)
            } else {
                binding[outputField] = outputValue
            }
        }

        return this.emit('message', message)
    }
}

export default MarkdownBindingsToHTML
