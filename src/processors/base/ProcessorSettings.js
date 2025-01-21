import { log } from 'console';
import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';

class ProcessorSettings {
    constructor(config) {
        this.config = config;
        //   this.settingsNode = null;
    }

    /*
    async getValues(property, fallback = undefined) {
        if (!this.config?.dataset || !this.settingsNode) {
            return fallback ? [fallback] : [];
        }

        const values = [];
        const dataset = this.config.dataset;


        /*
        // Check plural form (e.g., excludePatterns)
        const pluralProperty = property.value.replace('Pattern', 'Patterns');
        const pluralNode = ns.trn[pluralProperty];

        for (const quad of dataset.match(this.settingsNode, pluralNode)) {
            const patterns = quad.object.value.split(',').map(p => p.trim()).filter(p => p);
            values.push(...patterns);
        }

        if (values.length > 0) {
            return values;
        }

        // Check singular form (e.g., excludePattern)
        for (const quad of dataset.match(this.settingsNode, property)) {
            values.push(quad.object.value);
        }

        if (values.length > 0) {
            return values;
        }

        // Check referenced settings
        for (const settingsQuad of dataset.match(this.settingsNode, ns.trn.settings)) {
            const settingsId = settingsQuad.object;
            for (const quad of dataset.match(settingsId, property)) {
                values.push(quad.object.value);
            }
            if (values.length > 0) {
                break;
            }
        }

        return values.length > 0 ? values : (fallback ? [fallback] : []);
    }
*/
    async getValues(property, fallback = undefined) {
        return this.getPropertyFromSettings(property) || (fallback ? [fallback] : []);
    }

    getPropertyFromSettings(property) {
        logger.debug(`ProcessorSettings.getPropertyFromSettings, property = ${property}`)
        logger.debug(`ProcessorSettings.getPropertyFromSettings, this.settingsNode = ${this.settingsNode}`)
        if (!this.config) {
            logger.debug('--- this.config missing ---')
            return undefined
        }
        if (!this.settingsNode) {
            logger.debug('this.settingsNode missing')
            return undefined
        }

        // TODO GET PROPERTY FROM DATASET
        const dataset = this.config
        const ptr = grapoi({ dataset, term: this.settingsNode })

        logger.log(`Checking property ${property} on node ${this.settingsNode.value}`)
        let values = ptr.out(property)
        if (values.terms.length > 0) {
            logger.debug(`Found direct property value: ${values.term.value}`)
            return values.term
        }
        logger.debug('No direct property found')

        // Debug full path
        //     logger.debug(`Dataset: ${[...dataset].map(q => `${q.subject.value} ${q.predicate.value} ${q.object.value}`).join('\n')}`)

        const settings = ptr.out(ns.trn.settings)
        logger.debug(`Settings query result: ${settings?.terms?.length} terms`)
        if (settings.terms.length > 0) {
            const settingsId = settings.term
            logger.debug(`Found settings reference: ${settingsId.value}`)

            const settingsPtr = grapoi({ dataset, term: settingsId })
            const settingsValues = settingsPtr.out(property)
            if (settingsValues.terms.length > 0) {
                logger.debug(`Found settings property value: ${settingsValues.term.value}`)
                return settingsValues.term
            }
            logger.debug('No property found in settings')
        }
        logger.debug('No settings reference found')
        return undefined
    }

    async getValue(property, fallback = undefined) {
        const values = await this.getValues(property, fallback);
        logger.log(`ProcessorSettings.getValue, values = ${values}`);
        return values.length > 0 ? values[0] : fallback;
    }

    toString() {
        const settingsNodeValue = this.settingsNode ? this.settingsNode.value : 'none';
        logger.reveal(this.settingsNode);
        return `ProcessorSettings, settingsNode = ${settingsNodeValue}`;
    }
}

export default ProcessorSettings;