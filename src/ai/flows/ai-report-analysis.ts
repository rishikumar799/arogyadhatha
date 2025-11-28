
'use server';

/**
 * @fileOverview Provides AI-powered analysis of medical reports from text or images.
 *
 * - analyzeReport - A function that analyzes a report to find abnormalities.
 * - ReportAnalysisInput - The input type for the analyzeReport function.
 * - ReportAnalysisOutput - The return type for the analyzeReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReportAnalysisInputSchema = z.object({
  reportContent: z.string().describe('The full content or summary of the medical report to be analyzed.').optional(),
   photoDataUri: z.string().describe("A photo of the report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.").optional(),
   language: z.string().describe("The language for the response (e.g., 'en' for English, 'te' for Telugu).").optional(),
});
export type ReportAnalysisInput = z.infer<typeof ReportAnalysisInputSchema>;

const ReportAnalysisOutputSchema = z.object({
  summary: z.string().describe('A brief, easy-to-understand summary of the report for the patient, Chinta Lokesh Babu.'),
  abnormalities: z.array(z.object({
    item: z.string().describe('The specific item in the report that is abnormal.'),
    result: z.string().describe('The measured result of the item.'),
    normalRange: z.string().describe('The normal range for this item.'),
    explanation: z.string().describe('A simple, non-alarming explanation of the potential significance of the abnormality. Reassure the user if it is only a borderline value.'),
  })).describe('A list of any abnormalities found in the report.'),
  diseaseName: z.string().optional().describe("The proper name of the potential disease or condition identified from the report."),
  symptoms: z.array(z.string()).optional().describe("A list of common symptoms associated with the identified condition."),
  affectedOrgans: z.array(z.string()).optional().describe("A list of organs that might be affected by this condition."),
  dietSuggestions: z.array(z.string()).optional().describe("A list of general diet and lifestyle suggestions for Chinta Lokesh Babu. Do not prescribe medicines."),
});
export type ReportAnalysisOutput = z.infer<typeof ReportAnalysisOutputSchema>;

export async function analyzeReport(input: ReportAnalysisInput): Promise<ReportAnalysisOutput> {
  return analyzeReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeReportPrompt',
  input: {schema: ReportAnalysisInputSchema},
  output: {schema: ReportAnalysisOutputSchema},
  prompt: `You are a helpful AI medical assistant. Your role is to analyze a medical report for a patient named "Chinta Lokesh Babu" and provide a simple, reassuring summary in the specified language: {{language}}.

  The response must be in the specified language, ensuring it is clear and easily understandable for a native speaker. For Telugu, use simple, common terms.
  
  The report may be provided as text or as an image. If an image is provided, perform OCR to extract the text first.

  Analyze the following medical report. Identify any values that are outside the normal range. 

  **Your Task:**
  1.  **Summary:** Provide a brief, easy-to-understand summary of the report's overall findings.
  2.  **Abnormalities:**
      - List each abnormal item, its result, and its normal range.
      - For each abnormality, provide a simple, non-alarming explanation. If a value is only borderline, explicitly state that it's not a major concern but worth monitoring. For a significant problem, explain its potential importance gently and advise consulting a doctor, avoiding panic-inducing language. For example, instead of "This is very dangerous," say "This result is important to discuss with your doctor to understand the next steps."
  3.  **Disease Identification:** If possible, identify the proper name of the potential disease or condition suggested by the report.
  4.  **Symptoms:** List common symptoms associated with the identified condition.
  5.  **Affected Organs:** Mention which organs might be affected.
  6.  **Diet Suggestions:** Provide general diet and lifestyle advice relevant to the findings for Chinta Lokesh Babu. **Do not, under any circumstances, prescribe or mention specific medicines.**

  Frame the entire analysis in a point-wise, clear, and reassuring manner. The goal is to inform, not to alarm.

  Report Text: {{{reportContent}}}
  Report Image: {{media url=photoDataUri}}
  `,
});

const analyzeReportFlow = ai.defineFlow(
  {
    name: 'analyzeReportFlow',
    inputSchema: ReportAnalysisInputSchema,
    outputSchema: ReportAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
