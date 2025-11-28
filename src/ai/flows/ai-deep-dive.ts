
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
import { previousAppointments } from '@/lib/appointments-data';

const DeepDiveInputSchema = z.object({
  diseaseName: z.string().describe('The name of the main disease or health condition.'),
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

  The user is asking for a deep dive on the topic: "summary of follow-ups" for the disease: "{{diseaseName}}".

  Based on the provided JSON data of the patient's full appointment history, find the entry for "{{diseaseName}}" and generate a chronological summary of all its follow-up visits.

  For each follow-up, present it with a serial number (e.g., "1. First Follow-up").
  In 2-5 lines, summarize the key events: the doctor's summary, the main medicines prescribed, and explicitly mention any "Abnormal" lab test results.

  This summary should be easy for both a patient and a doctor to quickly understand the entire treatment journey.

  PATIENT'S APPOINTMENT HISTORY:
  {{{json previousAppointments}}}

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
    const { output } = await prompt({
      ...input,
      // @ts-ignore
      previousAppointments,
    });
    return output!;
  }
);

export async function getDeepDive(input: DeepDiveInput): Promise<DeepDiveOutput> {
  return deepDiveFlow(input);
}
