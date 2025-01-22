import { expect } from 'chai'
import rdf from 'rdf-ext'
import ProcessorSettings from '../../../src/processors/base/ProcessorSettings.js'
import ns from '../../../src/utils/ns.js'

describe('ProcessorSettings', () => {
    let settings
    let config

    beforeEach(() => {
        const dataset = rdf.dataset()
        config = { dataset }
        settings = new ProcessorSettings(config)
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

    describe('getValues()', () => {
        it('should return array with single value when one exists', () => {
            const subject = addTestData('config', {
                testProp: 'value1'
            })
            settings.settingsNode = subject

            const values = settings.getValues(ns.trn.testProp)
            expect(values).to.be.an('array').with.lengthOf(1)
            expect(values[0]).to.equal('value1')
        })

        it('should return array with multiple individual values', () => {
            const subject = addTestData('config', {
                excludePattern: ['value1', 'value2', 'value3']
            })
            settings.settingsNode = subject

            const values = settings.getValues(ns.trn.excludePattern)
            expect(values).to.be.an('array').with.lengthOf(3)
            expect(values).to.include('value1')
            expect(values).to.include('value2')
            expect(values).to.include('value3')
        })

        it('should handle comma-separated values', () => {
            const subject = addTestData('config', {
                excludePatterns: 'value1,value2, value3'
            })
            settings.settingsNode = subject

            const values = settings.getValues(ns.trn.excludePatterns)
            expect(values).to.be.an('array').with.lengthOf(3)
            expect(values).to.include('value1')
            expect(values).to.include('value2')
            expect(values).to.include('value3')
        })

        it('should handle values from referenced settings', () => {
            const refSubject = addTestData('ref', {
                testProp: ['refValue1', 'refValue2']
            })

            const mainSubject = addTestData('config', {})
            config.dataset.add(rdf.quad(
                mainSubject,
                ns.trn.settings,
                refSubject
            ))

            settings.settingsNode = mainSubject
            const values = settings.getValues(ns.trn.testProp)
            expect(values).to.be.an('array').with.lengthOf(2)
            expect(values).to.include('refValue1')
            expect(values).to.include('refValue2')
        })

        it('should return fallback in array when no values exist', () => {
            const subject = addTestData('config', {})
            settings.settingsNode = subject

            const values = settings.getValues(ns.trn.testProp, 'fallback')
            expect(values).to.be.an('array').with.lengthOf(1)
            expect(values[0]).to.equal('fallback')
        })
    })

    describe('getValue()', () => {
        it('should return first value when multiple exist', () => {
            const subject = addTestData('config', {
                testProp: ['value1', 'value2']
            })
            settings.settingsNode = subject

            const value = settings.getValue(ns.trn.testProp)
            expect(value).to.equal('value1')
        })

        it('should return fallback when no values exist', () => {
            const subject = addTestData('config', {})
            settings.settingsNode = subject

            const value = settings.getValue(ns.trn.testProp, 'fallback')
            expect(value).to.equal('fallback')
        })
    })
})