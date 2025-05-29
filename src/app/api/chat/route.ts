import { createOllama } from 'ollama-ai-provider';
import { streamText } from 'ai';

import { getMCPTools, closeMCPClients } from '@/app/tools/mcpTools';
import { getGenericTools } from '@/app/tools/genericTools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const ollama = createOllama({
    baseURL: 'http://localhost:11434/api',
});

// Initialize tools once at module level
let mcpToolsPromise = getMCPTools();
const genericTools = getGenericTools();

export async function POST(req: Request) {
    const { messages } = await req.json();
    const mcpTools = await mcpToolsPromise;

    const result = streamText({
        model: ollama('qwen3:0.6b', {simulateStreaming: true}),
        messages,
        tools: {
            ...mcpTools,
            ...genericTools
        },
        onStepFinish: async (result) => {
            console.log(result);
        },
        maxSteps: 10,
        toolCallStreaming: true,
        toolChoice: 'auto',
        system: 'You are a helpful assistant that can answer questions and help with tasks.',
    });

    return result.toDataStreamResponse();
}
