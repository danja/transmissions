// Mock implementation of the node-flow module
class Publisher {
  constructor() {
    this.publish = vi.fn();
  }
}

class NodeFlowGraph {
  constructor() {
    this.on = vi.fn();
    this.addNode = vi.fn();
    this.addEdge = vi.fn();
    this.destroy = vi.fn();
    this.nodeRenderer = {
      renderNode: vi.fn()
    };
  }
}

class FlowNode {
  // Mock FlowNode implementation
}

module.exports = {
  Publisher,
  NodeFlowGraph,
  FlowNode
};
