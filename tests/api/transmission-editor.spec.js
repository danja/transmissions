import { JSDOM } from 'jsdom'
import TransmissionEditor from '../../src/tools/nodeflow/components/TransmissionEditor.js'

// Create a browser-like environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
global.window = dom.window
global.document = dom.window.document
global.HTMLCanvasElement = dom.window.HTMLCanvasElement

describe('TransmissionEditor', () => {
  let editor
  let mockCanvas

  // Setup required mocks
  beforeEach(() => {
    // Create canvas element
    mockCanvas = document.createElement('canvas')

    // Mock the NodeFlowGraph class
    global.NodeFlowGraph = jasmine.createSpyObj('NodeFlowGraph', [
      'addPublisher', 'addOnNodeCreatedListener', 'addNode', 'getNodes', 'organize'
    ])
    global.NodeFlowGraph.and.callFake(() => {
      return {
        addPublisher: jasmine.createSpy('addPublisher'),
        addOnNodeCreatedListener: jasmine.createSpy('addOnNodeCreatedListener'),
        addNode: jasmine.createSpy('addNode'),
        getNodes: jasmine.createSpy('getNodes').and.returnValue([]),
        organize: jasmine.createSpy('organize')
      }
    })

    // Mock FlowNode class
    global.FlowNode = jasmine.createSpy('FlowNode').and.callFake((config) => {
      return {
        title: config?.title || '',
        position: config?.position || { x: 0, y: 0 },
        data: config?.data || {},
        setMetadataProperty: jasmine.createSpy('setMetadataProperty')
      }
    })

    // Mock required classes
    const mockLoader = {
      loadFromFile: jasmine.createSpy('loadFromFile').and.returnValue(Promise.resolve([
        {
          id: 'http://purl.org/stuff/transmissions/test',
          label: 'Test Transmission',
          processors: [{ id: 'p10', type: 'ShowMessage' }],
          connections: []
        }
      ]))
    }

    const mockBuilder = {
      buildGraph: jasmine.createSpy('buildGraph')
    }

    const mockExporter = {
      createDataset: jasmine.createSpy('createDataset').and.returnValue({})
    }

    const mockPublisher = {
      registerProcessorsFromTransmissions: jasmine.createSpy('registerProcessorsFromTransmissions')
    }

    // Replace constructor with mocked versions
    spyOn(global, 'TransmissionsLoader').and.returnValue(mockLoader)
    spyOn(global, 'TransmissionsGraphBuilder').and.returnValue(mockBuilder)
    spyOn(global, 'TransmissionsExporter').and.returnValue(mockExporter)
    spyOn(global, 'ProcessorNodePublisher').and.returnValue(mockPublisher)

    // Create editor instance
    editor = new TransmissionEditor(mockCanvas)

    // Add mock components directly (for tests where constructor mocking isn't sufficient)
    editor.loader = mockLoader
    editor.builder = mockBuilder
    editor.exporter = mockExporter
    editor.publisher = mockPublisher
  })

  // Clean up after tests
  afterEach(() => {
    // Reset all spies
    jasmine.resetSpies()
  })

  // Basic test to verify initialization
  it('should initialize the editor', () => {
    expect(editor).toBeDefined()
  })

  // Test loadFromFile method
  it('should load transmissions from a file', async () => {
    const fileUrl = 'file://test.ttl'
    await editor.loadFromFile(fileUrl)

    expect(editor.loader.loadFromFile).toHaveBeenCalledWith(fileUrl)
    expect(editor.publisher.registerProcessorsFromTransmissions).toHaveBeenCalled()
    expect(editor.builder.buildGraph).toHaveBeenCalled()
  })

  // Test createNewTransmission method
  it('should create a new transmission', () => {
    const transmission = editor.createNewTransmission('Test')

    expect(transmission).toBeDefined()
    expect(transmission.label).toBe('Test')
  })
})