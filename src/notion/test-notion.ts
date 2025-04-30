import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { NotionRepository } from './notion-repository.js';

// Load environment variables
dotenv.config();

/**
 * Example usage of the Notion MCP integration
 */
async function testNotionIntegration() {
  // Get Notion token from environment variables
  const notionToken = process.env.NOTION_TOKEN;
  
  if (!notionToken) {
    console.error('NOTION_TOKEN environment variable is required');
    process.exit(1);
  }
  
  // Create Notion repository
  const notionRepo = new NotionRepository(notionToken);
  
  try {
    // Connect to Notion MCP
    console.log('Connecting to Notion MCP...');
    await notionRepo.connect();
    
    // Get available tools
    const tools = notionRepo.getAvailableTools();
    console.log(`Available Notion tools: ${tools.map(t => t.name).join(', ')}`);
    
    // Example: Search for content
    console.log('Searching for content...');
    const searchResults = await notionRepo.search('Getting started');
    console.log('Search results:', JSON.stringify(searchResults, null, 2));
    
    // Disconnect when done
    notionRepo.disconnect();
    console.log('Disconnected from Notion MCP');
  } catch (error) {
    console.error('Error testing Notion integration:', error);
    notionRepo.disconnect();
  }
}

// Only run if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  testNotionIntegration().catch(console.error);
}
