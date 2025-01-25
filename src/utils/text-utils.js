/**
 * Utility functions for escaping text content in Turtle RDF
 * @module TextUtils
 */

/**
 * Escapes a string literal for use in Turtle RDF
 * Handles quotes, backslashes, line breaks per RDF 1.1 Turtle spec
 * @param {string} str The input string to escape
 * @returns {string} The escaped string
 */
/**
 * Regular expression for validating BCP47 language tags
 * Supports basic language tags like 'en', 'en-US', 'zh-Hans' etc.
 */
const LANGUAGE_TAG_REGEX = /^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$/;

/**
 * Validates a language tag according to BCP47 rules
 * @param {string} langTag Language tag to validate
 * @returns {boolean} True if valid
 */
export function isValidLanguageTag(langTag) {
    return LANGUAGE_TAG_REGEX.test(langTag);
}

/**
 * Creates a Turtle string literal with optional language tag or datatype
 * @param {string} str The string value
 * @param {Object} options Configuration options
 * @param {string} [options.language] Language tag (BCP47)
 * @param {string} [options.datatype] Datatype IRI
 * @returns {string} Formatted Turtle literal
 */
export function escapeStringLiteral(str, options = {}) {
    if (!str) return '';
    
    const escaped = str.includes('\n') 
        ? `"""${str.replace(/"""/g, '\\"\\"\\"')
                 .replace(/\\/g, '\\\\')
                 .replace(/\r/g, '\\r')
                 .replace(/\t/g, '\\t')}"""`
        : `"${str.replace(/"/g, '\\"')
               .replace(/\\/g, '\\\\')
               .replace(/\r/g, '\\r')
               .replace(/\n/g, '\\n')
               .replace(/\t/g, '\\t')}"`;
               
    if (options.language && isValidLanguageTag(options.language)) {
        return `${escaped}@${options.language.toLowerCase()}`;
    }
    
    if (options.datatype) {
        return `${escaped}^^${options.datatype}`;
    }
    
    return escaped;
}

/**
 * Escapes an IRI for use in Turtle RDF
 * Handles characters not allowed in IRIs per RFC 3987
 * @param {string} iri The IRI to escape
 * @returns {string} The escaped IRI
 */
export function escapeIRI(iri) {
    if (!iri) return '';
    
    return iri.replace(/[\x00-\x20<>"{}|^`\\]/g, (char) => {
        return `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`;
    });
}

/**
 * Escapes a local name for use in Turtle RDF prefixed names
 * Handles special characters in local names per RDF 1.1 Turtle spec
 * @param {string} localName The local name to escape
 * @returns {string} The escaped local name
 */
export function escapeLocalName(localName) {
    if (!localName) return '';
    
    return localName.replace(/[~.!$&'()*+,;=/?#@%_-]/g, '\\$&');
}

/**
 * Validates if a string is a valid xsd:dateTime
 * @param {string} dateStr The date string to validate
 * @returns {boolean} True if valid xsd:dateTime format
 */
export function isValidDateTime(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    return regex.test(dateStr);
}

/**
 * Clean and normalize a string for use as a URL slug
 * @param {string} str The input string
 * @returns {string} URL-safe slug
 */
export function createSlug(str) {
    return str.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Validates a URL string
 * @param {string} url The URL to validate
 * @returns {boolean} True if valid URL
 */
export function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}