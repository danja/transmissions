import rdf from 'rdf-ext'

import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'
// import Transmission from './Transmission.js'

class Application {
    constructor() {
        this.dataset = rdf.dataset()
    }

    async initDataset(appName, sessionNode = rdf.blankNode()) {

        // TODO validate syntax of appName
        this.appNode = rdf.namedNode(`http://purl.org/stuff/transmissions/${appName}`)
        this.sessionNode = sessionNode

        this.dataset.add(rdf.quad(
            this.appNode,
            ns.rdf.type,
            ns.trn.Application
        ))

        this.dataset.add(rdf.quad(
            this.sessionNode,
            ns.rdf.type,
            ns.trn.ApplicationSession
        ))

        this.dataset.add(rdf.quad(
            this.sessionNode,
            ns.trn.application,
            this.appNode
        ))
    }

    async mergeIn(dataset) {
        this.dataset.addAll(dataset)
    }

    toString() {
        return this.dataset.toString()
    }
}
export default Application
