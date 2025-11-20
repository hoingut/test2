export type ColumnType = 'string' | 'number' | 'boolean' | 'date';

export interface Column {
  name: string;
  type: ColumnType;
  isPrimaryKey?: boolean;
}

export interface Row {
  id: string | number;
  [key: string]: any;
}

export interface Table {
  id: string;
  name: string;
  description?: string;
  columns: Column[];
  rows: Row[];
}

export interface DatabaseState {
  name: string;
  tables: Table[];
}

export enum ViewMode {
  DATA = 'DATA',
  QUERY = 'QUERY',
  SCHEMA = 'SCHEMA',
  ANALYSIS = 'ANALYSIS'
}

export interface QueryResult {
  success: boolean;
  data?: Row[];
  columns?: string[];
  message?: string;
  executionTimeMs?: number;
}

export interface AiAnalysisResult {
  summary: string;
  trends: string[];
  keyInsights: string[];
}
