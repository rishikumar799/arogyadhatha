'use server';

/**
 * @fileOverview Provides an AI-powered diet plan based on user conditions and medications.
 *
 * - generateDietPlan - A function that creates a personalized diet plan.
 * - AiDietPlanInput - The input type for the generateDietPlan function.
 * - AiDietPlanOutput - The return type for the generateDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDietPlanInputSchema = z.object({
  conditions: z.array(z.string()).describe('A list of the user\'s current health conditions.'),
  medications: z.array(z.string()).describe('A list of medications the user is currently taking.'),
});
export type AiDietPlanInput = z.infer<typeof AiDietPlanInputSchema>;

const AiDietPlanOutputSchema = z.object({
    plan: z.array(z.object({
        meal: z.string().describe('The name of the meal (e.g., Breakfast, Lunch, Dinner, Snacks).'),
        items: z.array(z.string()).describe('A list of food items recommended for this meal.'),
        reason: z.string().describe('A simple explanation for why these food items are recommended based on the user\'s condition.'),
    })).describe('A meal-by-meal diet plan.'),
    generalAdvice: z.array(z.string()).describe('A list of general dietary advice points.'),
});
export type AiDietPlanOutput = z.infer<typeof AiDietPlanOutputSchema>;

export async function generateDietPlan(input: AiDietPlanInput): Promise<AiDietPlanOutput> {
  return dietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dietPlanPrompt',
  input: {schema: AiDietPlanInputSchema},
  output: {schema: AiDietPlanOutputSchema},
  prompt: `You are an expert AI nutritionist. Based on the user's health conditions and medications, create a simple, one-day diet plan suitable for an Indian user.

  User's Health Conditions: {{{json conditions}}}
  User's Medications: {{{json medications}}}

  Generate a diet plan with sections for Breakfast, Lunch, and Dinner. For each meal, provide a few recommended food items and a brief reason for the recommendation. Also, provide a few general advice points.

  Keep the language simple and encouraging.
  `,
});

const dietPlanFlow = ai.defineFlow(
  {
    name: 'dietPlanFlow',
    inputSchema: AiDietPlanInputSchema,
    outputSchema: AiDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
