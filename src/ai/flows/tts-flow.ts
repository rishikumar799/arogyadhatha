
'use server';

/**
 * @fileOverview Converts text to speech using Google AI.
 * - textToSpeech - A function that takes text and returns a WAV audio data URI.
 */

import { ai, ttsModel } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';

const TTSInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});

const TTSOutputSchema = z.object({
  audio: z.string().describe('The generated audio as a Base64 encoded WAV data URI.'),
});

export type TTSInput = z.infer<typeof TTSInputSchema>;
export type TTSOutput = z.infer<typeof TTSOutputSchema>;

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TTSInputSchema,
    outputSchema: TTSOutputSchema,
  },
  async ({ text }) => {
    const { media } = await ai.generate({
      model: ttsModel,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              // Using a voice that aligns with a South Indian English accent
              voiceName: 'vindemiatrix',
            },
          },
        },
      },
      prompt: text,
    });
    if (!media || !media.url) {
      throw new Error('No audio media returned from the AI model.');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);
    
    return {
      audio: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

export async function textToSpeech(input: TTSInput): Promise<TTSOutput> {
  return textToSpeechFlow(input);
}
