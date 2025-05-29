import { createOllama } from 'ollama-ai-provider';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


const ollama = createOllama({
    baseURL: 'http://localhost:11434/api',
});

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: ollama('qwen3:0.6b', {simulateStreaming: true}),
        messages,
        tools: {
            weather: tool({
                description: 'Get the weather in a location (fahrenheit)',
                parameters: z.object({
                    location: z.string().describe('The location to get the weather for'),
                }),
                execute: async ({ location }) => {
                    const temperature = Math.round(Math.random() * (90 - 32) + 32);
                    return {
                        location,
                        temperature,
                    };
                },
            }),
        },
        maxSteps: 10,
        toolCallStreaming: true,
        toolChoice: 'auto',
        system: 'You are a helpful assistant that can answer questions and help with tasks.',
    });

    return result.toDataStreamResponse();
}
