export interface Tool {
  name: string;
  description: string;
  inputSchema: any;
  returnSchema?: any;
}

export interface MCPResponse {
  content: Array<{
    type: string;
    text?: string;
    [key: string]: any;
  }>;
  isError?: boolean;
  _meta?: any;
}

export interface NotionPage {
  id: string;
  title: string;
  url: string;
  properties: Record<string, any>;
  content?: any;
}

export interface NotionDatabase {
  id: string;
  title: string;
  properties: Record<string, any>;
  items?: NotionPage[];
}

export interface NotionSearchResult {
  results: Array<{
    id: string;
    object: string;
    title?: string;
    url?: string;
    [key: string]: any;
  }>;
  next_cursor: string | null;
  has_more: boolean;
}
