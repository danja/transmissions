import rdf from 'rdf-ext'

import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'
// import Transmission from './Transmission.js'

class Application {
    constructor() {
        this.datas = rdf.dataset()
        this.dummy = 'dummy'
        this.datas.add(rdf.quad(
            rdf.namedNode(`http://purl.org/stuff/transmissions/dummy`),
            ns.rdf.type,
            ns.trn.Application
        ))
    }

    async initDataset(appName, sessionNode = rdf.blankNode()) {

        // TODO validate syntax of appName
        this.appNode = rdf.namedNode(`http://purl.org/stuff/transmissions/${appName}`)
        this.sessionNode = sessionNode

        this.datas.add(rdf.quad(
            this.appNode,
            ns.rdf.type,
            ns.trn.Application
        ))

        this.datas.add(rdf.quad(
            this.sessionNode,
            ns.rdf.type,
            ns.trn.ApplicationSession
        ))

        this.datas.add(rdf.quad(
            this.sessionNode,
            ns.trn.application,
            this.appNode
        ))
    }

    async mergeIn(dataset) {
        /*
        logger.log('--------------------MERGEIN----------------')
        logger.log(dataset)
        logger.reveal(dataset)
        logger.log(this.dataset)
        logger.reveal(this.dataset)
        logger.log('--------------^^^^^^^^^^^^^^^^^^^^-')
        */
        this.datas.addAll(dataset)
        /*
        logger.log('--------------------MERGEDDDDDDDDDDDDD----------------')
        logger.log(this.datas)
        logger.reveal(this.dataset)
        logger.log('---------------^^^^^^^^^^^^^^D----------------')
    */
    }

    toString() {
        return this.datas.toString()
    }
}
export default Application
