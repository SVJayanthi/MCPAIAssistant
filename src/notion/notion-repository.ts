import { NotionMCPClient } from './notion-client.js';
import { Tool } from '../shared/types.js';

/**
 * NotionRepository provides a higher-level interface for interacting with Notion
 * through the MCP client.
 */
export class NotionRepository {
  private client: NotionMCPClient;
  
  constructor(notionToken: string, notionVersion: string = '2022-06-28') {
    this.client = new NotionMCPClient(notionToken, notionVersion);
  }
  
  /**
   * Initialize the connection to Notion
   */
  async connect(): Promise<void> {
    await this.client.connect();
  }
  
  /**
   * Disconnect from Notion
   */
  disconnect(): void {
    this.client.disconnect();
  }
  
  /**
   * Search for content in Notion
   */
  async search(query: string): Promise<any> {
    return this.client.search(query);
  }
  
  /**
   * Get a page from Notion by ID
   */
  async getPage(pageId: string): Promise<any> {
    return this.client.getPage(pageId);
  }
  
  /**
   * Create a new page in Notion
   */
  async createPage(parentId: string, title: string, content: any = {}): Promise<any> {
    return this.client.createPage(parentId, title, content);
  }
  
  /**
   * Add a comment to a page
   */
  async addComment(pageId: string, comment: string): Promise<any> {
    return this.client.addComment(pageId, comment);
  }
  
  /**
   * Get a database from Notion
   */
  async getDatabase(databaseId: string): Promise<any> {
    return this.client.getDatabase(databaseId);
  }
  
  /**
   * Query a database in Notion
   */
  async queryDatabase(databaseId: string, filter: any = {}): Promise<any> {
    return this.client.queryDatabase(databaseId, filter);
  }
  
  /**
   * Get all available tools from the Notion MCP
   */
  getAvailableTools(): Tool[] {
    return this.client.getTools();
  }
  
  /**
   * Call a specific tool directly
   */
  async callTool(toolName: string, args: any): Promise<any> {
    return this.client.callTool(toolName, args);
  }
}
