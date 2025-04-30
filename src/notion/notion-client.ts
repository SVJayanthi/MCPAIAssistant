import { ChildProcess, spawn } from 'child_process';
import { Readable, Writable } from 'stream';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Tool } from '../shared/types.js';

export class NotionMCPClient {
  private mcpProcess: ChildProcess | null = null;
  private server: Server | null = null;
  private tools: Tool[] = [];
  private isConnected: boolean = false;

  constructor(
    private notionToken: string,
    private notionVersion: string = '2022-06-28'
  ) {}

  /**
   * Start the Notion MCP server and connect to it
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Already connected to Notion MCP server');
      return;
    }

    try {
      // Start the Notion MCP server process
      this.mcpProcess = spawn('npx', ['-y', '@notionhq/notion-mcp-server'], {
        env: {
          ...process.env,
          OPENAPI_MCP_HEADERS: JSON.stringify({
            Authorization: `Bearer ${this.notionToken}`,
            'Notion-Version': this.notionVersion
          })
        }
      });

      // Handle process output for debugging
      this.mcpProcess.stdout?.on('data', (data) => {
        console.log(`Notion MCP stdout: ${data}`);
      });

      this.mcpProcess.stderr?.on('data', (data) => {
        console.error(`Notion MCP stderr: ${data}`);
      });

      this.mcpProcess.on('error', (error) => {
        console.error('Failed to start Notion MCP server:', error);
        throw error;
      });

      // Create MCP server client
      this.server = new Server(
        { name: 'notion-mcp-client', version: '1.0.0' },
        { capabilities: { tools: {} } }
      );

      // Connect to the MCP server
      const transport = new StdioServerTransport(
        this.mcpProcess.stdout as Readable, 
        this.mcpProcess.stdin as Writable
      );
      await this.server.connect(transport);

      // Fetch available tools
      await this.fetchTools();
      
      this.isConnected = true;
      console.log('Connected to Notion MCP server');
    } catch (error) {
      console.error('Error connecting to Notion MCP server:', error);
      this.disconnect();
      throw error;
    }
  }

  /**
   * Disconnect from the Notion MCP server
   */
  disconnect(): void {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
      this.mcpProcess = null;
    }
    this.server = null;
    this.isConnected = false;
    console.log('Disconnected from Notion MCP server');
  }

  /**
   * Fetch available tools from the Notion MCP server
   */
  private async fetchTools(): Promise<void> {
    if (!this.server) {
      throw new Error('Not connected to Notion MCP server');
    }

    try {
      const response = await this.server.sendRequest(ListToolsRequestSchema, {});
      this.tools = response.tools;
      console.log(`Fetched ${this.tools.length} tools from Notion MCP server`);
    } catch (error) {
      console.error('Error fetching tools from Notion MCP server:', error);
      throw error;
    }
  }

  /**
   * Get all available tools
   */
  getTools(): Tool[] {
    return this.tools;
  }

  /**
   * Call a tool on the Notion MCP server
   */
  async callTool(toolName: string, args: any): Promise<any> {
    if (!this.server || !this.isConnected) {
      throw new Error('Not connected to Notion MCP server');
    }

    try {
      const response = await this.server.sendRequest(CallToolRequestSchema, {
        name: toolName,
        arguments: args
      });

      // Parse the response content
      if (response.content && response.content.length > 0) {
        const content = response.content[0];
        if (content.type === 'text') {
          try {
            return JSON.parse(content.text);
          } catch (e) {
            return content.text;
          }
        }
        return content;
      }
      
      return response;
    } catch (error) {
      console.error(`Error calling tool ${toolName}:`, error);
      throw error;
    }
  }

  /**
   * Search for content in Notion
   */
  async search(query: string): Promise<any> {
    return this.callTool('notion-search', { query });
  }

  /**
   * Get a page from Notion
   */
  async getPage(pageId: string): Promise<any> {
    return this.callTool('notion-pages-retrieve', { page_id: pageId });
  }

  /**
   * Create a new page in Notion
   */
  async createPage(parentId: string, title: string, content: any = {}): Promise<any> {
    return this.callTool('notion-pages-create', {
      parent: { page_id: parentId },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title
              }
            }
          ]
        },
        ...content
      }
    });
  }

  /**
   * Add a comment to a page
   */
  async addComment(pageId: string, comment: string): Promise<any> {
    return this.callTool('notion-comments-create', {
      parent: { page_id: pageId },
      rich_text: [
        {
          text: {
            content: comment
          }
        }
      ]
    });
  }

  /**
   * Get a database from Notion
   */
  async getDatabase(databaseId: string): Promise<any> {
    return this.callTool('notion-databases-retrieve', { database_id: databaseId });
  }

  /**
   * Query a database in Notion
   */
  async queryDatabase(databaseId: string, filter: any = {}): Promise<any> {
    return this.callTool('notion-databases-query', {
      database_id: databaseId,
      filter
    });
  }
}
