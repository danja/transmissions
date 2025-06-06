// Mock implementation of ProcessorNodePublisher
class ProcessorNodePublisher {
  constructor() {
    this.publish = vi.fn();
    this.registerCommonProcessorTypes = vi.fn();
    this.registerProcessor = vi.fn();
  }
}

export default ProcessorNodePublisher;
