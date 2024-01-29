
import { StringSource } from '../services/StringSource.js'
import { Connector } from '../services/Connector.js'
import { StringSink } from '../services/StringSink.js'
import { AppendProcess } from '../services/AppendProcess.js'

export class ServiceContainer {
  constructor(pipeline, definitions) {
    // Accepting definitions declaratively
    this.definitions = definitions || {
      source: StringSource,
      connector: Connector,
      sink: StringSink,
      process: AppendProcess,
    };

    // Store for service instances for reuse
    this.instances = {};

    // Store the pipeline configuration
    this.pipelineConfig = pipeline;
  }

  getService(serviceName) {
    // Create a service instance if one doesn't already exist
    if (!this.instances[serviceName]) {
      const ServiceClass = this.definitions[serviceName];
      if (ServiceClass) {
        this.instances[serviceName] = new ServiceClass();
      } else {
        throw new Error(\`Service '\${serviceName}' is not defined.\`);
      }
    }
    return this.instances[serviceName];
  }

  executePipeline() {
    if (!Array.isArray(this.pipelineConfig) || this.pipelineConfig.length === 0) {
      throw new Error('Pipeline configuration is not valid.');
    }

    let result;
    for (const serviceName of this.pipelineConfig) {
      const service = this.getService(serviceName);
      result = service.process(result);
    }

    return result;
  }
}
