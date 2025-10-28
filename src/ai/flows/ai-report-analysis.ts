
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
});
export type ReportAnalysisInput = z.infer<typeof ReportAnalysisInputSchema>;

const ReportAnalysisOutputSchema = z.object({
  summary: z.string().describe('A brief, easy-to-understand summary of the report.'),
  abnormalities: z.array(z.object({
    item: z.string().describe('The specific item in the report that is abnormal.'),
    result: z.string().describe('The measured result of the item.'),
    normalRange: z.string().describe('The normal range for this item.'),
    explanation: z.string().describe('A simple, non-alarming explanation of the potential significance of the abnormality.'),
  })).describe('A list of any abnormalities found in the report.'),
});
export type ReportAnalysisOutput = z.infer<typeof ReportAnalysisOutputSchema>;

export async function analyzeReport(input: ReportAnalysisInput): Promise<ReportAnalysisOutput> {
  return analyzeReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeReportPrompt',
  input: {schema: ReportAnalysisInputSchema},
  output: {schema: ReportAnalysisOutputSchema},
  prompt: `You are a helpful AI medical assistant. Your role is to analyze a medical report and provide a simple, reassuring summary.
  The report may be provided as text or as an image. If an image is provided, perform OCR to extract the text first.

  Analyze the following medical report. Identify any values that are outside the normal range. For each abnormality, provide a simple, non-alarming explanation. Avoid creating fear or panic. The goal is to highlight areas for discussion with a doctor, not to provide a diagnosis.

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
