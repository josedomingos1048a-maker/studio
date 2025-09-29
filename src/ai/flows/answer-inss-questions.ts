'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering questions about INSS benefits.
 *
 * @exports answerInssQuestion - The main function to trigger the question answering flow.
 * @exports AnswerInssQuestionInput - The input type for the answerInssQuestion function.
 * @exports AnswerInssQuestionOutput - The output type for the answerInssQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const AnswerInssQuestionInputSchema = z.object({
  question: z.string().describe('The user’s question about INSS benefits.'),
});
export type AnswerInssQuestionInput = z.infer<
  typeof AnswerInssQuestionInputSchema
>;

// Define the output schema
const AnswerInssQuestionOutputSchema = z.object({
  answer: z
    .string()
    .describe('The answer to the user’s question, based on INSS rules.'),
});
export type AnswerInssQuestionOutput = z.infer<
  typeof AnswerInssQuestionOutputSchema
>;

// Define the main function to trigger the flow
export async function answerInssQuestion(
  input: AnswerInssQuestionInput
): Promise<AnswerInssQuestionOutput> {
  return answerInssQuestionFlow(input);
}

// Define the prompt
const answerInssQuestionPrompt = ai.definePrompt({
  name: 'answerInssQuestionPrompt',
  input: {schema: AnswerInssQuestionInputSchema},
  output: {schema: AnswerInssQuestionOutputSchema},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
  prompt: `Você é um especialista do INSS. Responda à seguinte pergunta com base nas regras e regulamentos oficiais do INSS. Seja claro, objetivo e forneça informações precisas e atualizadas.

Pergunta: {{{question}}}

Resposta:`,
});

// Define the flow
const answerInssQuestionFlow = ai.defineFlow(
  {
    name: 'answerInssQuestionFlow',
    inputSchema: AnswerInssQuestionInputSchema,
    outputSchema: AnswerInssQuestionOutputSchema,
  },
  async input => {
    const {output} = await answerInssQuestionPrompt(input);
    return output!;
  }
);
