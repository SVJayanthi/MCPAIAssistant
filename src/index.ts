import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { UnifiedKnowledgeRepository } from './shared/unified-repository.js';

// Load environment variables
dotenv.config();

/**
 * Main application entry point
 */
async function main() {
  // Get configuration from environment variables
  const notionToken = process.env.NOTION_TOKEN;
  const notionVersion = process.env.NOTION_VERSION || '2022-06-28';
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const credsDir = process.env.GDRIVE_CREDS_DIR;
  
  // Check required environment variables
  if (!notionToken || !clientId || !clientSecret || !credsDir) {
    console.error('Missing required environment variables:');
    if (!notionToken) console.error('- NOTION_TOKEN');
    if (!clientId) console.error('- CLIENT_ID');
    if (!clientSecret) console.error('- CLIENT_SECRET');
    if (!credsDir) console.error('- GDRIVE_CREDS_DIR');
    process.exit(1);
  }
  
  // Create unified repository
  const repo = new UnifiedKnowledgeRepository(
    notionToken,
    notionVersion,
    clientId,
    clientSecret,
    credsDir
  );
  
  try {
    // Connect to both services
    console.log('Connecting to knowledge repositories...');
    await repo.connect();
    console.log('Successfully connected to both Notion and Google Drive');
    
    // Get available tools
    const tools = repo.getAvailableTools();
    console.log('Available Notion tools:', tools.notion.map(t => t.name).join(', '));
    console.log('Available Google Drive tools:', tools.gdrive.map(t => t.name).join(', '));
    
    // Example: Search across both platforms
    const query = 'document';
    console.log(`Searching for "${query}" across both platforms...`);
    const searchResults = await repo.search(query);
    
    console.log('Notion search results:');
    console.log(JSON.stringify(searchResults.notion, null, 2));
    
    console.log('Google Drive search results:');
    console.log(JSON.stringify(searchResults.gdrive, null, 2));
    
    // Disconnect when done
    repo.disconnect();
    console.log('Disconnected from all services');
  } catch (error) {
    console.error('Error in main application:', error);
    repo.disconnect();
  }
}

// Only run if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}

export { main };
