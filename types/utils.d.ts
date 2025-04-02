/**
 * Utility types for Transmissions framework
 */

import { Dataset, Term, Quad, NamedNode } from '@rdfjs/types';

export interface Logger {
  logfile: string;
  currentLogLevel: string;
  silent?: boolean;

  setLogLevel(logLevel: string, persist?: boolean): void;
  getLevel(): string;
  enableAll(): void;
  disableAll(): void;
  setDefaultLevel(level: string): void;
  getLogger(name: string): Logger;
  appendLogToFile(message: string): void;
  timestampISO(): string;
  log(msg: any, level?: string): void;
  trace(msg: any): void;
  debug(msg: any): void;
  info(msg: any): void;
  warn(msg: any): void;
  error(msg: any): void;
  reveal(instance: any, verbose?: boolean): void;
  sh(string: any): void;
  shorter(rdfString: string): string;
}

export interface GrapoiHelpers {
  readDataset(filename: string): Promise<Dataset>;
  writeDataset(dataset: Dataset, filename: string): Promise<void>;
  listToArray(dataset: Dataset, term: Term, property: Term): Term[];
  listObjects(dataset: Dataset, subjectList: Term[], predicate: Term): Term[];
}

export interface StringUtils {
  matchPatterns(str: string, patterns: string[]): string[] | false;
  matchesPattern(str: string, pattern: string): boolean;
}

export interface JSONUtils {
  get(obj: any, path: string): any;
  set(obj: any, path: string, value: any): any;
  remove(obj: any, path: string): any;
  find(obj: any, path: string, setValue?: any, remove?: boolean): any;
}

export interface SysUtils {
  copyMessage(message: any): any;
  sleep(ms?: number): Promise<void>;
}

export interface RDFUtils {
  readDataset(filename: string): Promise<Dataset>;
  writeDataset(dataset: Dataset, filename: string): Promise<void>;
  loadDataset(relativePath: string): Promise<Dataset>;
}

export interface Namespace {
  rdf: {
    type: NamedNode;
    first: NamedNode;
    rest: NamedNode;
    nil: NamedNode;
    [key: string]: NamedNode;
  };
  rdfs: {
    label: NamedNode;
    comment: NamedNode;
    [key: string]: NamedNode;
  };
  dc: {
    [key: string]: NamedNode;
  };
  schema: {
    [key: string]: NamedNode;
  };
  xsd: {
    [key: string]: NamedNode;
  };
  trn: {
    [key: string]: NamedNode;
  };
  prefixMap: Record<string, string>;
  shortName(url: string): string;
  getShortname(url: string): string;
}

export interface MockApplicationManager {
  appsDir: string;
  app?: {
    appName: string;
    appPath: string;
    subtask: string | null;
    targetPath: string | null;
    dataset: Record<string, any>;
    manifestFilename: string | null;
  };

  initialize(appName: string, appPath?: string, subtask?: string, target?: string, flags?: any): Promise<void>;
  start(message?: Record<string, any>): Promise<Record<string, any>>;
  listApplications(): Promise<string[]>;
  resolveApplicationPath(appName: string): string;
}
