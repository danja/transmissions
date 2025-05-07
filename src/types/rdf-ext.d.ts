import { DatasetCore } from '@rdfjs/types'

/**
 * RDF-Ext Dataset type
 */
export interface Dataset extends DatasetCore {
    // Add any additional methods or properties specific to rdf-ext's implementation
    add(triple: Triple): this
    delete(triple: Triple): this
    clear(): this
    size: number
    [Symbol.iterator](): Iterator<Triple>
}

/**
 * RDF-Ext Triple type
 */
export interface Triple {
    subject: Term
    predicate: Term
    object: Term
    graph?: Term
}

/**
 * RDF-Ext Term base type
 */
export interface Term {
    termType: string
    value: string
    equals(other: Term): boolean
}

/**
 * RDF-Ext Named Node type
 */
export interface NamedNode extends Term {
    iri: string
}

/**
 * RDF-Ext Literal type
 */
export interface Literal extends Term {
    datatype: NamedNode
    language?: string
}

/**
 * RDF-Ext Blank Node type
 */
export interface BlankNode extends Term {
    id: string
}

/**
 * RDF-Ext Default Graph type
 */
export interface DefaultGraph extends Term {
    equals(other: Term): boolean
}

/**
 * RDF-Ext Factory type
 */
export interface Factory {
    namedNode(iri: string): NamedNode
    literal(value: string, languageOrDatatype?: string | NamedNode): Literal
    blankNode(id?: string): BlankNode
    defaultGraph(): DefaultGraph
    quad(subject: Term, predicate: Term, object: Term, graph?: Term): Triple
    dataset(): Dataset
}

/**
 * RDF-Ext types for the rdf-ext module
 */
export interface RDFExt {
    factory: Factory
    dataset(): Dataset
    quad(subject: Term, predicate: Term, object: Term, graph?: Term): Triple
    namedNode(iri: string): NamedNode
    literal(value: string, languageOrDatatype?: string | NamedNode): Literal
    blankNode(id?: string): BlankNode
    defaultGraph(): DefaultGraph
}

// Export the main rdf-ext type
declare const rdf: RDFExt

export default rdf
