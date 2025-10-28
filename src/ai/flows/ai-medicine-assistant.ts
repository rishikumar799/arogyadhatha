'use server';

/**
 * @fileOverview Provides information about medications, dosages, and side effects.
 *
 * - aiMedicineAssistant - A function that provides information about medications.
 * - AiMedicineAssistantInput - The input type for the aiMedicineAssistant function.
 * - AiMedicineAssistantOutput - The return type for the aiMedicineAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiMedicineAssistantInputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine to get information about.'),
});
export type AiMedicineAssistantInput = z.infer<typeof AiMedicineAssistantInputSchema>;

const AiMedicineAssistantOutputSchema = z.object({
  name: z.string().describe('The name of the medicine.'),
  dosage: z.string().describe('The typical dosage of the medicine.'),
  sideEffects: z.string().describe('The possible side effects of the medicine.'),
});
export type AiMedicineAssistantOutput = z.infer<typeof AiMedicineAssistantOutputSchema>;

export async function aiMedicineAssistant(input: AiMedicineAssistantInput): Promise<AiMedicineAssistantOutput> {
  return aiMedicineAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMedicineAssistantPrompt',
  input: {schema: AiMedicineAssistantInputSchema},
  output: {schema: AiMedicineAssistantOutputSchema},
  prompt: `You are a helpful AI assistant that provides information about medications, including their dosages and side effects.

  Provide information for the following medicine:
  Medicine Name: {{{medicineName}}}
  `,
});

const aiMedicineAssistantFlow = ai.defineFlow(
  {
    name: 'aiMedicineAssistantFlow',
    inputSchema: AiMedicineAssistantInputSchema,
    outputSchema: AiMedicineAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
