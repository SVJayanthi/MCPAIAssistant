import { GDriveMCPClient } from './gdrive-client.js';

/**
 * GDriveRepository provides a higher-level interface for interacting with Google Drive
 * through the MCP client.
 */
export class GDriveRepository {
  private client: GDriveMCPClient;
  
  constructor(clientId: string, clientSecret: string, credsDir: string) {
    this.client = new GDriveMCPClient(clientId, clientSecret, credsDir);
  }
  
  /**
   * Initialize the connection to Google Drive
   */
  async connect(): Promise<void> {
    await this.client.connect();
  }
  
  /**
   * Disconnect from Google Drive
   */
  disconnect(): void {
    this.client.disconnect();
  }
  
  /**
   * List files from Google Drive
   */
  async listFiles(cursor?: string): Promise<any> {
    return this.client.listResources(cursor);
  }
  
  /**
   * Search for files in Google Drive
   */
  async searchFiles(query: string, pageToken?: string, pageSize?: number): Promise<any> {
    return this.client.searchFiles(query, pageToken, pageSize);
  }
  
  /**
   * Read a file from Google Drive
   */
  async readFile(fileId: string): Promise<any> {
    return this.client.readFile(fileId);
  }
  
  /**
   * Read a resource directly using the resource URI
   */
  async readResource(fileId: string): Promise<any> {
    return this.client.readResource(fileId);
  }
  
  /**
   * Read data from a Google Spreadsheet
   */
  async readSheet(spreadsheetId: string, ranges?: string[], sheetId?: number): Promise<any> {
    return this.client.readSheet(spreadsheetId, ranges, sheetId);
  }
  
  /**
   * Update a cell in a Google Spreadsheet
   */
  async updateSheetCell(fileId: string, range: string, value: string): Promise<any> {
    return this.client.updateSheetCell(fileId, range, value);
  }
  
  /**
   * Get all available tools from the Google Drive MCP
   */
  getAvailableTools(): any[] {
    return this.client.getTools();
  }
  
  /**
   * Call a specific tool directly
   */
  async callTool(toolName: string, args: any): Promise<any> {
    return this.client.callTool(toolName, args);
  }
}
