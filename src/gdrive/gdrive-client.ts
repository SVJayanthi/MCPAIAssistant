import { ChildProcess, spawn } from 'child_process';
import { Readable, Writable } from 'stream';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema, ListResourcesRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Tool } from '../shared/types.js';

export class GDriveMCPClient {
  private mcpProcess: ChildProcess | null = null;
  private server: Server | null = null;
  private tools: Tool[] = [];
  private isConnected: boolean = false;

  constructor(
    private clientId: string,
    private clientSecret: string,
    private credsDir: string
  ) {}

  /**
   * Start the Google Drive MCP server and connect to it
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Already connected to Google Drive MCP server');
      return;
    }

    try {
      // Start the Google Drive MCP server process
      this.mcpProcess = spawn('npx', ['-y', '@isaacphi/mcp-gdrive'], {
        env: {
          ...process.env,
          CLIENT_ID: this.clientId,
          CLIENT_SECRET: this.clientSecret,
          GDRIVE_CREDS_DIR: this.credsDir
        }
      });

      // Handle process output for debugging
      this.mcpProcess.stdout?.on('data', (data) => {
        console.log(`GDrive MCP stdout: ${data}`);
      });

      this.mcpProcess.stderr?.on('data', (data) => {
        console.error(`GDrive MCP stderr: ${data}`);
      });

      this.mcpProcess.on('error', (error) => {
        console.error('Failed to start Google Drive MCP server:', error);
        throw error;
      });

      // Create MCP server client
      this.server = new Server(
        { name: 'gdrive-mcp-client', version: '1.0.0' },
        { capabilities: { tools: {}, resources: { schemes: ['gdrive'], listable: true, readable: true } } }
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
      console.log('Connected to Google Drive MCP server');
    } catch (error) {
      console.error('Error connecting to Google Drive MCP server:', error);
      this.disconnect();
      throw error;
    }
  }

  /**
   * Disconnect from the Google Drive MCP server
   */
  disconnect(): void {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
      this.mcpProcess = null;
    }
    this.server = null;
    this.isConnected = false;
    console.log('Disconnected from Google Drive MCP server');
  }

  /**
   * Fetch available tools from the Google Drive MCP server
   */
  private async fetchTools(): Promise<void> {
    if (!this.server) {
      throw new Error('Not connected to Google Drive MCP server');
    }

    try {
      const response = await this.server.sendRequest(ListToolsRequestSchema, {});
      this.tools = response.tools;
      console.log(`Fetched ${this.tools.length} tools from Google Drive MCP server`);
    } catch (error) {
      console.error('Error fetching tools from Google Drive MCP server:', error);
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
   * Call a tool on the Google Drive MCP server
   */
  async callTool(toolName: string, args: any): Promise<any> {
    if (!this.server || !this.isConnected) {
      throw new Error('Not connected to Google Drive MCP server');
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
   * List resources (files) from Google Drive
   */
  async listResources(cursor?: string): Promise<any> {
    if (!this.server || !this.isConnected) {
      throw new Error('Not connected to Google Drive MCP server');
    }

    try {
      const response = await this.server.sendRequest(ListResourcesRequestSchema, { cursor });
      return response;
    } catch (error) {
      console.error('Error listing resources from Google Drive:', error);
      throw error;
    }
  }

  /**
   * Read a resource (file) from Google Drive
   */
  async readResource(fileId: string): Promise<any> {
    if (!this.server || !this.isConnected) {
      throw new Error('Not connected to Google Drive MCP server');
    }

    try {
      const response = await this.server.sendRequest(ReadResourceRequestSchema, {
        uri: `gdrive:///${fileId}`
      });
      return response;
    } catch (error) {
      console.error(`Error reading resource ${fileId} from Google Drive:`, error);
      throw error;
    }
  }

  /**
   * Search for files in Google Drive
   */
  async searchFiles(query: string, pageToken?: string, pageSize?: number): Promise<any> {
    return this.callTool('gdrive_search', { query, pageToken, pageSize });
  }

  /**
   * Read a file from Google Drive
   */
  async readFile(fileId: string): Promise<any> {
    return this.callTool('gdrive_read_file', { fileId });
  }

  /**
   * Read data from a Google Spreadsheet
   */
  async readSheet(spreadsheetId: string, ranges?: string[], sheetId?: number): Promise<any> {
    return this.callTool('gsheets_read', { spreadsheetId, ranges, sheetId });
  }

  /**
   * Update a cell in a Google Spreadsheet
   */
  async updateSheetCell(fileId: string, range: string, value: string): Promise<any> {
    return this.callTool('gsheets_update_cell', { fileId, range, value });
  }
}
