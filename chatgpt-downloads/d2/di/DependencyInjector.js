
import { ServiceContainer } from './ServiceContainerDeclarative.js';

export class DependencyInjector {
  constructor(pipelineConfig, serviceDefinitions) {
    // Pass the pipeline configuration and service definitions to the ServiceContainer
    this.container = new ServiceContainer(pipelineConfig, serviceDefinitions)
  }

  // Injects the dependencies into an uninstantiated class
  make(Class) {
    return Class.__inject(this.container)
  }
}
