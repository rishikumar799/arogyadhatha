
'use server';

/**
 * @fileOverview Provides detailed information about a specific disease or analyzes symptoms using AI.
 *
 * - getDiseaseInfo - Fetches a comprehensive overview of a disease or symptom analysis.
 * - DiseaseInfoInput - The input type for the function.
 * - DiseaseInfoOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DiseaseInfoInputSchema = z.object({
  diseaseName: z.string().describe('The name of the disease, health condition, or a description of symptoms.'),
  language: z.string().describe("The language for the response (e.g., 'en' for English, 'te' for Telugu)."),
});
export type DiseaseInfoInput = z.infer<typeof DiseaseInfoInputSchema>;

const DiseaseInfoOutputSchema = z.object({
  isDisease: z.boolean().describe("True if the input was identified as a specific disease, false if it was a symptom description."),
  diseaseName: z.string().describe("The name of the identified disease or a title for the symptom analysis."),
  summary: z.string().describe("A simple, easy-to-understand summary of the disease or the most likely condition based on symptoms."),
  symptoms: z.array(z.string()).describe("A list of common symptoms associated with the disease, or a list of first-aid tips if the input was a symptom description."),
  recommendedDiet: z.array(z.string()).describe("A list of recommended dietary habits or specific foods."),
  recommendedTests: z.array(z.string()).describe("A list of diagnostic tests a doctor might recommend."),
  affectedOrgans: z.string().optional().describe("A summary of organs that may be damaged if the condition is neglected. (Only for diseases)"),
  recommendedSpecialist: z.string().optional().describe("Based on the symptoms, recommend the specialist and department to consult (e.g., 'Cardiologist, Department of Cardiology')."),
});
export type DiseaseInfoOutput = z.infer<typeof DiseaseInfoOutputSchema>;

const prompt = ai.definePrompt({
  name: 'diseaseInfoPrompt',
  input: { schema: DiseaseInfoInputSchema },
  output: { schema: DiseaseInfoOutputSchema },
  prompt: `You are an expert AI medical triage assistant. Your goal is to provide clear, actionable information based on the user's input, guided by the principle: "Right disease/symptom for right doctor + Right Diet = 99% cure".
  Your response must be in the specified language: {{language}}.

  First, analyze the user's input to determine if it is a specific disease name or a description of symptoms.
  User Input: "{{{diseaseName}}}"

  **Scenario 1: If the input is a specific disease name (e.g., "Diabetes", "Hypertension", "Malaria"):**
  - Set 'isDisease' to true.
  - 'diseaseName' should be the name of the disease.
  - 'summary': Provide a brief, easy-to-understand overview of what the disease is.
  - 'symptoms': List the most common symptoms.
  - 'recommendedDiet': General dietary advice (foods to eat/avoid).
  - 'recommendedTests': Suggest common diagnostic tests.
  - 'affectedOrgans': Explain which organs can be damaged if the disease is left untreated.
  - 'recommendedSpecialist': Recommend the specialist and department to consult for this disease (e.g., "Endocrinologist, Department of Endocrinology").

  **Scenario 2: If the input is a description of symptoms (e.g., "fever and headache", "stomach pain for 2 days", "chest pain, shortness of breath"):**
  - Set 'isDisease' to false.
  - 'diseaseName': Create a short title for the symptom analysis (e.g., "Fever and Headache Analysis").
  - 'summary': Identify the most likely condition or health issue based on the symptoms (e.g., "Likely Condition: Migraine" or "Possible Condition: Gastritis"). This is the 'Correct Disease/Symptom Match'.
  - 'symptoms': This is a critical field. Use it to provide **basic first aid advice or immediate self-care tips** relevant to the symptoms.
  - 'recommendedDiet': Suggest a top-level diet plan suitable for the symptoms.
  - 'recommendedTests': Recommend relevant diagnostic tests for discussion with a doctor.
  - 'recommendedSpecialist': Recommend the single most appropriate **doctor specialty and department** to consult (e.g., "Cardiologist, Department of Cardiology"). DO NOT include doctor names.

  IMPORTANT: Your response must not be a diagnosis. Conclude with a clear disclaimer that the user must consult a qualified healthcare professional for any health concerns. Frame recommendations as things to "discuss with a doctor."
  `,
});

const diseaseInfoFlow = ai.defineFlow(
  {
    name: 'diseaseInfoFlow',
    inputSchema: DiseaseInfoInputSchema,
    outputSchema: DiseaseInfoOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function getDiseaseInfo(input: DiseaseInfoInput): Promise<DiseaseInfoOutput> {
  return diseaseInfoFlow(input);
}
