import path from 'path';
import { fileURLToPath } from 'url';
import TransmissionBuilder from '../../../transmissions/src/engine/TransmissionBuilder.js';
import ModuleLoaderFactory from './processors/_ModuleLoaderFactory.js';
import logger from '../../../transmissions/src/utils/Logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    logger.setLogLevel('debug');

    const transmissionConfigFile = path.join(__dirname, 'transmissions.ttl');
    const processorsConfigFile = path.join(__dirname, 'services-config.ttl');

    try {
        const moduleLoader = ModuleLoaderFactory.createModuleLoader();
        const transmissions = await TransmissionBuilder.build(transmissionConfigFile, processorsConfigFile, moduleLoader);

        const message = {
            first: 'one',
            second: 'two'
        };

        for (const transmission of transmissions) {
            await transmission.execute(message);
        }
    } catch (error) {
        logger.error('Error:', error);
        logger.debug('Error details:', error.stack);
    }
}

main().catch(console.error);