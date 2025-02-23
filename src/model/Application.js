import rdf from 'rdf-ext'

import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'
// import Transmission from './Transmission.js'

class Application {
    constructor() {
        this.dataset = rdf.dataset()
    }

    async initDataset(appName) {
        const appNode = rdf.namedNode(`http://purl.org/stuff/transmissions/${appName}`)
        const sessionNode = rdf.blankNode()

        this.dataset.add(rdf.quad(
            appNode,
            ns.rdf.type,
            ns.trn.Application
        ))

        this.dataset.add(rdf.quad(
            sessionNode,
            ns.rdf.type,
            ns.trn.ApplicationSession
        ))

        this.dataset.add(rdf.quad(
            sessionNode,
            ns.trn.application,
            appNode
        ))

        // logger.log(this.dataset)
        return sessionNode
    }
}
export default Application
