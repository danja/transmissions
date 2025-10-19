// src/processors/sparql/RDFBuilder.js

import nunjucks from 'nunjucks'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import crypto from 'crypto'

/**
 * @class RDFBuilder
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Builds RDF statements (Turtle format) from message data using Nunjucks templates.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.templateFilename`** - Path to Nunjucks template file
 * * **`ns.trn.template`** - Inline template string (alternative to templateFilename)
 * * **`ns.trn.dataField`** - Field containing data to template (default: whole message)
 * * **`ns.trn.outputField`** - Field for RDF output (default: 'rdf')
 * * **`ns.trn.baseURI`** - Base URI for resource generation (default: 'http://hyperdata.it/')
 *
 * #### __*Input*__
 * * **`message[dataField]`** - Data to be templated into RDF
 *
 * #### __*Output*__
 * * **`message.rdf`** - Generated RDF/Turtle string (or custom field via outputField)
 *
 * #### __*Behavior*__
 * * Loads template from file or uses inline template
 * * Renders template with Nunjucks using message data
 * * Adds helper functions to template context (uri, hash, escape)
 * * Outputs Turtle/N-Triples format RDF
 *
 * #### __*Side Effects*__
 * * File system read for template files
 *
 * #### __*Template Helpers*__
 * * `uri(str)` - Generate URI from string (removes spaces, special chars)
 * * **`hash(str)` - Generate short hash from string
 * * `escape(str)` - Escape RDF literals
 * * `now()` - Current ISO timestamp
 * * `isoDate(str)` - Convert date to ISO 8601 format
 *
 * #### __*Example Template*__
 * ```turtle
 * @prefix sioc: <http://rdfs.org/sioc/ns#> .
 * @prefix dc: <http://purl.org/dc/elements/1.1/> .
 *
 * <{{ uri(baseURI + 'posts/' + hash(guid)) }}> a sioc:Post ;
 *     dc:title "{{ escape(title) }}" ;
 *     sioc:link <{{ link }}> ;
 *     dc:date "{{ published }}"^^xsd:dateTime .
 * ```
 *
 * #### __*Tests*__
 * * See src/apps/test/rdfbuilder-test/
 */
class RDFBuilder extends Processor {
    constructor(config) {
        super(config)
        nunjucks.configure({ autoescape: false }) // RDF needs manual escaping
    }

    async process(message) {
        logger.debug('RDFBuilder.process')

        // Skip if spawning completion
        if (message.done) {
            return this.emit('message', message)
        }

        try {
            // Get configuration
            const templateFilename = super.getProperty(ns.trn.templateFilename, null)
            const templateString = super.getProperty(ns.trn.template, null)
            const dataField = super.getProperty(ns.trn.dataField, null)
            const outputField = super.getProperty(ns.trn.outputField, 'rdf')
            const baseURI = super.getProperty(ns.trn.baseURI, 'http://hyperdata.it/')

            // Get template
            let template
            if (templateFilename) {
                const fs = await import('fs/promises')
                const path = await import('path')
                const templatePath = path.resolve(message.rootDir || message.appPath || '.', templateFilename)
                logger.debug(`RDFBuilder: Loading template from ${templatePath}`)
                template = await fs.readFile(templatePath, 'utf-8')
            } else if (templateString) {
                template = templateString
            } else {
                logger.error('RDFBuilder: No template provided')
                message.rdfError = 'No template specified'
                return this.emit('message', message)
            }

            // Get data to template
            const data = dataField ? message[dataField] : message

            // Build template context with helpers
            const context = {
                ...data,
                baseURI: baseURI,
                // Helper functions
                uri: this.uriHelper,
                hash: this.hashHelper,
                escape: this.escapeHelper,
                now: () => new Date().toISOString(),
                isoDate: this.isoDateHelper
            }

            // Render template
            const rdf = nunjucks.renderString(template, context)

            // Store result
            message[outputField] = rdf

            logger.debug(`RDFBuilder: Generated RDF, length: ${rdf.length}`)

            return this.emit('message', message)

        } catch (error) {
            logger.error(`RDFBuilder: Error building RDF - ${error.message}`)
            message.rdfError = error.message
            return this.emit('message', message)
        }
    }

    /**
     * Convert string to URI-safe format
     */
    uriHelper(str) {
        if (!str) return ''
        return String(str)
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9\-_]/g, '')
            .toLowerCase()
    }

    /**
     * Generate short hash from string
     */
    hashHelper(str) {
        if (!str) return 'unknown'
        return crypto.createHash('md5').update(String(str)).digest('hex').substring(0, 8)
    }

    /**
     * Escape RDF literal strings
     */
    escapeHelper(str) {
        if (!str) return ''
        return String(str)
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
    }

    /**
     * Convert date string to ISO 8601 format
     * Handles RFC 2822, ISO 8601, and other common formats
     */
    isoDateHelper(str) {
        if (!str) return ''
        try {
            const date = new Date(str)
            if (isNaN(date.getTime())) return str // Return original if invalid
            return date.toISOString()
        } catch (error) {
            return str // Return original on error
        }
    }
}

export default RDFBuilder
