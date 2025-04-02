/**
 * Tools types for Transmissions framework
 */

export interface TransmissionEditor {
  graph: any;
  loader: TransmissionsLoader;
  builder: TransmissionsGraphBuilder;
  exporter: TransmissionsExporter;
  publisher: ProcessorNodePublisher;
  currentFile: string | null;
  loadedTransmissions: any[];

  setupEvents(): void;
  loadFromFile(filePath: string): Promise<any[]>;
  saveToFile(filePath?: string | null, transmissionId?: string | null): Promise<void>;
  createNewTransmission(label?: string): any;
  getGraph(): any;
}

export interface TransmissionsLoader {
  loadFromFile(filePath: string): Promise<any[]>;
  parseDataset(dataset: any, filePath: string): any[];
  extractTransmission(dataset: any, transmissionID: any): {
    id: string;
    shortId: string;
    label: string;
    comment: string;
    processors: any[];
    connections: any[];
  };
}

export interface TransmissionsGraphBuilder {
  graph: any;

  buildGraph(transmissions: any[]): void;
  buildTransmission(transmission: any): void;
  createProcessorNode(processor: any, position: {x: number, y: number}, transmission: any): any;
  clearGraph(): void;
}

export interface TransmissionsExporter {
  graph: any;

  createDataset(transmissionId?: string | null): any;
  buildDatasetFromTransmissions(transmissions: Map<string, any>, dataset: any): any;
  organizeNodesByTransmission(nodes: any[]): Map<string, {
    label: string;
    comment: string;
    processors: any[];
  }>;
  sortProcessorsByConnections(processors: any[]): any[];
  addTransmissionToDataset(dataset: any, transmissionId: string, label: string, comment: string, processors: any[]): void;
  addListToDataset(dataset: any, subject: any, predicate: any, items: any[]): void;
  saveToFile(filePath: string, transmissionId?: string | null): Promise<void>;
}

export interface ProcessorNodePublisher {
  registerCommonProcessorTypes(): void;
  registerProcessor(type: string, description?: string): void;
  createProcessorNodeConfig(type: string, description: string): {
    title: string;
    subTitle: string;
    info: string;
    canEditInfo: boolean;
    locked: boolean;
    style: any;
    inputs: any[];
    outputs: any[];
    data: {
      processorType: string;
    };
  };
  registerProcessorsFromTransmissions(transmissions: any[]): void;
}

export interface TemplateGenerator {
  program: any;

  setupCommands(): void;
  promptForDetails(name: string): Promise<{
    primaryGoal: string;
    inputs: string[];
    outputs: string[];
    processors: string[];
    needsTests: boolean;
  }>;
  generateTemplates(name: string, answers: any, format: string): Promise<void>;
  generateJSON(name: string, answers: any): string;
  generateTurtle(name: string, answers: any): string;
  generateMarkdown(name: string, answers: any): string;
  generateFileStructure(outputDir: string, answers: any): Promise<void>;
  run(): void;
}

export interface TestDataGenerator {
  baseDir: string;
  inputDir: string;
  outputDir: string;
  fileTypes: Set<string>;

  init(): Promise<void>;
  generateMarkdownFiles(count?: number): Promise<string[]>;
  generateMarkdownContent(depth?: number): string;
  generateListItems(count: number): string;
  generateParagraph(seed: number): string;
  generateNestedStructure(depth?: number, filesPerLevel?: number): Promise<string[]>;
  generateEdgeCases(): Promise<void>;
  generateDeepStructure(depth: number): string;
  generateWideStructure(width: number): string;
  generateRequiredOutputs(sourceDir: string): Promise<void>;
  wrapHTML(content: string): string;
  generateSVG(content: string): string;
  cleanup(): Promise<void>;
}

export interface FileTestHelper {
  baseDir: string;

  setup(): Promise<void>;
  cleanup(): Promise<void>;
  createTestFile(subPath: string, content: string): Promise<string>;
  compareFiles(actualPath: string, expectedPath: string): Promise<{
    match: boolean;
    actual?: string;
    expected?: string;
    error?: string;
  }>;
  clearOutputFiles(pattern?: string): Promise<void>;
  fileExists(filePath: string): Promise<boolean>;
}
