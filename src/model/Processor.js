import ProcessorImpl from '../engine/ProcessorImpl.js'

/**
 * Interface for Processor implementations
 * @extends ProcessorImpl
 */
class Processor extends ProcessorImpl {
    /**
     * Creates a new Processor instance
     * @param {Dataset} configDataset - RDF dataset containing configuration
     */
    constructor(app) {
        super(app.configDataset) // TODO pass app instead
        this.app = app
    }

    async process(message) {
        return super.process(message)
    }

    /**
     * Gets multiple values for a property from settings
     * @param {Term} property - RDF property to retrieve
     * @param {any} fallback - Default value if property not found
     * @returns {Array<string>} Array of property values
     */
    getValues(property, fallback) {
        return super.getValues(property, fallback)
    }

    /**
     * Gets a single property value from settings
     * @param {Term} property - RDF property to retrieve
     * @param {any} fallback - Default value if property not found
     * @returns {string|Array<string>|undefined} Property value(s) or fallback
     */
    getProperty(property, fallback) {
        return super.getProperty(property, fallback)
    }
}

export default Processor