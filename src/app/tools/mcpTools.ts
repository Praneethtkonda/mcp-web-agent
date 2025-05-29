import { experimental_createMCPClient as createMCPClient } from 'ai';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'path';

type MCPClient = Awaited<ReturnType<typeof createMCPClient>>;
const clients: MCPClient[] = [];

const stdioMcpClient = await createMCPClient({
    transport: new StdioClientTransport({
      command: 'node',
      args: ['../mcp-server-filesystem/dist/index.js', process.cwd()],
    }),
  });

clients.push(stdioMcpClient);

async function getMCPTools() {
    const tools = await stdioMcpClient.tools();
    return tools;
}

async function closeMCPClients() {
    for (const client of clients) {
        await client.close();
    }
}


export { getMCPTools, closeMCPClients };