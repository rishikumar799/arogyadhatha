
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-medicine-assistant.ts';
import '@/ai/flows/ai-report-analysis.ts';
import '@/ai/flows/ai-diet-plan.ts';
import '@/ai/flows/ai-organ-diet.ts';
import '@/ai/flows/ai-assistant.ts';
import '@/ai/flows/ai-disease-info.ts';
import '@/ai/flows/ai-deep-dive.ts';


