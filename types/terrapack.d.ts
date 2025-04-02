/**
 * Terrapack types for Transmissions framework
 */

export interface TerrapackProcessorsFactory {
  createProcessor(type: any, config: any): any | false;
}

export interface FileContainer {
  container: {
    files: Record<string, {
      content: string;
      type: string;
      timestamp: string;
    }>;
    summary: {
      totalFiles: number;
      fileTypes: Record<string, number>;
      timestamp: string;
    };
  };

  process(message: {
    done?: boolean;
    filepath?: string;
    content?: string;
    rootDir?: string;
    [key: string]: any;
  }): Promise<any>;
}

export interface CommentStripper {
  commentStripper(content: string, filepath: string): string;
}

export interface LanguagePatterns {
  [key: string]: {
    single: string;
    multi: {
      start: string;
      end: string;
    };
  };
}
