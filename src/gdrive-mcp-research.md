# Google Drive MCP Research

## Overview
The Google Drive MCP (Model Context Protocol) Server is a tool that integrates with Google Drive to allow AI assistants to interact with Google Drive files and Google Sheets. It provides capabilities for listing, reading, and searching files, as well as reading from and writing to Google Sheets.

## Key Components

### Available Tools
1. **gdrive_search**:
   - Search for files in Google Drive
   - Parameters: query, pageToken (optional), pageSize (optional)
   - Returns file names and MIME types of matching files

2. **gdrive_read_file**:
   - Read contents of a file from Google Drive
   - Parameters: fileId
   - Returns the contents of the specified file

3. **gsheets_read**:
   - Read data from a Google Spreadsheet with flexible options
   - Parameters: spreadsheetId, ranges (optional), sheetId (optional)
   - Returns the specified data from the spreadsheet

4. **gsheets_update_cell**:
   - Update a cell value in a Google Spreadsheet
   - Parameters: fileId, range, value
   - Returns confirmation of the updated value

### File Support
- Supports all file types in Google Drive
- Google Workspace files are automatically exported:
  - Docs → Markdown
  - Sheets → CSV
  - Presentations → Plain text
  - Drawings → PNG
- Other files are provided in their native format

## Setup Requirements

### Google Cloud Setup
1. Create a new Google Cloud project
2. Enable the Google Drive API
3. Configure an OAuth consent screen ("internal" is fine for testing)
4. Add OAuth scopes:
   - `https://www.googleapis.com/auth/drive.readonly`
   - `https://www.googleapis.com/auth/spreadsheets`
5. Enable Google Sheets API and Google Docs API
6. Create an OAuth Client ID for application type "Desktop App"
7. Download the JSON file of client's OAuth keys
8. Rename key file to `gcp-oauth.keys.json` and place in specified path

### Environment Configuration
- Set up a `.env` file with:
  ```
  GDRIVE_CREDS_DIR=/path/to/config/directory
  CLIENT_ID=<CLIENT_ID>
  CLIENT_SECRET=<CLIENT_SECRET>
  ```

### Authentication Process
- Build server with `npm run build` or `npm run watch`
- Run `node ./dist/index.js` to trigger authentication
- Authenticate with browser (must use account in same organization as Google Cloud project)
- OAuth token is saved in the directory specified by `GDRIVE_CREDS_DIR`

## Integration Method
Add to app's server configuration:
```json
{
  "mcpServers": {
    "gdrive": {
      "command": "npx",
      "args": ["-y", "@isaacphi/mcp-gdrive"],
      "env": {
        "CLIENT_ID": "<CLIENT_ID>",
        "CLIENT_SECRET": "<CLIENT_SECRET>",
        "GDRIVE_CREDS_DIR": "/path/to/config/directory"
      }
    }
  }
}
```

## Technical Details
- Written in TypeScript
- Uses Google Drive API and Google Sheets API
- Requires OAuth authentication
- Licensed under MIT License

## Repository Structure
- `/dist`: Compiled JavaScript files
- `/node_modules`: Dependencies
- `/tools`: Helper tools
- Core files:
  - `auth.ts`: Authentication handling
  - `index.ts`: Main entry point
  - Configuration files: package.json, tsconfig.json

## Integration Approach
To integrate this into our application, we'll need to:
1. Set up Google Cloud project and OAuth credentials
2. Configure the MCP server with appropriate environment variables
3. Implement authentication flow
4. Create functions to interact with Google Drive files and Google Sheets
5. Handle the various file types and conversions
