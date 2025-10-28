
'use server';

/**
 * @fileOverview A general-purpose AI assistant for the arogyadhatha app.
 *
 * - askAiAssistant - A function that answers user questions based on their health data.
 * - AiAssistantInput - The input type for the askAiAssistant function.
 * - AiAssistantOutput - The return type for the askAiAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { previousAppointments } from '@/lib/appointments-data';
import { labReports } from '@/lib/lab-reports-data';
import { medicineSchedule } from '@/lib/medicines-data';
import { organHealthData } from '@/lib/organ-health-data';

const AiAssistantInputSchema = z.object({
  question: z.string().describe("The user's question about their health data."),
  language: z.string().describe("The language for the response (e.g., 'en' for English, 'te' for Telugu)."),
});
export type AiAssistantInput = z.infer<typeof AiAssistantInputSchema>;

const AiAssistantOutputSchema = z.object({
  answer: z.string().describe("The AI-generated answer to the user's question in the specified language."),
});
export type AiAssistantOutput = z.infer<typeof AiAssistantOutputSchema>;

export async function askAiAssistant(input: AiAssistantInput): Promise<AiAssistantOutput> {
  return aiAssistantFlow(input);
}

const prompt = ai.definePrompt({
    name: 'aiAssistantPrompt',
    input: { schema: AiAssistantInputSchema },
    output: { schema: AiAssistantOutputSchema },
    prompt: `You are a helpful AI health assistant for the Arogyadhatha app. Your role is to answer user questions based on the health data provided.
  
  The response must be in the specified language: {{language}}.

  Keep your answers concise, clear, and easy to understand. Do not provide a medical diagnosis or medical advice that replaces a doctor. Instead, summarize the user's data and help them find information within their records.

  User's Question:
  "{{question}}"

  Use the following JSON data to construct your answer. Synthesize information from all relevant sections to provide a comprehensive response.

  USER PROFILE:
  - Name: Chinta Lokesh Babu
  - Age: 27
  - Active Conditions: [Fever & Cold, Allergic Rhinitis, Liver Cirrhosis, Post-viral fatigue & chest pain]

  APPOINTMENT HISTORY:
  {{{json previousAppointments}}}

  LAB REPORTS:
  {{{json labReports}}}

  CURRENT MEDICATIONS:
  {{{json medicineSchedule}}}

  ORGAN HEALTH OVERVIEW:
  {{{json organHealthData}}}

  Based on the provided data, answer the user's question.
  `,
});


const aiAssistantFlow = ai.defineFlow(
  {
    name: 'aiAssistantFlow',
    inputSchema: AiAssistantInputSchema,
    outputSchema: AiAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({
        ...input,
        // Pass the full context data to the prompt
        // @ts-ignore
        previousAppointments,
        labReports,
        medicineSchedule,
        organHealthData,
    });
    return output!;
  }
);
