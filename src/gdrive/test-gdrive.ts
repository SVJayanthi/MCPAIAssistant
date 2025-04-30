import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GDriveRepository } from './gdrive-repository.js';

// Load environment variables
dotenv.config();

/**
 * Example usage of the Google Drive MCP integration
 */
async function testGDriveIntegration() {
  // Get Google Drive credentials from environment variables
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const credsDir = process.env.GDRIVE_CREDS_DIR;
  
  if (!clientId || !clientSecret || !credsDir) {
    console.error('CLIENT_ID, CLIENT_SECRET, and GDRIVE_CREDS_DIR environment variables are required');
    process.exit(1);
  }
  
  // Create Google Drive repository
  const gdriveRepo = new GDriveRepository(clientId, clientSecret, credsDir);
  
  try {
    // Connect to Google Drive MCP
    console.log('Connecting to Google Drive MCP...');
    await gdriveRepo.connect();
    
    // Get available tools
    const tools = gdriveRepo.getAvailableTools();
    console.log(`Available Google Drive tools: ${tools.map(t => t.name).join(', ')}`);
    
    // Example: List files
    console.log('Listing files...');
    const files = await gdriveRepo.listFiles();
    console.log('Files:', JSON.stringify(files, null, 2));
    
    // Example: Search for files
    console.log('Searching for files...');
    const searchResults = await gdriveRepo.searchFiles('document');
    console.log('Search results:', JSON.stringify(searchResults, null, 2));
    
    // Disconnect when done
    gdriveRepo.disconnect();
    console.log('Disconnected from Google Drive MCP');
  } catch (error) {
    console.error('Error testing Google Drive integration:', error);
    gdriveRepo.disconnect();
  }
}

// Only run if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  testGDriveIntegration().catch(console.error);
}
