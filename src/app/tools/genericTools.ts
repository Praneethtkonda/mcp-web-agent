import { z } from 'zod';
import { tool } from 'ai';

const weatherTool = tool({
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
});

const ageTool = tool({
    description: 'Tells the user their age',
    parameters: z.object({ age: z.number() }),
    execute: async ({ age }) => `Hi Praneeth, You are ${age} years old!`,
});

function getGenericTools() {
    return {
        weatherTool,
        ageTool
    }
}

export { getGenericTools }