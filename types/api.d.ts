/**
 * API types for Transmissions framework
 */

import { ApplicationManager } from './engine';

export interface CommandUtils {
  appManager: ApplicationManager;

  begin(application: string, target?: string, message?: any, flags?: any): Promise<any>;
  listApplications(): Promise<string[]>;
  static splitName(fullPath: string): {
    appName: string;
    appPath: string;
    subtask?: string;
  };
  static parseOrLoadContext(contextArg: string): Promise<{
    payload: any;
  }>;
}

export interface TransmissionsClient {
  baseUrl: string;
  metrics: {
    requests: number;
    errors: number;
    startTime: number;
  };

  runApplication(application: string, message?: any): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }>;
  getMetrics(): {
    requests: number;
    errors: number;
    uptime: number;
  };
  setBaseUrl(url: string): void;
}

export interface WebRunner {
  appManager: ApplicationManager;
  app: any; // Express app
  port: number;
  basePath: string;
  server: any;
  requestCount: number;

  setupMiddleware(): void;
  setupRoutes(): void;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface MetricsService {
  wss: any;
  metrics: {
    startTime: number;
    requests: number;
    connections: number;
    memory: {
      used?: number;
      total?: number;
      free?: number;
    };
    cpu: {
      load?: number[];
      cores?: number;
    };
  };

  setupWebSocket(): void;
  startMetricsCollection(): void;
  updateMetrics(): void;
  broadcastMetrics(): void;
  incrementRequests(): void;
}

export interface ShutdownService {
  username: string;
  password: string;

  setupMiddleware(app: any): void;
  validateAuth(authHeader: string): boolean;
  setupEndpoints(app: any, shutdownCallback: () => void): void;
}

export interface ServerWorker {
  app: any;
  server: any;
  config: {
    port?: number;
    basePath?: string;
    staticPath?: string;
    cors?: boolean;
    timeout?: number;
    maxRequestSize?: string;
  };

  setupMessageHandling(): void;
  start(config: any): Promise<void>;
  stop(): Promise<void>;
}
