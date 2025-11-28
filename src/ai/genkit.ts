
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({
      model: 'gemini-2.0-flash',
  })],
  model: 'googleai/gemini-2.0-flash',
});

export const ttsModel = googleAI.model('gemini-2.5-flash-preview-tts');
