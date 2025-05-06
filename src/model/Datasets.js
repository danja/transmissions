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
        logger.debug(`Datasets.loadDataset: label = ${label}, path = ${path}`)
        
        if (!path) {
            logger.warn(`No path provided for dataset ${label}, creating empty dataset`)
            const emptyDataset = RDFUtils.createEmptyDataset()
            this[label] = emptyDataset
            return emptyDataset
        }
        
        try {
            const ru = new RDFUtils()
            const dataset = await ru.readDataset(path)
            this[label] = dataset
            return dataset
        } catch (error) {
            logger.warn(`Error loading dataset ${label} from ${path}: ${error.message}`)
            logger.debug('Creating empty dataset instead')
            const emptyDataset = RDFUtils.createEmptyDataset()
            this[label] = emptyDataset
            return emptyDataset
        }
    }

    async dataset(label) {
        return this[label]
    }
}
export default Datasets