import rdf from 'rdf-ext'

import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'
import Datasets from './Datasets.js'
// import Transmission from './Transmission.js'

class App {
    constructor() {
        this.datasets = new Datasets()
        /*
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
*/
    }

    static #instance = null;

    static instance() {
        if (!App.#instance) {
            App.#instance = new App()
        }
        return App.#instance
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
        const datasetsInfo = Array.from(this.datasets.datasets.entries())
            .map(([label, dataset]) => `${label}: ${dataset.size} triples`)
            .join(',\n      ')
        const otherProps = JSON.stringify(this)
            .replace(/"datasets":{.*?}/, '') // Remove the datasets object
            .replaceAll(',', ',\n      ')
        return `\n *** App *** ${otherProps}\n      datasets: {\n      ${datasetsInfo}\n      }`
    }
}
export default App
