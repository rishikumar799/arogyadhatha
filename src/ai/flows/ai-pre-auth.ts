
'use server';

/**
 * @fileOverview An AI flow to pre-authorize surgeries based on patient history or uploaded documents.
 *
 * - preAuth - A function that analyzes if a proposed surgery is justified.
 * - PreAuthInput - The input type for the preAuth function.
 * - PreAuthOutput - The return type for the preAuth function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { previousAppointments } from '@/lib/appointments-data';

const PreAuthInputSchema = z.object({
  healthProblem: z.string().describe("The patient's primary health problem. This could be from history or a new diagnosis."),
  proposedSurgery: z.string().describe("The surgery or procedure being proposed by the hospital."),
  documentContent: z.string().describe("The text content of any uploaded supporting documents. This will be empty if pulling from patient history.").optional(),
});
export type PreAuthInput = z.infer<typeof PreAuthInputSchema>;

const PreAuthOutputSchema = z.object({
  decision: z.enum(['APPROVED', 'FLAGGED FOR REVIEW']).describe("The AI's decision on whether the surgery is justified."),
  reasoning: z.string().describe("A clear, step-by-step explanation for the decision, referencing specific data points from the patient's history or uploaded documents."),
});
export type PreAuthOutput = z.infer<typeof PreAuthOutputSchema>;

export async function preAuth(input: PreAuthInput): Promise<PreAuthOutput> {
  return preAuthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'preAuthPrompt',
  input: { schema: PreAuthInputSchema },
  output: { schema: PreAuthOutputSchema },
  prompt: `You are an expert AI medical auditor for a government health insurance scheme. Your task is to detect potential fraud by determining if a proposed surgery is medically necessary based on the provided data. You must be extremely diligent and skeptical.

  **Patient's Health Problem:** {{healthProblem}}
  **Hospital's Proposed Surgery:** {{proposedSurgery}}

  **DATA FOR ANALYSIS:**
  {{#if documentContent}}
  **Uploaded Document Content:**
  {{{documentContent}}}
  {{else}}
  **Patient's Detailed Medical History for this problem:**
  {{{json relevantAppointment}}}
  {{/if}}

  **Your Task:**
  1.  **Deeply Analyze the Data:** Scrutinize the provided data. This is a high-stakes decision. Look for consistency, clear diagnostic evidence, and a logical progression of treatment over time.
      *   If analyzing patient history, review the entire timeline: initial diagnosis, all follow-up visits, doctor's summaries, all lab results (especially 'Abnormal' ones), and prescribed treatments. Check if conservative treatments were tried and failed before proposing surgery.
      *   If analyzing uploaded documents, extract key findings, diagnoses, and doctor recommendations from the text. Be wary of incomplete or vague information.

  2.  **Justification Check (High Scrutiny):** Is the 'Proposed Surgery' a logical and unavoidable next step based on the full history?
      *   **Approval Criteria:** Is there definitive proof (e.g., 'Abnormal' scan results, diagnostic tests confirming the condition, expert consultation notes) that conservative treatments have failed or are inappropriate, making the surgery essential? For example, a liver transplant for end-stage liver cirrhosis with multiple abnormal LFTs and documented episodes of encephalopathy is likely justified. A knee replacement is justified only after X-rays show severe degeneration AND there's a history of failed physiotherapy or other non-invasive treatments.
      *   **Red Flags for Flagging:** Flag the case if you see any of the following:
          *   **CRITICAL MISMATCH:** The 'Proposed Surgery' does not logically treat the 'Health Problem' (e.g., proposing a 'Kidney Transplant' for 'Liver Cirrhosis', or 'Cataract Surgery' for 'Knee Pain'). This is a primary red flag.
          *   The proposed surgery seems excessive for the diagnosis (e.g., 'Total Knee Replacement' for 'Mild Knee Pain' with a 'Normal' X-ray and no prior treatment history).
          *   The diagnostic evidence is weak, missing, or contradictory.
          *   There is no record of failed conservative treatments before proposing a major surgery.
          *   The documentation seems generic or lacks specific patient details.
          *   The 'Proposed Surgery' name is vague, misspelled, or not a standard medical term (e.g., 'stomach cut operation').

  3.  **Make a Decision:**
      *   If the evidence is overwhelming and justifies the surgery beyond any reasonable doubt, set 'decision' to 'APPROVED'.
      *   If there is *any* doubt, ambiguity, missing information, a critical mismatch, or if it seems like a less invasive procedure could be an option, set 'decision' to 'FLAGGED FOR REVIEW'. Err on the side of caution to prevent fraud.

  4.  **Provide Clear, Evidence-Based Reasoning:**
      *   If APPROVED, cite the *specific* reports, dates, and doctor's notes that justify the procedure (e.g., "Approved because the patient history from Sep 2023 shows a FibroScan confirming severe cirrhosis, and the Jul 2024 follow-up explicitly states a transplant is the necessary next step due to encephalopathy.").
      *   If FLAGGED, state exactly what is suspicious or missing (e.g., "Flagged due to a critical mismatch: the proposed surgery is 'Kidney Transplant' which does not treat the diagnosed 'Liver Cirrhosis'." or "Flagged because the proposed surgery 'stomach cut opertaion' is not a recognized medical term. The uploaded document only mentions 'stomach pain' but lacks a confirmatory diagnosis like 'appendicitis' or a specific recommendation from a specialist. The evidence is insufficient to justify a surgical procedure.").

  Your primary goal is to prevent unnecessary procedures while allowing legitimate ones. Your analysis must be thorough and your reasoning defensible.
  `,
});

const preAuthFlow = ai.defineFlow(
  {
    name: 'preAuthFlow',
    inputSchema: PreAuthInputSchema,
    outputSchema: PreAuthOutputSchema,
  },
  async (input) => {
    // If the check is for a new problem, we'll rely on the documentContent.
    // If it's from history, we find the relevant appointment data.
    const relevantAppointment = input.documentContent ? null : previousAppointments.find(appt => appt.problem === input.healthProblem);
    
    // If checking from history and no record is found, it must be flagged.
    if (!input.documentContent && !relevantAppointment) {
        return {
            decision: "FLAGGED FOR REVIEW",
            reasoning: `Could not find any medical history for the problem: "${input.healthProblem}". A complete medical history is required for pre-authorization. Please use the 'New Health Problem' tab and upload all supporting documents.`,
        };
    }

    const { output } = await prompt({
      ...input,
      // @ts-ignore
      relevantAppointment, // This will be null if documentContent is present, which is handled in the prompt
    });
    return output!;
  }
);
