import { DatasetCore } from 'rdf-js'
import { EventEmitter } from 'events'
import { NamedNode, BlankNode } from 'rdf-ext'

// Namespace type
export type Namespace = {
    [key: string]: NamedNode
}

// Logger type
export type Logger = {
    log: (...args: any[]) => void
    trace: (...args: any[]) => void
    error: (...args: any[]) => void
    reveal: (value: any) => string
}

// App type
export interface App {
    appNode: NamedNode
    sessionNode: BlankNode | NamedNode
    targetDataset: DatasetCore
    
    initDataset(appName: string, sessionNode?: BlankNode): Promise<void>
    mergeIn(dataset: DatasetCore): Promise<void>
    toString(): string
}

// Processor type
export interface Processor {
    id: NamedNode
    message?: { tags?: string[] }
    tags?: string
    
    receive(message: any): Promise<void>
    toString(): string
}

// Transmission type
export interface Transmission extends EventEmitter {
    transmissionConfig: any
    processors: { [key: string]: Processor | Transmission }
    connectors: Connector[]
    parent: Transmission | null
    children: Set<Transmission>
    path: string[]
    
    process(message: any): Promise<any>
    register(processorName: string, instance: Processor | Transmission): Processor | Transmission
    get(processorName: string): Processor | Transmission | undefined
    connect(fromProcessorName: string, toProcessorName: string): void
    getFirstNode(): Processor
    handleError(error: Error): void
    getTransmissionInfo(): {
        id: NamedNode
        path: string[]
        depth: number
        children: string[]
    }
    toString(): string
}

// Connector type
export interface Connector extends EventEmitter {
    fromName: string
    toName: string
    
    connect(processors: { [key: string]: Processor | Transmission }): void
}

// Message type
export interface Message {
    [key: string]: any
    tags?: string[]
}
