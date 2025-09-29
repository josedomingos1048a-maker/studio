'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating sandbox bypass techniques tailored to a specific environment and user objectives.
 *
 * @remarks
 * The flow takes environment details and user objectives as input and returns a list of bypass techniques.
 *
 * @exports generateBypassTechniques - The main function to trigger the bypass technique generation flow.
 * @exports GenerateBypassTechniquesInput - The input type for the generateBypassTechniques function.
 * @exports GenerateBypassTechniquesOutput - The output type for the generateBypassTechniques function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GenerateBypassTechniquesInputSchema = z.object({
  environmentDetails: z
    .string()
    .describe('Detailed information about the sandbox environment.'),
  userObjectives: z
    .string()
    .describe('The user’s specific objectives for bypassing the sandbox.'),
});
export type GenerateBypassTechniquesInput = z.infer<
  typeof GenerateBypassTechniquesInputSchema
>;

// Define the output schema
const GenerateBypassTechniquesOutputSchema = z.object({
  bypassTechniques: z
    .array(z.string())
    .describe('A list of suggested sandbox bypass techniques.'),
});
export type GenerateBypassTechniquesOutput = z.infer<
  typeof GenerateBypassTechniquesOutputSchema
>;

// Define the main function to trigger the flow
export async function generateBypassTechniques(
  input: GenerateBypassTechniquesInput
): Promise<GenerateBypassTechniquesOutput> {
  return generateBypassTechniquesFlow(input);
}

// Define the prompt
const generateBypassTechniquesPrompt = ai.definePrompt({
  name: 'generateBypassTechniquesPrompt',
  input: {schema: GenerateBypassTechniquesInputSchema},
  output: {schema: GenerateBypassTechniquesOutputSchema},
  prompt: `You are an expert in cybersecurity and sandbox evasion techniques. Based on the provided environment details and user objectives, generate a list of potential sandbox bypass techniques.

Environment Details: {{{environmentDetails}}}
User Objectives: {{{userObjectives}}}

Bypass Techniques:`,
});

// Define the flow
const generateBypassTechniquesFlow = ai.defineFlow(
  {
    name: 'generateBypassTechniquesFlow',
    inputSchema: GenerateBypassTechniquesInputSchema,
    outputSchema: GenerateBypassTechniquesOutputSchema,
  },
  async input => {
    const {output} = await generateBypassTechniquesPrompt(input);
    return output!;
  }
);
