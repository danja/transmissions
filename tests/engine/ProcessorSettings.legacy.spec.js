// RENAMED: legacy, out-of-sync with codebase after Jasmine->Vitest migration

import ProcessorSettings from '../../src/engine/ProcessorSettings.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../../src/utils/ns.js'
import logger from '../../src/utils/Logger.js'
import GrapoiHelpers from '../../src/utils/GrapoiHelpers.js'

describe('ProcessorSettings', () => {
    let settings
    let mockParent
    let appDataset
    let configDataset
    let transmissionConfig

    beforeEach(() => {
        // Create test datasets
        appDataset = rdf.dataset()
        configDataset = rdf.dataset()
        transmissionConfig = rdf.dataset()

        // Mock parent object
        mockParent = {
            app: {
                dataset: appDataset,
                transmissionConfig: transmissionConfig
            },
            configDataset: configDataset
        }

        // Create ProcessorSettings instance
        settings = new ProcessorSettings(mockParent)

        // Spy on logger methods
        vi.spyOn(logger, 'debug').mockImplementation(() => { })
        vi.spyOn(logger, 'trace').mockImplementation(() => { })
    })

    describe('#constructor', () => {
        it('should initialize with parent references', () => {
            expect(settings.parent).toBe(mockParent)
            expect(settings.appDataset).toBe(appDataset)
            expect(settings.transmissionConfig).toBe(transmissionConfig)
            expect(settings.configDataset).toBe(configDataset)
        })
    })

    describe('#getProperty', () => {
        it('should return fallback value if no settings node is provided', () => {
            const fallback = 'fallback value'
            const result = settings.getProperty(null, ns.trn.someProperty, fallback)

            expect(result).toBe(fallback)
        })

        it('should return a single value for properties with one value', () => {
            // Setup test data
            const settingsNode = rdf.namedNode('http://example.org/settings')
            const property = ns.trn.testProperty
            const value = rdf.literal('test value')

            // Add property to dataset
            configDataset.add(rdf.quad(
                settingsNode,
                property,
                value
            ))

            // Use getProperty
            const result = settings.getProperty(settingsNode, property, 'fallback')

            expect(result).toBe('test value')
        })

        it('should return an array for properties with multiple values', () => {
            // Setup test data
            const settingsNode = rdf.namedNode('http://example.org/settings')
            const property = ns.trn.testProperty
            const value1 = rdf.literal('value1')
            const value2 = rdf.literal('value2')

            // Add properties to dataset
            configDataset.add(rdf.quad(
                settingsNode,
                property,
                value1
            ))

            configDataset.add(rdf.quad(
                settingsNode,
                property,
                value2
            ))

            // Use getProperty
            const result = settings.getProperty(settingsNode, property, 'fallback')

            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(2)
            expect(result).toContain('value1')
            expect(result).toContain('value2')
        })
    })

    describe('#getValues', () => {
        it('should search for values in app dataset first', () => {
            // Setup test data in app dataset
            const settingsNode = rdf.namedNode('http://example.org/settings')
            const property = ns.trn.testProperty
            const value = rdf.literal('app value')

            appDataset.add(rdf.quad(
                settingsNode,
                property,
                value
            ))

            // Add different value to config dataset
            configDataset.add(rdf.quad(
                settingsNode,
                property,
                rdf.literal('config value')
            ))

            const result = settings.getValues(settingsNode, property, 'fallback')

            expect(result).toEqual(['app value'])
        })

        it('should fall back to transmission config if not in app dataset', () => {
            // Setup test data in transmission config
            const settingsNode = rdf.namedNode('http://example.org/settings')
            const property = ns.trn.testProperty
            const value = rdf.literal('transmission value')

            transmissionConfig.add(rdf.quad(
                settingsNode,
                property,
                value
            ))

            // Add different value to config dataset
            configDataset.add(rdf.quad(
                settingsNode,
                property,
                rdf.literal('config value')
            ))

            const result = settings.getValues(settingsNode, property, 'fallback')

            expect(result).toEqual(['transmission value'])
        })

        it('should fall back to config dataset if not in app or transmission datasets', () => {
            // Setup test data in config dataset
            const settingsNode = rdf.namedNode('http://example.org/settings')
            const property = ns.trn.testProperty
            const value = rdf.literal('config value')

            configDataset.add(rdf.quad(
                settingsNode,
                property,
                value
            ))

            const result = settings.getValues(settingsNode, property, 'fallback')

            expect(result).toEqual(['config value'])
        })

        it('should return fallback if property not found in any dataset', () => {
            const settingsNode = rdf.namedNode('http://example.org/settings')
            const property = ns.trn.nonExistentProperty
            const fallback = 'fallback value'

            const result = settings.getValues(settingsNode, property, fallback)

            expect(result).toEqual([fallback])
        })

        it('should handle RDF lists using GrapoiHelpers.listToArray', () => {
            // Setup a test RDF list
            const settingsNode = rdf.namedNode('http://example.org/settings')
            const property = ns.trn.listProperty

            // Mock GrapoiHelpers.listToArray
            spyOn(GrapoiHelpers, 'listToArray').and.returnValue([
                rdf.namedNode('http://example.org/item1'),
                rdf.namedNode('http://example.org/item2')
            ])

            // Special case for rename property
            const result = settings.getValues(settingsNode, ns.trn.rename, 'fallback')

            expect(GrapoiHelpers.listToArray).toHaveBeenCalled()
        })
    })

    describe('#valuesFromDataset', () => {
        it('should return undefined if dataset is null', () => {
            const settingsNode = rdf.namedNode('http://example.org/settings')
            const property = ns.trn.testProperty

            const result = settings.valuesFromDataset(null, property)

            expect(result).toBeUndefined()
        })

        it('should return values for a simple property', () => {
            // Setup test data
            const settingsNode = rdf.namedNode('http://example.org/settings')
            const property = ns.trn.testProperty
            const value = rdf.literal('test value')

            configDataset.add(rdf.quad(
                settingsNode,
                property,
                value
            ))

            settings.settingsNode = settingsNode
            const result = settings.valuesFromDataset(configDataset, property)

            expect(result).toEqual(['test value'])
        })

        it('should return multiple values for a property with multiple values', () => {
            // Setup test data
            const settingsNode = rdf.namedNode('http://example.org/settings')
            const property = ns.trn.testProperty
            const value1 = rdf.literal('value1')
            const value2 = rdf.literal('value2')

            configDataset.add(rdf.quad(
                settingsNode,
                property,
                value1
            ))

            configDataset.add(rdf.quad(
                settingsNode,
                property,
                value2
            ))

            settings.settingsNode = settingsNode
            const result = settings.valuesFromDataset(configDataset, property)

            expect(result).toEqual(['value1', 'value2'])
        })

        it('should handle errors gracefully', () => {
            // Setup test data
            const settingsNode = rdf.namedNode('http://example.org/settings')
            const property = ns.trn.testProperty

            // Intentionally cause an error
            const mockGrapoi = {
                out: vi.fn(() => { throw new Error('Test error') })
            }

            vi.spyOn(grapoi, 'grapoi').mockReturnValue(mockGrapoi)

            settings.settingsNode = settingsNode
            const result = settings.valuesFromDatasetWrapped(configDataset, property)

            expect(result).toEqual([])
        })
    })

    describe('#tryFirst', () => {
        it('should return a value when the term is part of an RDF list', () => {
            // Setup a test RDF list
            const listHead = rdf.blankNode('list1')
            const item1 = rdf.namedNode('http://example.org/item1')

            configDataset.add(rdf.quad(
                listHead,
                ns.rdf.first,
                item1
            ))

            const maybeList = {
                terms: [listHead]
            }

            const result = settings.tryFirst(configDataset, maybeList)

            expect(result).toBeDefined()
        })

        it('should return false when not an RDF list', () => {
            // Set up a non-list term
            const notAList = {
                terms: [rdf.namedNode('http://example.org/notAList')]
            }

            const result = settings.tryFirst(configDataset, notAList)

            expect(result).toBe(false)
        })
    })
})
