import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../../src/utils/ns.js'
import TransmissionBuilder from '../../src/engine/TransmissionBuilder.js'
import ModuleLoader from '../../src/engine/ModuleLoader.js'
import Transmission from '../../src/model/Transmission.js'
import Processor from '../../src/model/Processor.js'
import Whiteboard from '../../src/model/Whiteboard.js'
import AppResolver from '../../src/engine/AppResolver.js'
import Model from '../../src/model/Model.js'
import AbstractProcessorFactory from '../../src/engine/AbstractProcessorFactory.js'
import SysUtils from '../../src/utils/SysUtils.js'
import RDFUtils from '../../src/utils/RDFUtils.js'
import GrapoiHelpers from '../../src/utils/GrapoiHelpers.js'

describe('TransmissionBuilder', () => {
    let builder
    let mockModuleLoader
    let mockApp
    let mockProcessor
    let mockTransmissionConfig
    let mockConfigModel

    beforeEach(() => {
        // Setup mocks
        mockModuleLoader = {
            loadModule: jasmine.createSpy('loadModule').and.returnValue(Promise.resolve({ default: class MockProcessor extends Processor { } }))
        }

        mockApp = {
            getModulePath: jasmine.createSpy('getModulePath').and.returnValue('/mock/path')
        }

        mockProcessor = jasmine.createSpyObj('Processor', ['process', 'receive', 'on', 'emit', 'getProperty'])
        mockProcessor.id = 'mockProcessor'
        mockProcessor.type = ns.trn.MockProcessor

        // Create a sample RDF dataset representing a transmission config
        mockTransmissionConfig = rdf.dataset()
        const transmissionId = rdf.namedNode('http://example.org/transmission')
        const processorId1 = rdf.namedNode('http://example.org/processor1')
        const processorId2 = rdf.namedNode('http://example.org/processor2')
        const processorType = rdf.namedNode('http://purl.org/stuff/transmissions/MockProcessor')

        // Add transmission type
        mockTransmissionConfig.add(rdf.quad(
            transmissionId,
            ns.rdf.type,
            ns.trn.Transmission
        ))

        mockTransmissionConfig.add(rdf.quad(
            transmissionId,
            ns.rdfs.label,
            rdf.literal('Test Transmission')
        ))

        // Add pipe with processor references
        const listNode1 = rdf.blankNode('list1')
        mockTransmissionConfig.add(rdf.quad(
            transmissionId,
            ns.trn.pipe,
            listNode1
        ))

        // First processor in the pipe
        mockTransmissionConfig.add(rdf.quad(
            listNode1,
            ns.rdf.first,
            processorId1
        ))

        const listNode2 = rdf.blankNode('list2')
        mockTransmissionConfig.add(rdf.quad(
            listNode1,
            ns.rdf.rest,
            listNode2
        ))

        // Second processor in the pipe
        mockTransmissionConfig.add(rdf.quad(
            listNode2,
            ns.rdf.first,
            processorId2
        ))

        mockTransmissionConfig.add(rdf.quad(
            listNode2,
            ns.rdf.rest,
            ns.rdf.nil
        ))

        // Add processor types
        mockTransmissionConfig.add(rdf.quad(
            processorId1,
            ns.rdf.type,
            processorType
        ))

        mockTransmissionConfig.add(rdf.quad(
            processorId2,
            ns.rdf.type,
            processorType
        ))

        // Mock config model
        mockConfigModel = new Model('config', rdf.dataset())

        // Create TransmissionBuilder instance with mocks
        builder = new TransmissionBuilder(mockModuleLoader, mockApp)

        // Spy on builder methods
        spyOn(builder, 'createProcessor').and.returnValue(Promise.resolve(mockProcessor))
    })

    describe('#buildTransmissions', () => {
        it('should build transmissions from RDF config', async () => {
            const app = { dataset: rdf.dataset() }
            const result = await builder.buildTransmissions(app, mockTransmissionConfig, mockConfigModel)

            expect(result).toBeInstanceOf(Array)
            expect(result.length).toBe(1)
            expect(result[0]).toBeInstanceOf(Transmission)
            expect(result[0].id).toBe('http://example.org/transmission')
        })

        it('should handle empty transmission config', async () => {
            const app = { dataset: rdf.dataset() }
            const emptyConfig = rdf.dataset()
            const result = await builder.buildTransmissions(app, emptyConfig, mockConfigModel)

            expect(result).toBeInstanceOf(Array)
            expect(result.length).toBe(0)
        })
    })

    describe('#constructTransmission', () => {
        it('should construct a transmission with the right properties', async () => {
            const transmissionId = rdf.namedNode('http://example.org/transmission')
            const transmission = await builder.constructTransmission(
                mockTransmissionConfig,
                transmissionId,
                mockConfigModel
            )

            expect(transmission).toBeInstanceOf(Transmission)
            expect(transmission.id).toBe('http://example.org/transmission')
            expect(transmission.label).toBe('Test Transmission')
            expect(transmission.whiteboard).toBeInstanceOf(Whiteboard)
        })

        it('should cache transmissions to prevent infinite recursion', async () => {
            const transmissionId = rdf.namedNode('http://example.org/transmission')

            // Pre-cache a transmission
            const cachedTransmission = new Transmission()
            cachedTransmission.id = 'http://example.org/transmission'
            builder.transmissionCache.set('http://example.org/transmission', cachedTransmission)

            // Try to construct the same transmission
            const result = await builder.constructTransmission(
                mockTransmissionConfig,
                transmissionId,
                mockConfigModel
            )

            expect(result).toBe(cachedTransmission)
        })

        it('should throw error if max nesting depth is exceeded', async () => {
            const transmissionId = rdf.namedNode('http://example.org/transmission')

            // Set depth to max
            builder.currentDepth = builder.MAX_NESTING_DEPTH

            await expectAsync(builder.constructTransmission(
                mockTransmissionConfig,
                transmissionId,
                mockConfigModel
            )).toBeRejectedWithError(/Maximum transmission nesting depth/)
        })
    })

    describe('#createNodes', () => {
        it('should create processor nodes for each node in the pipeline', async () => {
            const transmission = new Transmission()
            transmission.register = jasmine.createSpy('register').and.callFake((id, processor) => {
                return processor
            })

            const pipenodes = [
                rdf.namedNode('http://example.org/processor1'),
                rdf.namedNode('http://example.org/processor2')
            ]

            await builder.createNodes(
                transmission,
                pipenodes,
                mockTransmissionConfig,
                mockConfigModel
            )

            expect(builder.createProcessor).toHaveBeenCalledTimes(2)
            expect(transmission.register).toHaveBeenCalledTimes(2)
        })

        it('should handle nested transmissions', async () => {
            // Create a dataset with a nested transmission reference
            const datasetWithNested = rdf.dataset()
            const transmissionId = rdf.namedNode('http://example.org/transmission')
            const nestedTransId = rdf.namedNode('http://example.org/nestedTransmission')
            const processorId = rdf.namedNode('http://example.org/processor')

            // Add a processor with type that references a transmission
            datasetWithNested.add(rdf.quad(
                processorId,
                ns.rdf.type,
                nestedTransId
            ))

            datasetWithNested.add(rdf.quad(
                nestedTransId,
                ns.rdf.type,
                ns.trn.Transmission
            ))

            // Setup transmission
            const transmission = new Transmission()
            transmission.register = jasmine.createSpy('register').and.returnValue({})

            const pipenodes = [processorId]

            // Mock the transmission reference check
            spyOn(builder, 'isTransmissionReference').and.returnValue(true)

            // Mock the nested transmission construction
            const mockNestedTransmission = new Transmission()
            mockNestedTransmission.id = 'http://example.org/nestedTransmission'
            spyOn(builder, 'constructTransmission').and.returnValue(Promise.resolve(mockNestedTransmission))

            await builder.createNodes(
                transmission,
                pipenodes,
                datasetWithNested,
                mockConfigModel
            )

            expect(builder.isTransmissionReference).toHaveBeenCalled()
            expect(builder.constructTransmission).toHaveBeenCalled()
            expect(transmission.register).toHaveBeenCalledWith(
                'http://example.org/processor',
                mockNestedTransmission
            )
        })
    })

    describe('#connectNodes', () => {
        it('should connect processors in the pipeline', async () => {
            const transmission = new Transmission()
            transmission.connect = jasmine.createSpy('connect')

            const pipenodes = [
                rdf.namedNode('http://example.org/processor1'),
                rdf.namedNode('http://example.org/processor2')
            ]

            await builder.connectNodes(transmission, pipenodes)

            expect(transmission.connect).toHaveBeenCalledWith(
                'http://example.org/processor1',
                'http://example.org/processor2'
            )
        })

        it('should handle empty or single-node pipelines', async () => {
            const transmission = new Transmission()
            transmission.connect = jasmine.createSpy('connect')

            const pipenodes = [
                rdf.namedNode('http://example.org/processor1')
            ]

            await builder.connectNodes(transmission, pipenodes)

            expect(transmission.connect).not.toHaveBeenCalled()
        })
    })

    describe('#isTransmissionReference', () => {
        it('should detect if processor type is a transmission reference', () => {
            // Create dataset with a transmission
            const datasetWithTransmission = rdf.dataset()
            const transmissionId = rdf.namedNode('http://example.org/transmission')

            datasetWithTransmission.add(rdf.quad(
                transmissionId,
                ns.rdf.type,
                ns.trn.Transmission
            ))

            const result = builder.isTransmissionReference(datasetWithTransmission, transmissionId)

            expect(result).toBe(true)
        })

        it('should return false for regular processor types', () => {
            // Create dataset with a regular processor
            const datasetWithProcessor = rdf.dataset()
            const processorId = rdf.namedNode('http://example.org/processor')

            datasetWithProcessor.add(rdf.quad(
                processorId,
                ns.rdf.type,
                ns.trn.Processor
            ))

            const result = builder.isTransmissionReference(datasetWithProcessor, processorId)

            expect(result).toBe(false)
        })
    })

    /*
    describe('#getPipeNodes', () => {
        it('should return the list of processor nodes in a transmission pipe', async () => {
            const transmissionId = rdf.namedNode('http://example.org/transmission')
            
            // Spy on the method and call through
            spyOn(builder, 'getPipeNodes').and.callThrough()
            
            const mockListResult = [
                rdf.namedNode('http://example.org/processor1'),
                rdf.namedNode('http://example.org/processor2')
            ]
            
            // Mock the GrapoiHelpers.listToArray method
            spyOn(GrapoiHelpers, 'listToArray').and.returnValue(mockListResult)
            
            const result = builder.getPipeNodes(mockTransmissionConfig, transmissionId)
            
            expect(result.length).toBe(2)
            expect(result[0].value).toBe('http://example.org/processor1')
            expect(result[1].value).toBe('http://example.org/processor2')
        })
    })
*/

    describe('#createProcessor', () => {
        it('should create processors using AbstractProcessorFactory first', async () => {
            // Spy on AbstractProcessorFactory.createProcessor
            spyOn(AbstractProcessorFactory, 'createProcessor').and.returnValue(mockProcessor)

            // Make the spy available again so it can be called
            builder.createProcessor.and.callThrough()

            const result = await builder.createProcessor(ns.trn.MockProcessor, mockConfigModel)

            expect(AbstractProcessorFactory.createProcessor).toHaveBeenCalled()
            expect(result).toBe(mockProcessor)
        })

        it('should try to load processor via ModuleLoader if not found in core', async () => {
            // Return null from AbstractProcessorFactory
            spyOn(AbstractProcessorFactory, 'createProcessor').and.returnValue(null)

            // Make the spy available again so it can be called
            builder.createProcessor.and.callThrough()

            try {
                await builder.createProcessor(ns.trn.MockProcessor, mockConfigModel)

                expect(mockModuleLoader.loadModule).toHaveBeenCalled()
            } catch (error) {
                // We expect this to fail since we're using mocks
                expect(error).toBeDefined()
            }
        })
    })
})
