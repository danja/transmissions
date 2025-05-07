import RDFUtils from '../utils/RDFUtils.js'
import logger from '../utils/Logger.js'

class Datasets {

    constructor() {
    }

    async loadDataset(label, path) {
        logger.debug(`Datasets.loadDataset: label = ${label}, path = ${path}`)

        if (!path) {
            logger.warn(`No file path provided for ${label}, creating empty dataset`)
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