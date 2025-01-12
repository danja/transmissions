import { expect } from 'chai';
import rdf from 'rdf-ext';
import ConfigMap from '../../src/processors/rdf/ConfigMap.js';
import ns from '../../src/utils/ns.js';

describe('ConfigMap Integration Tests', () => {
    let configMap;
    let message;
    const testBasePath = '/test/base';

    beforeEach(() => {
        configMap = new ConfigMap({});
        message = {
            rootDir: testBasePath,
            dataset: rdf.dataset()
        };
    });

    function addTestData(predicates) {
        const subject = rdf.namedNode('http://hyperdata.it/transmissions/Content');
        message.dataset.add(rdf.quad(
            subject,
            ns.rdf.type,
            ns.trn.ConfigSet
        ));

        for (const [pred, obj] of Object.entries(predicates)) {
            message.dataset.add(rdf.quad(
                subject,
                ns.trn[pred],
                rdf.literal(obj)
            ));
        }
    }

    it('should resolve paths from ContentGroup', async () => {
        addTestData({
            sourceDirectory: 'content/src',
            targetDirectory: 'content/out'
        });

        await configMap.process(message);
        expect(message.contentGroup?.Content?.sourceDir).to.equal('/test/base/content/src');
        expect(message.contentGroup?.Content?.targetDir).to.equal('/test/base/content/out');
    });

    it('should preserve absolute paths', async () => {
        addTestData({
            sourceDirectory: '/abs/path/src',
            targetDirectory: '/abs/path/out'
        });

        await configMap.process(message);
        expect(message.contentGroup?.Content?.sourceDir).to.equal('/abs/path/src');
        expect(message.contentGroup?.Content?.targetDir).to.equal('/abs/path/out');
    });

    it('should handle missing paths', async () => {
        addTestData({});
        await configMap.process(message);
        expect(message.contentGroup?.Content?.sourceDir).to.be.undefined;
        expect(message.contentGroup?.Content?.targetDir).to.be.undefined;
    });

    it('should normalize paths', async () => {
        addTestData({
            sourceDirectory: 'content/../src'
        });
        await configMap.process(message);
        expect(message.contentGroup?.Content?.sourceDir).to.equal('/test/base/src');
    });
});