
'use server';

/**
 * @fileOverview Provides a deep-dive analysis on a specific sub-topic of a disease.
 *
 * - getDeepDive - Fetches detailed information on a specific health topic.
 * - DeepDiveInput - Input type for the function.
 * - DeepDiveOutput - Return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DeepDiveInputSchema = z.object({
  diseaseName: z.string().describe('The name of the main disease or health condition.'),
  topic: z.string().describe('The specific sub-topic to get detailed information about (e.g., "deep diet", "treatment options").'),
  language: z.string().describe("The language for the response (e.g., 'en' for English, 'te' for Telugu)."),
});
type DeepDiveInput = z.infer<typeof DeepDiveInputSchema>;

const DeepDiveOutputSchema = z.object({
  topic: z.string().describe("The specific topic that was analyzed."),
  details: z.string().describe("A detailed, in-depth explanation of the requested topic related to the disease. Formatted as a single string with newline characters for paragraphs."),
});
export type DeepDiveOutput = z.infer<typeof DeepDiveOutputSchema>;


const prompt = ai.definePrompt({
  name: 'deepDivePrompt',
  input: { schema: DeepDiveInputSchema },
  output: { schema: DeepDiveOutputSchema },
  prompt: `You are a highly specialized medical AI expert. Your task is to provide a detailed, in-depth explanation about a specific aspect of a health condition.
  The response must be in the specified language: {{language}}.

  The user is asking for a deep dive on the topic: "{{topic}}" for the disease: "{{diseaseName}}".

  Provide a comprehensive, well-structured, and easy-to-understand explanation. Use paragraphs to structure the response.

  For example, if the topic is "deep diet", you should provide a very detailed diet plan, explaining the scientific reasons behind food choices, listing micronutrients, and giving sample meal plans.
  If the topic is "deep testing", you should explain not just the names of the tests, but what they measure, how they are performed, and what the results indicate in detail.

  IMPORTANT: This information is for educational purposes. Conclude your response with a clear disclaimer that this is not medical advice and the user must consult a qualified healthcare professional.
  `,
});

const deepDiveFlow = ai.defineFlow(
  {
    name: 'deepDiveFlow',
    inputSchema: DeepDiveInputSchema,
    outputSchema: DeepDiveOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function getDeepDive(input: DeepDiveInput): Promise<DeepDiveOutput> {
  return deepDiveFlow(input);
}
