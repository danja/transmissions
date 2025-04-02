/**
 * SPARQL types for Transmissions framework
 */

export interface SPARQLEndpoint {
  name: string;
  type: 'query' | 'update';
  url: string;
  credentials: {
    user: string;
    password: string;
  };
}

export interface SessionEnvironment {
  processor: any;
  endpoints: SPARQLEndpoint[] | null;
  templateCache: Map<string, string>;

  loadEndpoints(dir: string): Promise<void>;
  getQueryEndpoint(): SPARQLEndpoint | undefined;
  getUpdateEndpoint(): SPARQLEndpoint | undefined;
  getTemplate(dir: string, templateFilename: string): Promise<string>;
  clearTemplateCache(): void;
  getBasicAuthHeader(endpoint: SPARQLEndpoint): string;
}

export interface SPARQLProcessorsFactory {
  createProcessor(type: any, config: any): any | false;
}

export interface SPARQLSelect {
  env: SessionEnvironment;

  getQueryEndpoint(message: any): Promise<SPARQLEndpoint>;
  process(message: any): Promise<any>;
}

export interface SPARQLUpdate {
  env: SessionEnvironment;

  process(message: any): Promise<any>;
  getUpdateEndpoint(message: any): Promise<SPARQLEndpoint>;
  makeHeaders(endpoint: SPARQLEndpoint): Promise<{
    'Content-Type': string;
    'Authorization': string;
  }>;
}

export interface MessageValidator {
  static validate(message: any): {
    isValid: boolean;
    errors: string[];
  };
}

export interface TextUtils {
  isValidLanguageTag(langTag: string): boolean;
  escapeStringLiteral(str: string, options?: {
    language?: string;
    datatype?: string;
  }): string;
  escapeIRI(iri: string): string;
  escapeLocalName(localName: string): string;
  isValidDateTime(dateStr: string): boolean;
  createSlug(str: string): string;
  isValidURL(url: string): boolean;
}
