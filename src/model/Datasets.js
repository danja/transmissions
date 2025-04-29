import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../utils/ns.js'
import RDFUtils from '../utils/RDFUtils.js'
import logger from '../utils/Logger.js'
import GrapoiHelpers from '../utils/GrapoiHelpers.js'

/** 
 * Wrapper around dataset REFACTORHERE
 */
class Datasets {

    constructor() {
        const datasets = {}
    }

    async loadDataset(label, path) {
        logger.debug(`   loadModel, 
        label = ${label}
        path = ${path}`)
        // process.exit()
        //   const dataset = await RDFUtils.readDataset(path)
        const ru = new RDFUtils()
        const dataset = await ru.readDataset(path)
        this[label] = dataset
        return dataset
    }

    async dataset(label) {
        return this[label]
    }
}
export default Datasets