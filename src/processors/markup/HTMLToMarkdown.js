// src/processors/markup/HTMLToMarkdown.js

import * as cheerio from 'cheerio'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import JSONUtils from '../../utils/JSONUtils.js'
import Processor from '../../model/Processor.js'

/**
 * @class HTMLToMarkdown
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Converts HTML content to Markdown format using cheerio for parsing.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.inputField`** - Field containing HTML (default: 'http.data')
 * * **`ns.trn.outputField`** - Field for markdown output (default: 'content')
 * * **`ns.trn.cleanSelectors`** - CSS selectors to remove (default: removes scripts, styles, nav, footer, aside)
 *
 * #### __*Input*__
 * * **`message[inputField]`** - HTML content to convert
 *
 * #### __*Output*__
 * * **`message[outputField]`** - Markdown content
 *
 * #### __*Behavior*__
 * * Parses HTML using cheerio
 * * Removes unwanted elements (scripts, navigation, etc.)
 * * Converts HTML elements to Markdown syntax
 * * Preserves links, images, formatting, lists, code blocks
 * * Emits message with markdown content
 *
 * #### __*Side Effects*__
 * * Modifies message object
 *
 * #### __*Example Configuration*__
 * ```turtle
 * :htmlToMd a :HTMLToMarkdown ;
 *     :settings :htmlConfig .
 *
 * :htmlConfig a :ConfigSet ;
 *     :inputField "http.data" ;
 *     :outputField "content" .
 * ```
 */
class HTMLToMarkdown extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug('HTMLToMarkdown.process')

        if (message.done) {
            logger.debug('HTMLToMarkdown: Message marked as done, skipping')
            return this.emit('message', message)
        }

        const inputField = super.getProperty(ns.trn.inputField, 'http.data')
        const outputField = super.getProperty(ns.trn.outputField, 'content')
        const cleanSelectors = super.getProperty(ns.trn.cleanSelectors, 'script,style,nav,footer,aside,noscript')

        const html = JSONUtils.get(message, inputField)

        if (!html) {
            logger.debug(`HTMLToMarkdown: No HTML found in field '${inputField}', skipping`)
            return this.emit('message', message)
        }

        logger.debug(`HTMLToMarkdown: Converting HTML (length: ${html.length})`)

        try {
            const $ = cheerio.load(html)

            // Remove unwanted elements
            const selectorsArray = cleanSelectors.split(',').map(s => s.trim())
            selectorsArray.forEach(selector => {
                $(selector).remove()
            })

            // Convert to markdown
            const markdown = this.convertToMarkdown($, $('body').length > 0 ? $('body') : $.root())

            logger.debug(`HTMLToMarkdown: Converted to markdown (length: ${markdown.length})`)

            JSONUtils.set(message, outputField, markdown.trim())

            return this.emit('message', message)
        } catch (error) {
            logger.error(`HTMLToMarkdown: Error converting HTML to markdown - ${error.message}`)
            message.htmlToMarkdownError = error.message
            return this.emit('message', message)
        }
    }

    convertToMarkdown($, element) {
        let markdown = ''

        element.contents().each((i, node) => {
            if (node.type === 'text') {
                const normalized = this.normalizeText($(node).text())
                if (normalized) {
                    markdown += normalized
                }
            } else if (node.type === 'tag') {
                const $node = $(node)
                const tagName = node.tagName.toLowerCase()

                switch (tagName) {
                    case 'h1':
                        markdown += '\n# ' + $node.text().trim() + '\n\n'
                        break
                    case 'h2':
                        markdown += '\n## ' + $node.text().trim() + '\n\n'
                        break
                    case 'h3':
                        markdown += '\n### ' + $node.text().trim() + '\n\n'
                        break
                    case 'h4':
                        markdown += '\n#### ' + $node.text().trim() + '\n\n'
                        break
                    case 'h5':
                        markdown += '\n##### ' + $node.text().trim() + '\n\n'
                        break
                    case 'h6':
                        markdown += '\n###### ' + $node.text().trim() + '\n\n'
                        break
                    case 'p':
                        markdown += this.convertToMarkdown($, $node) + '\n\n'
                        break
                    case 'br':
                        markdown += '  \n'
                        break
                    case 'hr':
                        markdown += '\n---\n\n'
                        break
                    case 'a':
                        const href = $node.attr('href')
                        const text = $node.text().trim()
                        if (href) {
                            markdown += `[${text}](${href})`
                        } else {
                            markdown += text
                        }
                        break
                    case 'img':
                        const src = $node.attr('src')
                        const alt = $node.attr('alt') || ''
                        if (src) {
                            markdown += `![${alt}](${src})`
                        }
                        break
                    case 'strong':
                    case 'b':
                        markdown += '**' + $node.text().trim() + '**'
                        break
                    case 'em':
                    case 'i':
                        markdown += '*' + $node.text().trim() + '*'
                        break
                    case 'code':
                        if ($node.parent().is('pre')) {
                            // Code block - handled by pre tag
                        } else {
                            // Inline code
                            markdown += '`' + $node.text() + '`'
                        }
                        break
                    case 'pre':
                        const codeContent = $node.find('code').length > 0
                            ? $node.find('code').text()
                            : $node.text()
                        markdown += '\n```\n' + codeContent + '\n```\n\n'
                        break
                    case 'blockquote':
                        const quoteLines = this.convertToMarkdown($, $node).trim().split('\n')
                        markdown += '\n' + quoteLines.map(line => '> ' + line).join('\n') + '\n\n'
                        break
                    case 'ul':
                        markdown += '\n' + this.convertList($, $node, false) + '\n'
                        break
                    case 'ol':
                        markdown += '\n' + this.convertList($, $node, true) + '\n'
                        break
                    case 'li':
                        // Handled by ul/ol
                        break
                    case 'table':
                        markdown += '\n' + this.convertTable($, $node) + '\n'
                        break
                    case 'div':
                    case 'span':
                    case 'section':
                    case 'article':
                    case 'main':
                        markdown += this.convertToMarkdown($, $node)
                        break
                    default:
                        // For unhandled tags, just get the text content
                        markdown += this.convertToMarkdown($, $node)
                }
            }
        })

        return markdown
    }

    normalizeText(text) {
        if (!text || typeof text !== 'string') {
            return ''
        }
        const normalized = text
            .replace(/\r\n/g, '\n')
            .replace(/[ \t]+/g, ' ')
            .replace(/ *\n */g, '\n')
        if (normalized.replace(/\s+/g, '').length === 0) {
            return ''
        }
        return normalized
    }

    convertList($, listElement, ordered = false) {
        let result = ''
        let counter = 1

        listElement.children('li').each((i, li) => {
            const $li = $(li)
            const prefix = ordered ? `${counter}. ` : '- '
            const content = this.convertToMarkdown($, $li).trim()
            result += prefix + content + '\n'
            counter++
        })

        return result
    }

    convertTable($, tableElement) {
        let result = ''
        const rows = []

        // Get all rows
        tableElement.find('tr').each((i, tr) => {
            const $tr = $(tr)
            const cells = []
            $tr.find('th, td').each((j, cell) => {
                cells.push($(cell).text().trim())
            })
            rows.push(cells)
        })

        if (rows.length === 0) return ''

        // Build markdown table
        const colCount = Math.max(...rows.map(r => r.length))

        // Header row
        result += '| ' + rows[0].map(c => c || ' ').join(' | ') + ' |\n'

        // Separator row
        result += '| ' + Array(colCount).fill('---').join(' | ') + ' |\n'

        // Data rows
        for (let i = 1; i < rows.length; i++) {
            result += '| ' + rows[i].map(c => c || ' ').join(' | ') + ' |\n'
        }

        return result
    }
}

export default HTMLToMarkdown
