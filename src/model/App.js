import rdf from 'rdf-ext'

import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'
// import Transmission from './Transmission.js'

class App {
    constructor() {
        this.targetDataset = rdf.dataset()
        this.dummy = 'dummy'
        this.targetDataset.add(rdf.quad(
            rdf.namedNode(`http://purl.org/stuff/transmissions/dummy`),
            ns.rdf.type,
            ns.trn.App
        ))

        // refactor to :
        this.transmissionsModel = null
        this.appModel = null
        this.configModel = null

    }

    async initDataset(appName, sessionNode = rdf.blankNode()) {

        // TODO validate syntax of appName
        this.appNode = rdf.namedNode(`http://purl.org/stuff/transmissions/${appName}`)
        this.sessionNode = sessionNode

        this.targetDataset.add(rdf.quad(
            this.appNode,
            ns.rdf.type,
            ns.trn.App
        ))

        this.targetDataset.add(rdf.quad(
            this.sessionNode,
            ns.rdf.type,
            ns.trn.AppSession
        ))

        this.targetDataset.add(rdf.quad(
            this.sessionNode,
            ns.trn.app,
            this.appNode
        ))
    }

    async mergeIn(dataset) {
        /*
        logger.log('--------------------MERGEIN----------------')
        logger.log(dataset)
        logger.reveal(dataset)
        logger.log(this.targetDataset)
        logger.reveal(this.targetDataset)
        logger.log('--------------^^^^^^^^^^^^^^^^^^^^-')
        */
        this.targetDataset.addAll(dataset)
        /*
        logger.log('--------------------MERGEDDDDDDDDDDDDD----------------')
        logger.log(this.targetDataset)
        logger.reveal(this.targetDataset)
        logger.log('---------------^^^^^^^^^^^^^^D----------------')
    */
    }

    toString() {
        return `\n *** App ***
        this =  \n     ${JSON.stringify(this).replaceAll(',', ',\n      ')}`
    }
}
export default App
