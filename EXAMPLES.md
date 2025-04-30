# Notion and Google Drive MCP Integration App - Usage Examples

This document provides practical examples of how to use the application for various common tasks.

## Basic Setup and Connection

```typescript
import { UnifiedKnowledgeRepository } from './shared/unified-repository.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create the repository
const repo = new UnifiedKnowledgeRepository(
  process.env.NOTION_TOKEN!,
  process.env.NOTION_VERSION || '2022-06-28',
  process.env.CLIENT_ID!,
  process.env.CLIENT_SECRET!,
  process.env.GDRIVE_CREDS_DIR!
);

// Connect to both services
await repo.connect();

// Always disconnect when done
repo.disconnect();
```

## Searching Across Both Platforms

```typescript
// Search for documents containing "project plan"
const results = await repo.search("project plan");

// Process Notion results
console.log(`Found ${results.notion.results.length} Notion items`);
results.notion.results.forEach(item => {
  console.log(`- ${item.object}: ${item.title || item.id}`);
});

// Process Google Drive results
console.log(`Found ${results.gdrive.files.length} Google Drive files`);
results.gdrive.files.forEach(file => {
  console.log(`- ${file.name} (${file.mimeType})`);
});
```

## Working with Notion

### Reading a Page

```typescript
const pageId = "1a2b3c4d5e6f7g8h9i0j";
const page = await repo.getNotionPage(pageId);
console.log(`Page title: ${page.properties.title.title[0].plain_text}`);
```

### Creating a New Page

```typescript
// Create a page under a parent page
const parentId = "1a2b3c4d5e6f7g8h9i0j";
const newPage = await repo.createNotionPage(
  parentId,
  "My New Page",
  {
    // Additional properties
    tags: {
      multi_select: [
        { name: "important" },
        { name: "documentation" }
      ]
    }
  }
);
console.log(`Created new page with ID: ${newPage.id}`);
```

### Adding a Comment

```typescript
const pageId = "1a2b3c4d5e6f7g8h9i0j";
await repo.addNotionComment(pageId, "This is an important document!");
```

### Querying a Database

```typescript
const databaseId = "1a2b3c4d5e6f7g8h9i0j";
const filter = {
  property: "Status",
  select: {
    equals: "In Progress"
  }
};
const results = await repo.queryNotionDatabase(databaseId, filter);
console.log(`Found ${results.results.length} matching items`);
```

## Working with Google Drive

### Listing Files

```typescript
// List files (first page)
const files = await repo.listGDriveFiles();
console.log(`Files: ${files.resources.map(r => r.name).join(', ')}`);

// Get next page if available
if (files.nextCursor) {
  const nextPage = await repo.listGDriveFiles(files.nextCursor);
  console.log(`More files: ${nextPage.resources.map(r => r.name).join(', ')}`);
}
```

### Reading a File

```typescript
const fileId = "1a2b3c4d5e6f7g8h9i0j";
const fileContent = await repo.readGDriveFile(fileId);
console.log(`File content: ${fileContent}`);
```

### Working with Google Sheets

```typescript
// Read a spreadsheet
const spreadsheetId = "1a2b3c4d5e6f7g8h9i0j";
const sheetData = await repo.readGSheet(spreadsheetId);
console.log(`Sheet data: ${JSON.stringify(sheetData)}`);

// Read specific ranges
const rangeData = await repo.readGSheet(spreadsheetId, ["Sheet1!A1:B10", "Sheet2!C5:D15"]);

// Update a cell
await repo.updateGSheetCell(spreadsheetId, "Sheet1!A1", "New Value");
```

## Advanced Usage

### Using Direct Tool Access

```typescript
// Call a specific Notion tool directly
const notionToolResult = await repo.callNotionTool("notion-blocks-children-list", {
  block_id: "1a2b3c4d5e6f7g8h9i0j"
});

// Call a specific Google Drive tool directly
const gdriveToolResult = await repo.callGDriveTool("gdrive_search", {
  query: "budget spreadsheet",
  pageSize: 5
});
```

### Error Handling

```typescript
try {
  await repo.connect();
  const results = await repo.search("project plan");
  // Process results...
} catch (error) {
  if (error.message.includes("Not connected")) {
    console.error("Connection error:", error.message);
  } else if (error.message.includes("Authentication")) {
    console.error("Authentication error:", error.message);
  } else {
    console.error("Unexpected error:", error);
  }
} finally {
  repo.disconnect();
}
```
