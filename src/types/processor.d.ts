import { Term, Dataset, NamedNode } from '@rdfjs/types';
import { EventEmitter } from 'events';

export interface ProcessorConfig {
    dataset?: Dataset;
    [key: string]: any;
}

export interface ProcessorMessage {
    content?: any;
    filepath?: string;
    done?: boolean;
    tags?: string;
    [key: string]: any;
}

export interface ProcessorSettings {
    config: ProcessorConfig;
    settingsNode: Term | null;
    getValues(property: Term, fallback?: any): string[];
    getValue(property: Term, fallback?: any): string | undefined;
}

export interface IProcessor {
    config: ProcessorConfig;
    settings: ProcessorSettings;
    messageQueue: { message: ProcessorMessage }[];
    processing: boolean;
    outputs: any[];
    settingsNode?: Term;
    message?: ProcessorMessage;

    getValues(property: Term, fallback?: any): string[];
    getProperty(property: Term, fallback?: any): string | string[] | any;
    preProcess(message: ProcessorMessage): Promise<void>;
    postProcess(message: ProcessorMessage): Promise<void>;
    process(message: ProcessorMessage): Promise<void>;
    receive(message: ProcessorMessage): Promise<void>;
    enqueue(message: ProcessorMessage): Promise<void>;
    executeQueue(): Promise<void>;
    emit(event: string, message: ProcessorMessage): Promise<ProcessorMessage>;
    getOutputs(): any[];
}

export interface StringFilterConfig extends ProcessorConfig {
    includePatterns?: string[];
    excludePatterns?: string[];
}

export interface IStringFilter extends IProcessor {
    initialized: boolean;
    includePatterns: string[];
    excludePatterns: string[];
    initialize(): Promise<void>;
    matchPattern(filePath: string, pattern: string): boolean;
    isAccepted(filePath: string): boolean;
}