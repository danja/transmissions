import { expect } from 'chai'
import rdf from 'rdf-ext'
import TestSettings from '../../src/processors/test/TestSettings.js'
import ns from '../../src/utils/ns.js'

describe('TestSettings', () => {
    let settings
    let config
    let dataset

    beforeEach(() => {
        dataset = rdf.dataset()
        config = { dataset }
        settings = new TestSettings(config)
    })

    function addTestData(subject, predicates) {
        const subjectTerm = rdf.namedNode(`http://example.org/${subject}`)
        config.dataset.add(rdf.quad(
            subjectTerm,
            ns.rdf.type,
            ns.trn.ConfigSet
        ))

        for (const [pred, values] of Object.entries(predicates)) {
            if (Array.isArray(values)) {
                values.forEach(value => {
                    config.dataset.add(rdf.quad(
                        subjectTerm,
                        ns.trn[pred],
                        rdf.literal(value)
                    ))
                })
            } else {
                config.dataset.add(rdf.quad(
                    subjectTerm,
                    ns.trn[pred],
                    rdf.literal(values)
                ))
            }
        }
        return subjectTerm
    }

    describe('process()', () => {
        it('should process message with direct settings', async () => {
            const subject = addTestData('test1', {
                name: 'Test Name',
                value: '42'
            })
            settings.settingsNode = subject

            const message = {}
            const result = await settings.process(message)
            
            expect(result).to.exist
            const name = settings.getProperty(ns.trn.name)
            expect(name).to.equal('Test Name')
        })

        it('should handle settings with multiple values', async () => {
            const subject = addTestData('test2', {
                setting: ['value1', 'value2', 'value3']
            })
            settings.settingsNode = subject

            const message = {}
            const result = await settings.process(message)
            
            const values = settings.getValues(ns.trn.setting)
            expect(values).to.have.length(3)
            expect(values).to.include('value1')
        })

        it('should handle message without settings', async () => {
            const message = {}
            const result = await settings.process(message)
            expect(result).to.exist
        })

        it('should preserve message properties', async () => {
            const subject = addTestData('test3', {
                name: 'Test'
            })
            settings.settingsNode = subject

            const message = {
                existingProp: 'value'
            }
            const result = await settings.process(message)
            
            expect(result.existingProp).to.equal('value')
        })
    })
})
