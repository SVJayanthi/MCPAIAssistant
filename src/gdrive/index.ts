export interface GDriveFile {
  id: string;
  name: string;
  mimeType: string;
  content?: string;
}

export interface GDriveSearchResult {
  files: GDriveFile[];
  nextPageToken?: string;
}

export interface GSheetData {
  spreadsheetId: string;
  valueRanges: Array<{
    range: string;
    values: any[][];
  }>;
}

export interface GSheetUpdateResult {
  spreadsheetId: string;
  updatedRange: string;
  updatedCells: number;
}

export * from './gdrive-client.js';
export * from './gdrive-repository.js';
