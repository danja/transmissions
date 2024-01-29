
import { ServiceContainer } from './ServiceContainer.js';

export class DependencyInjector {
  constructor(pipelineConfig) {
    // Pass the pipeline configuration to the ServiceContainer
    this.container = new ServiceContainer(pipelineConfig)
  }

  // Injects the dependencies into an uninstantiated class
  make(Class) {
    return Class.__inject(this.container)
  }
}
