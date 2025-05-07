/**
 * Engine types for Transmissions framework
 */

import { Dataset, NamedNode, Term } from '@rdfjs/types';
import { ProcessorMessage, Processor, ProcessorConfig } from './processors';

export interface AppResolverOptions {
  appName?: string;
  appPath?: string;
  subtask?: string;
  rootDir?: string;
  workingDir?: string;
  targetPath?: string;
  dataset?: Dataset;
}

export interface AppResolver {
  appsDir: string;
  transmissionFilename: string;
  configFilename: string;
  moduleSubDir: string;
  dataSubDir: string;
  manifestFilename: string;
  appName: string | null;
  appPath: string | null;
  subtask: string | null;
  rootDir: string | null;
  workingDir: string | null;
  targetPath: string | null;
  dataset: Dataset | null;
  sessionNode?: Term;

  initialize(appName: string, appPath?: string, subtask?: string, target?: string, flags?: any): Promise<void>;
  findInDirectory(dir: string, targetName: string, depth?: number): Promise<string | null>;
  resolveApplicationPath(appName: string): Promise<string>;
  getTransmissionsPath(): string;
  getConfigPath(): string;
  getModulePath(): string;
  resolveDataDir(): string;
  toMessage(): ProcessorMessage;
}

export interface TransmissionBuilder {
  moduleLoader: ModuleLoader;
  app: Application;
  transmissionCache: Map<string, Transmission>;
  MAX_NESTING_DEPTH: number;
  currentDepth: number;

  buildTransmissions(app: Application): Promise<Transmission[]>;
  constructTransmission(transmissionsDataset: Dataset, transmissionID: Term, configDataset: Dataset): Promise<Transmission>;
  createNodes(transmission: Transmission, pipenodes: Term[], transmissionsDataset: Dataset, configDataset: Dataset): Promise<void>;
  connectNodes(transmission: Transmission, pipenodes: Term[]): Promise<void>;
  createProcessor(type: Term, configDataset: Dataset): Promise<Processor>;
  isTransmissionReference(transmissionsDataset: Dataset, processorType: Term): boolean;
  getPipeNodes(transmissionsDataset: Dataset, transmissionID: Term): Term[];
}

export interface Transmission {
  id: string;
  label: string;
  comment?: string;
  processors: Record<string, Processor | Transmission>;
  connectors: Connector[];
  parent: Transmission | null;
  children: Set<Transmission>;
  path: string[];
  app: Application;
  whiteboard: Whiteboard;

  process(message: ProcessorMessage): Promise<ProcessorMessage>;
  register(processorName: string, instance: Processor | Transmission): Processor | Transmission;
  get(processorName: string): Processor | Transmission;
  connect(fromProcessorName: string, toProcessorName: string): void;
  getFirstNode(): Processor;
  getLastNode(): Processor;
  handleError(error: Error): void;
  getTransmissionInfo(): {
    id: string;
    path: string[];
    depth: number;
    children: string[];
  };
}

export interface Connector {
  fromName: string;
  toName: string;

  connect(processors: Record<string, Processor | Transmission>): void;
}

export interface ModuleLoader {
  classpath: string[];
  moduleCache: Map<string, any>;

  loadModule(moduleName: string): Promise<any>;
  clearCache(): void;
  addPath(newPath: string): void;
}

export interface Application {
  name: string;
  path: string;
  subtask: string | null;
  rootDir: string | null;
  dataDir: string | null;
  targetDir: string | null;
  targetDataset: Dataset | null;
  
  datasets: Datasets;
  
  initDataset(appName: string, sessionNode?: Term): Promise<void>;
  mergeIn(dataset: Dataset): Promise<void>;
}

export interface ApplicationManager {
  targetDatasets: any;
  moduleLoader: ModuleLoader | null;
  app: Application;

  initApp(options: AppResolverOptions): Promise<ApplicationManager>;
  initModuleLoader(): Promise<void>;
  buildTransmissions(): Promise<Transmission[]>;
  start(message?: ProcessorMessage): Promise<ProcessorMessage>;
  resolveApplicationPath(appName: string): Promise<string>;
  getConfigPath(): string;
  getModulePath(): string;
  resolveDataDir(): string;
  toMessage(): any;
  listApps(): Promise<string[]>;
}

export interface Whiteboard {
  [key: string]: any;
}
