import rdf from 'rdf-ext'



const ns = {
    rdf: rdf.namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
    rdfs: rdf.namespace('http://www.w3.org/2000/01/rdf-schema#'),
    dc: rdf.namespace('http://purl.org/dc/terms/'),
    schema: rdf.namespace('http://schema.org/'),
    xsd: rdf.namespace('http://www.w3.org/2001/XMLSchema#'),
    trn: rdf.namespace('http://purl.org/stuff/transmissions/'),
    //  t: rdf.namespace('http://hyperdata.it/transmissions/'),
    //  fs: rdf.namespace('http://purl.org/stuff/filesystem/'),
    //pc: rdf.namespace('http://purl.org/stuff/postcraft/')
}

// TODO wrap this into ns and/or use whatever rdf-ext, rdfjs built-in is available
ns.prefixMap = {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#": "rdf:",
    "http://www.w3.org/2000/01/rdf-schema#": "rdfs:",
    "http://purl.org/dc/terms/": "dc:",
    "http://schema.org/": "schema:",
    "http://www.w3.org/2001/XMLSchema#": "xsd",
    "http://purl.org/stuff/transmissions/": ":",
    "<": "",
    ">": ""
}

//ns.getPrefix = function (nsObj) {
//  return Object.keys(nsObj)[0];
//}

ns.shortName = ns.getShortname = function (url) { // I keep mixing up the name

    if (!url) return
    url = url.toString()
    const lastSlashIndex = url.lastIndexOf('/')
    const lastHashIndex = url.lastIndexOf('#')
    const path = url.slice(lastSlashIndex + 1)
    return path.split('#')[0].split('?')[0]
}
export default ns