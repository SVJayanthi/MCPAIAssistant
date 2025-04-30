# Notion and Google Drive MCP Integration App - Environment Setup

To run this application, you need to set up the following environment variables. Create a `.env` file in the root directory with the following content:

```
# Notion Configuration
NOTION_TOKEN=your_notion_integration_token
NOTION_VERSION=2022-06-28

# Google Drive Configuration
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
GDRIVE_CREDS_DIR=/path/to/credentials/directory
```

## Obtaining Credentials

### Notion
1. Go to https://www.notion.so/profile/integrations and create a new internal integration
2. Copy the integration secret token (format: `ntn_****`)
3. Make sure to connect your integration to the pages you want to access

### Google Drive
1. Create a new Google Cloud project
2. Enable the Google Drive API, Google Sheets API, and Google Docs API
3. Configure an OAuth consent screen (internal is fine for testing)
4. Add OAuth scopes:
   - https://www.googleapis.com/auth/drive.readonly
   - https://www.googleapis.com/auth/spreadsheets
5. Create an OAuth Client ID for application type "Desktop App"
6. Download the JSON file of your client's OAuth keys
7. Rename the key file to `gcp-oauth.keys.json` and place it in your credentials directory
8. Set the GDRIVE_CREDS_DIR to point to this directory
