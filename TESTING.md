# Notion and Google Drive MCP Integration App - Test Instructions

This document provides instructions for testing the application functionality.

## Prerequisites

Before running the tests, make sure you have:

1. Set up all required environment variables as described in SETUP.md
2. Built the application with `npm run build`
3. Ensured you have active internet connection

## Running the Tests

To run the comprehensive test suite:

```bash
npm test
```

This will execute the test.ts file which performs the following tests:

1. **Connection Test**: Verifies the application can connect to both Notion and Google Drive MCPs
2. **Tools Retrieval Test**: Checks that the application can retrieve available tools from both services
3. **Search Test**: Tests the unified search functionality across both platforms
4. **Notion Operations Test**: Tests Notion-specific operations like page retrieval
5. **Google Drive Operations Test**: Tests Google Drive-specific operations like file reading and spreadsheet access

## Manual Testing

You can also manually test specific functionality:

1. **Run the main application**:
   ```bash
   npm start
   ```

2. **Test Notion integration only**:
   ```bash
   ts-node --esm src/notion/test-notion.ts
   ```

3. **Test Google Drive integration only**:
   ```bash
   ts-node --esm src/gdrive/test-gdrive.ts
   ```

## Troubleshooting

If you encounter issues during testing:

1. Check that all environment variables are correctly set
2. Ensure your Notion integration has access to the pages you're trying to access
3. Verify that your Google OAuth credentials are valid and have the required scopes
4. Check the console output for specific error messages
5. For Google Drive authentication issues, you may need to re-authenticate by running the Google Drive MCP server directly
