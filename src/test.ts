import dotenv from 'dotenv';
import { UnifiedKnowledgeRepository } from './shared/unified-repository.js';

// Load environment variables
dotenv.config();

/**
 * Test suite for the unified knowledge repository
 */
async function runTests() {
  console.log('=== STARTING APPLICATION TESTS ===');
  
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
    // Test 1: Connection
    console.log('\nTest 1: Connection to both services');
    await repo.connect();
    console.log('✅ Successfully connected to both Notion and Google Drive');
    
    // Test 2: Get available tools
    console.log('\nTest 2: Get available tools');
    const tools = repo.getAvailableTools();
    console.log('Notion tools:', tools.notion.length);
    console.log('Google Drive tools:', tools.gdrive.length);
    if (tools.notion.length > 0 && tools.gdrive.length > 0) {
      console.log('✅ Successfully retrieved tools from both services');
    } else {
      throw new Error('Failed to retrieve tools from both services');
    }
    
    // Test 3: Search across both platforms
    console.log('\nTest 3: Search across both platforms');
    const searchResults = await repo.search('document');
    console.log('Notion results count:', searchResults.notion?.results?.length || 0);
    console.log('Google Drive results count:', searchResults.gdrive?.files?.length || 0);
    console.log('✅ Successfully searched across both platforms');
    
    // Test 4: Notion specific operations
    console.log('\nTest 4: Notion specific operations');
    if (searchResults.notion?.results?.length > 0) {
      const pageId = searchResults.notion.results[0].id;
      console.log(`Getting Notion page with ID: ${pageId}`);
      const page = await repo.getNotionPage(pageId);
      console.log('✅ Successfully retrieved Notion page');
    } else {
      console.log('⚠️ Skipping Notion page retrieval (no search results)');
    }
    
    // Test 5: Google Drive specific operations
    console.log('\nTest 5: Google Drive specific operations');
    if (searchResults.gdrive?.files?.length > 0) {
      const fileId = searchResults.gdrive.files[0].id;
      console.log(`Reading Google Drive file with ID: ${fileId}`);
      const file = await repo.readGDriveFile(fileId);
      console.log('✅ Successfully read Google Drive file');
      
      // Test Google Sheets if a spreadsheet is found
      const spreadsheet = searchResults.gdrive.files.find(f => f.mimeType === 'application/vnd.google-apps.spreadsheet');
      if (spreadsheet) {
        console.log(`Reading Google Sheet with ID: ${spreadsheet.id}`);
        const sheet = await repo.readGSheet(spreadsheet.id);
        console.log('✅ Successfully read Google Sheet');
      } else {
        console.log('⚠️ Skipping Google Sheet test (no spreadsheet found)');
      }
    } else {
      console.log('⚠️ Skipping Google Drive file reading (no search results)');
    }
    
    console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY ===');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
  } finally {
    // Disconnect when done
    repo.disconnect();
    console.log('Disconnected from all services');
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests };
