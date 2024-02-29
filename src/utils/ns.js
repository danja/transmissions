import rdf from 'rdf-ext'

const ns = {
    rdf: rdf.namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
    dc: rdf.namespace('http://purl.org/dc/terms/'),
    schema: rdf.namespace('http://schema.org/'),
    xsd: rdf.namespace('http://www.w3.org/2001/XMLSchema#'),
    trm: rdf.namespace('http://purl.org/stuff/transmission/'),
    t: rdf.namespace('https://hyperdata.it/treadmill/'),
    fs: rdf.namespace('http://purl.org/stuff/filesystem/')
}

export default ns