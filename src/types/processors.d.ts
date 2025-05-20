/**
 * Core processor types for Transmissions framework
 */

import { Term, Dataset, NamedNode } from '@rdfjs/types';
import { EventEmitter } from 'events';

export interface ProcessorConfig {
  dataset?: Dataset;
  whiteboard?: any[];
  [key: string]: any;
}

/**
 * Represents a message that can be passed between processors.
 * This is an arbitrary non-null object that can have any properties.
 */
export type ProcessorMessage = {
  [key: string]: any;
};

export interface Processor extends EventEmitter {
  id: string;
  type?: Term;
  config: ProcessorConfig;
  settingsNode?: Term;
  transmission?: any;
  whiteboard?: any;
  messageQueue: { message: ProcessorMessage }[];
  processing: boolean;
  outputs: any[];
  message?: ProcessorMessage;
  app?: any;

  getValues(property: Term, fallback?: any): string[];
  getProperty(property: Term, fallback?: any): string | undefined;
  preProcess(message: ProcessorMessage): Promise<void>;
  postProcess(message: ProcessorMessage): Promise<void>;
  process(message: ProcessorMessage): Promise<any>;
  receive(message: ProcessorMessage): Promise<void>;
  enqueue(message: ProcessorMessage): Promise<void>;
  executeQueue(): Promise<void>;
  emit(event: string, message: any): Promise<any>;
  getOutputs(): any[];
  getTag(): string;
}

export interface ProcessorFactory {
  createProcessor(type: Term, config: ProcessorConfig): Processor | false;
}

export interface FsProcessorConfig extends ProcessorConfig {
  sourceFile?: string;
  sourceDir?: string;
  destinationFile?: string;
  metaField?: string;
  mediaType?: string;
}

export interface JsonProcessorConfig extends ProcessorConfig {
  rename?: Array<{pre: string, post: string}>;
  remove?: string | string[];
}

export interface TextProcessorConfig extends ProcessorConfig {
  templateFilename?: string;
  inputField?: string;
  outputField?: string;
  match?: string;
  replace?: string;
}

export interface HttpProcessorConfig extends ProcessorConfig {
  port?: number;
  basePath?: string;
  staticPath?: string;
  cors?: boolean;
  timeout?: number;
  maxRequestSize?: string;
}

export interface SparqlProcessorConfig extends ProcessorConfig {
  endpointSettings?: string;
  templateFilename?: string;
  dataBlock?: string;
}

export interface FlowProcessorConfig extends ProcessorConfig {
  forEach?: string;
  remove?: string | boolean;
  delay?: string | number;
}
