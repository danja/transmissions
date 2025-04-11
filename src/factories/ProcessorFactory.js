import AbstractProcessorFactory from '../engine/AbstractProcessorFactory.js';
import logger from '../utils/Logger.js';

export async function createProcessor(type, configModel, moduleLoader) {
    logger.debug(`ProcessorFactory.createProcessor, config = ${configModel}`);

    const coreProcessor = AbstractProcessorFactory.createProcessor(type, configModel.dataset);
    if (coreProcessor) {
        coreProcessor.configModel = configModel;
        return coreProcessor;
    }

    logger.debug(`ProcessorFactory, core processor not found for ${type?.value}. Trying remote module loader...`);

    try {
        const shortName = type.value.split('/').pop();
        logger.debug(`ProcessorFactory, loading module: ${shortName}`);
        const ProcessorClass = await moduleLoader.loadModule(shortName);

        logger.debug(`Module loaded successfully: ${shortName}`);
        const moduleProcessor = new ProcessorClass.default(configModel.dataset);
        moduleProcessor.configModel = configModel;
        return moduleProcessor;
    } catch (error) {
        logger.error(`ProcessorFactory.createProcessor, failed to load ${type?.value} : ${error.message}`);
        throw error;
    }
}
