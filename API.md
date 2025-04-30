# API Documentation

This document provides detailed API documentation for the Notion and Google Drive MCP Integration App.

## UnifiedKnowledgeRepository

The main class that provides a unified interface for interacting with both Notion and Google Drive.

### Constructor

```typescript
constructor(
  notionToken: string,
  notionVersion: string = '2022-06-28',
  clientId: string,
  clientSecret: string,
  credsDir: string
)
```

### Methods

#### Connection Management

- **connect()**: `Promise<void>` - Connect to both Notion and Google Drive MCPs
- **disconnect()**: `void` - Disconnect from both services
- **isConnected()**: `boolean` - Check if connected to both services

#### Cross-Platform Operations

- **search(query: string)**: `Promise<{notion: NotionSearchResult, gdrive: GDriveSearchResult}>` - Search across both platforms
- **getAvailableTools()**: `{notion: Tool[], gdrive: Tool[]}` - Get available tools from both services

#### Notion-Specific Operations

- **getNotionPage(pageId: string)**: `Promise<any>` - Get a page from Notion
- **createNotionPage(parentId: string, title: string, content?: any)**: `Promise<any>` - Create a new page in Notion
- **addNotionComment(pageId: string, comment: string)**: `Promise<any>` - Add a comment to a Notion page
- **queryNotionDatabase(databaseId: string, filter?: any)**: `Promise<any>` - Query a Notion database
- **callNotionTool(toolName: string, args: any)**: `Promise<any>` - Call a specific Notion tool directly

#### Google Drive-Specific Operations

- **readGDriveFile(fileId: string)**: `Promise<any>` - Read a file from Google Drive
- **listGDriveFiles(cursor?: string)**: `Promise<any>` - List files from Google Drive
- **readGSheet(spreadsheetId: string, ranges?: string[], sheetId?: number)**: `Promise<any>` - Read data from a Google Spreadsheet
- **updateGSheetCell(fileId: string, range: string, value: string)**: `Promise<any>` - Update a cell in a Google Spreadsheet
- **callGDriveTool(toolName: string, args: any)**: `Promise<any>` - Call a specific Google Drive tool directly

## NotionRepository

Higher-level interface for interacting with Notion.

### Constructor

```typescript
constructor(notionToken: string, notionVersion: string = '2022-06-28')
```

### Methods

- **connect()**: `Promise<void>` - Connect to Notion MCP
- **disconnect()**: `void` - Disconnect from Notion MCP
- **search(query: string)**: `Promise<any>` - Search for content in Notion
- **getPage(pageId: string)**: `Promise<any>` - Get a page from Notion
- **createPage(parentId: string, title: string, content?: any)**: `Promise<any>` - Create a new page in Notion
- **addComment(pageId: string, comment: string)**: `Promise<any>` - Add a comment to a page
- **getDatabase(databaseId: string)**: `Promise<any>` - Get a database from Notion
- **queryDatabase(databaseId: string, filter?: any)**: `Promise<any>` - Query a database in Notion
- **getAvailableTools()**: `any[]` - Get all available tools from the Notion MCP
- **callTool(toolName: string, args: any)**: `Promise<any>` - Call a specific tool directly

## GDriveRepository

Higher-level interface for interacting with Google Drive.

### Constructor

```typescript
constructor(clientId: string, clientSecret: string, credsDir: string)
```

### Methods

- **connect()**: `Promise<void>` - Connect to Google Drive MCP
- **disconnect()**: `void` - Disconnect from Google Drive MCP
- **listFiles(cursor?: string)**: `Promise<any>` - List files from Google Drive
- **searchFiles(query: string, pageToken?: string, pageSize?: number)**: `Promise<any>` - Search for files in Google Drive
- **readFile(fileId: string)**: `Promise<any>` - Read a file from Google Drive
- **readResource(fileId: string)**: `Promise<any>` - Read a resource directly using the resource URI
- **readSheet(spreadsheetId: string, ranges?: string[], sheetId?: number)**: `Promise<any>` - Read data from a Google Spreadsheet
- **updateSheetCell(fileId: string, range: string, value: string)**: `Promise<any>` - Update a cell in a Google Spreadsheet
- **getAvailableTools()**: `any[]` - Get all available tools from the Google Drive MCP
- **callTool(toolName: string, args: any)**: `Promise<any>` - Call a specific tool directly
