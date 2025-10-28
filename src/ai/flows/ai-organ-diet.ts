
'use server';

/**
 * @fileOverview Provides an AI-powered diet plan based on a specific organ's health condition and active medications.
 *
 * - generateOrganDietPlan - Creates a personalized diet plan for an organ.
 * - AiOrganDietPlanInput - Input type for the function.
 * - AiOrganDietPlanOutput - Return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AiOrganDietPlanInputSchema = z.object({
  organName: z.string().describe("The name of the organ (e.g., 'Liver', 'Heart')."),
  condition: z.string().describe("The user's current health condition related to that organ (e.g., 'Liver Cirrhosis', 'Mildly reduced Ejection Fraction')."),
  medications: z.array(z.string()).describe("A list of the user's active medications."),
  height: z.string().describe("The user's height (e.g., '175 cm', '5ft 9in')."),
  weight: z.string().describe("The user's weight (e.g., '75 kg', '165 lbs')."),
});
export type AiOrganDietPlanInput = z.infer<typeof AiOrganDietPlanInputSchema>;

const AiOrganDietPlanOutputSchema = z.object({
    plan: z.array(z.object({
        meal: z.string().describe('The name of the meal (e.g., Breakfast, Lunch, Dinner, Snacks).'),
        items: z.array(z.string()).describe('A list of food items recommended for this meal.'),
        reason: z.string().describe("A simple explanation for why these food items are recommended for the specified organ's condition."),
    })).describe('A meal-by-meal diet plan.'),
    generalAdvice: z.array(z.string()).describe('A list of general dietary advice points for the organ.'),
});
export type AiOrganDietPlanOutput = z.infer<typeof AiOrganDietPlanOutputSchema>;

export async function generateOrganDietPlan(input: AiOrganDietPlanInput): Promise<AiOrganDietPlanOutput> {
  return organDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'organDietPlanPrompt',
  input: {schema: AiOrganDietPlanInputSchema},
  output: {schema: AiOrganDietPlanOutputSchema},
  prompt: `You are an expert AI nutritionist specializing in therapeutic diets for organ health based on ICMR (Indian Council of Medical Research) guidelines. Your primary goal is to create a diet that helps the user recover as quickly as possible.

  Your task is to create a simple, one-day **South Indian** style diet plan. The food items must be easy to digest for better absorption and suitable for a person recovering from a health issue.

  **Crucially, you must analyze all user data to create a holistic and personalized plan:**
  1.  **Analyze Physical Attributes:** Use the user's height and weight to tailor portion sizes and caloric intake appropriately.
  2.  **Consider Medical Status:** Take into account the specified organ, the user's health condition, and their active medications to ensure the diet is complementary and does not cause adverse interactions.
  3.  **Incorporate Healthy Nutrients:** Ensure the diet includes good sources of lean **protein**, healthy fats like **omega-3** (from fish, flaxseeds) and monosaturated fats (from **olive oil**, nuts), and complex carbohydrates.

  **User Data:**
  - Height: {{{height}}}
  - Weight: {{{weight}}}
  - Organ: {{{organName}}}
  - Condition: {{{condition}}}
  - Active Medications: {{{json medications}}}

  Based on the severity implied by the condition and the medications, generate a suitable diet plan.

  - Structure the plan with sections for Breakfast, Lunch, and Dinner.
  - For each meal, provide a few recommended South Indian food items and a brief reason explaining how it helps recovery and supports the specified organ.
  - Include a 'General Advice' section with key dietary points, including recommendations for using olive oil in cooking and incorporating protein and omega-3 sources.
  - Keep the language simple, encouraging, and easy for a non-medical person to understand.
  `,
});

const organDietPlanFlow = ai.defineFlow(
  {
    name: 'organDietPlanFlow',
    inputSchema: AiOrganDietPlanInputSchema,
    outputSchema: AiOrganDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
