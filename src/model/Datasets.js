import RDFUtils from '../utils/RDFUtils.js'
import logger from '../utils/Logger.js'

class Datasets {

    constructor() {
        this.datasets = new Map()
    }

    async loadDataset(label, path) {
        logger.debug(`Datasets.loadDataset: label = ${label}, path = ${path}`)

        if (!path) {
            logger.warn(`No file path provided for ${label}, creating empty dataset`)
            const emptyDataset = RDFUtils.createEmptyDataset()
            this.datasets.set(label, emptyDataset)
            return emptyDataset
        }

        try {
            const ru = new RDFUtils()
            const dataset = await ru.readDataset(path)
            this.datasets.set(label, dataset)
            logger.log(`Datasets.loadDataset : loaded dataset ${label} from ${path}`)
            return dataset
        } catch (error) {
            logger.warn(`Error loading dataset ${label} from ${path}: ${error.message}`)
            logger.debug('Creating empty dataset instead')
            const emptyDataset = RDFUtils.createEmptyDataset()
            this.datasets.set(label, emptyDataset)
            return emptyDataset
        }
    }

    dataset(label) {
        const dataset = this.datasets.get(label)
        if (!dataset) {
            logger.warn(`No dataset found for label: ${label}`)
            return RDFUtils.createEmptyDataset()
        }
        return dataset
    }

    toString() {
        return `*** Datasets *** ${logger.reveal(this)}`
    }
}

export default Datasets