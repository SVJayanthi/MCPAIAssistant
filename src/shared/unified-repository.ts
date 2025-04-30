import { NotionRepository } from '../notion/notion-repository.js';
import { GDriveRepository } from '../gdrive/gdrive-repository.js';
import { NotionPage, NotionDatabase, NotionSearchResult } from '../shared/types.js';
import { GDriveFile, GDriveSearchResult, GSheetData } from '../gdrive/index.js';

/**
 * UnifiedKnowledgeRepository provides a single interface for interacting with
 * both Notion and Google Drive knowledge repositories.
 */
export class UnifiedKnowledgeRepository {
  private notionRepo: NotionRepository;
  private gdriveRepo: GDriveRepository;
  private notionConnected: boolean = false;
  private gdriveConnected: boolean = false;

  constructor(
    // Notion configuration
    private notionToken: string,
    private notionVersion: string = '2022-06-28',
    // Google Drive configuration
    private clientId: string,
    private clientSecret: string,
    private credsDir: string
  ) {
    this.notionRepo = new NotionRepository(notionToken, notionVersion);
    this.gdriveRepo = new GDriveRepository(clientId, clientSecret, credsDir);
  }

  /**
   * Connect to both Notion and Google Drive
   */
  async connect(): Promise<void> {
    try {
      console.log('Connecting to Notion...');
      await this.notionRepo.connect();
      this.notionConnected = true;
      console.log('Connected to Notion');
    } catch (error) {
      console.error('Error connecting to Notion:', error);
      throw error;
    }

    try {
      console.log('Connecting to Google Drive...');
      await this.gdriveRepo.connect();
      this.gdriveConnected = true;
      console.log('Connected to Google Drive');
    } catch (error) {
      console.error('Error connecting to Google Drive:', error);
      // If Notion connected but Google Drive failed, disconnect Notion
      if (this.notionConnected) {
        this.notionRepo.disconnect();
        this.notionConnected = false;
      }
      throw error;
    }
  }

  /**
   * Disconnect from both Notion and Google Drive
   */
  disconnect(): void {
    if (this.notionConnected) {
      this.notionRepo.disconnect();
      this.notionConnected = false;
    }
    
    if (this.gdriveConnected) {
      this.gdriveRepo.disconnect();
      this.gdriveConnected = false;
    }
    
    console.log('Disconnected from all services');
  }

  /**
   * Check if connected to both services
   */
  isConnected(): boolean {
    return this.notionConnected && this.gdriveConnected;
  }

  /**
   * Search across both Notion and Google Drive
   */
  async search(query: string): Promise<{
    notion: NotionSearchResult,
    gdrive: GDriveSearchResult
  }> {
    this.checkConnection();

    const [notionResults, gdriveResults] = await Promise.all([
      this.notionRepo.search(query),
      this.gdriveRepo.searchFiles(query)
    ]);

    return {
      notion: notionResults,
      gdrive: gdriveResults
    };
  }

  /**
   * Get a page from Notion
   */
  async getNotionPage(pageId: string): Promise<any> {
    this.checkConnection();
    return this.notionRepo.getPage(pageId);
  }

  /**
   * Create a new page in Notion
   */
  async createNotionPage(parentId: string, title: string, content: any = {}): Promise<any> {
    this.checkConnection();
    return this.notionRepo.createPage(parentId, title, content);
  }

  /**
   * Add a comment to a Notion page
   */
  async addNotionComment(pageId: string, comment: string): Promise<any> {
    this.checkConnection();
    return this.notionRepo.addComment(pageId, comment);
  }

  /**
   * Query a Notion database
   */
  async queryNotionDatabase(databaseId: string, filter: any = {}): Promise<any> {
    this.checkConnection();
    return this.notionRepo.queryDatabase(databaseId, filter);
  }

  /**
   * Read a file from Google Drive
   */
  async readGDriveFile(fileId: string): Promise<any> {
    this.checkConnection();
    return this.gdriveRepo.readFile(fileId);
  }

  /**
   * List files from Google Drive
   */
  async listGDriveFiles(cursor?: string): Promise<any> {
    this.checkConnection();
    return this.gdriveRepo.listFiles(cursor);
  }

  /**
   * Read data from a Google Spreadsheet
   */
  async readGSheet(spreadsheetId: string, ranges?: string[], sheetId?: number): Promise<any> {
    this.checkConnection();
    return this.gdriveRepo.readSheet(spreadsheetId, ranges, sheetId);
  }

  /**
   * Update a cell in a Google Spreadsheet
   */
  async updateGSheetCell(fileId: string, range: string, value: string): Promise<any> {
    this.checkConnection();
    return this.gdriveRepo.updateSheetCell(fileId, range, value);
  }

  /**
   * Get available tools from both services
   */
  getAvailableTools(): {
    notion: any[],
    gdrive: any[]
  } {
    return {
      notion: this.notionConnected ? this.notionRepo.getAvailableTools() : [],
      gdrive: this.gdriveConnected ? this.gdriveRepo.getAvailableTools() : []
    };
  }

  /**
   * Call a specific Notion tool directly
   */
  async callNotionTool(toolName: string, args: any): Promise<any> {
    this.checkNotionConnection();
    return this.notionRepo.callTool(toolName, args);
  }

  /**
   * Call a specific Google Drive tool directly
   */
  async callGDriveTool(toolName: string, args: any): Promise<any> {
    this.checkGDriveConnection();
    return this.gdriveRepo.callTool(toolName, args);
  }

  /**
   * Check if connected to both services
   */
  private checkConnection(): void {
    if (!this.notionConnected || !this.gdriveConnected) {
      throw new Error('Not connected to all services. Call connect() first.');
    }
  }

  /**
   * Check if connected to Notion
   */
  private checkNotionConnection(): void {
    if (!this.notionConnected) {
      throw new Error('Not connected to Notion. Call connect() first.');
    }
  }

  /**
   * Check if connected to Google Drive
   */
  private checkGDriveConnection(): void {
    if (!this.gdriveConnected) {
      throw new Error('Not connected to Google Drive. Call connect() first.');
    }
  }
}
