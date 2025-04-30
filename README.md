# Notion and Google Drive MCP Integration App

This application integrates both the Notion MCP and Google Drive MCP to enable chatting with, reading, writing, and updating content in both knowledge repositories.

## Features

- Connect to both Notion and Google Drive through their respective MCP servers
- Search across both platforms with a unified interface
- Read and write content in Notion (pages, databases, comments)
- Read files from Google Drive and interact with Google Sheets
- Unified API for working with both knowledge repositories

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables (see [SETUP.md](SETUP.md) for details)
4. Build the application:
```bash
npm run build
```

## Usage

### Running the Application

To start the application:

```bash
npm start
```

This will connect to both Notion and Google Drive MCPs and perform a sample search across both platforms.

### Using the Unified Repository

```typescript
import { UnifiedKnowledgeRepository } from './shared/unified-repository.js';

// Create the repository with your credentials
const repo = new UnifiedKnowledgeRepository(
  notionToken,
  notionVersion,
  clientId,
  clientSecret,
  credsDir
);

// Connect to both services
await repo.connect();

// Search across both platforms
const results = await repo.search('your search query');

// Work with Notion
const notionPage = await repo.getNotionPage('page-id');
await repo.createNotionPage('parent-id', 'New Page Title');
await repo.addNotionComment('page-id', 'This is a comment');

// Work with Google Drive
const files = await repo.listGDriveFiles();
const fileContent = await repo.readGDriveFile('file-id');
const sheetData = await repo.readGSheet('spreadsheet-id');
await repo.updateGSheetCell('spreadsheet-id', 'A1', 'New Value');

// Disconnect when done
repo.disconnect();
```

## Testing

See [TESTING.md](TESTING.md) for detailed testing instructions.

## Architecture

The application is structured into three main components:

1. **Notion Integration**
   - `NotionMCPClient`: Low-level client for interacting with the Notion MCP server
   - `NotionRepository`: Higher-level interface for Notion operations

2. **Google Drive Integration**
   - `GDriveMCPClient`: Low-level client for interacting with the Google Drive MCP server
   - `GDriveRepository`: Higher-level interface for Google Drive operations

3. **Unified Interface**
   - `UnifiedKnowledgeRepository`: Single interface for interacting with both knowledge repositories

## Requirements

- Node.js 16+
- Notion integration token
- Google Cloud project with Drive and Sheets APIs enabled
- OAuth credentials for Google APIs

## License

ISC
