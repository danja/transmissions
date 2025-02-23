import rdf from 'rdf-ext'

import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'
// import Transmission from './Transmission.js'

class Application {
    constructor(sessionNode = rdf.blankNode()) {
        this.dataset = rdf.dataset()
        this.sessionNode = sessionNode
    }

    async initDataset(appName) {
        const appNode = rdf.namedNode(`http://purl.org/stuff/transmissions/${appName}`)

        this.dataset.add(rdf.quad(
            appNode,
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
            appNode
        ))

        //  return sessionNode
    }

    async mergeIn(dataset) {
        this.dataset.addAll(dataset)
    }

    toString() {
        return this.dataset.toString()
    }
}
export default Application
