'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating the steps to request a social security benefit.
 *
 * @remarks
 * The flow takes user information and returns a list of steps.
 *
 * @exports generateBenefitSteps - The main function to trigger the benefit steps generation flow.
 * @exports GenerateBenefitStepsInput - The input type for the generateBenefitSteps function.
 * @exports GenerateBenefitStepsOutput - The output type for the generateBenefitSteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GenerateBenefitStepsInputSchema = z.object({
  fullName: z.string().describe('The user’s full name.'),
  cpf: z
    .string()
    .describe('The user’s CPF (Brazilian individual taxpayer registry).'),
  benefitType: z
    .string()
    .describe('The type of benefit the user wants to request.'),
  additionalInfo: z
    .string()
    .describe('Any additional information or context provided by the user.'),
});
export type GenerateBenefitStepsInput = z.infer<
  typeof GenerateBenefitStepsInputSchema
>;

// Define the output schema
const GenerateBenefitStepsOutputSchema = z.object({
  steps: z
    .array(z.string())
    .describe('A list of suggested steps to request the benefit.'),
});
export type GenerateBenefitStepsOutput = z.infer<
  typeof GenerateBenefitStepsOutputSchema
>;

// Define the main function to trigger the flow
export async function generateBenefitSteps(
  input: GenerateBenefitStepsInput
): Promise<GenerateBenefitStepsOutput> {
  return generateBenefitStepsFlow(input);
}

// Define the prompt
const generateBenefitStepsPrompt = ai.definePrompt({
  name: 'generateBenefitStepsPrompt',
  input: {schema: GenerateBenefitStepsInputSchema},
  output: {schema: GenerateBenefitStepsOutputSchema},
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
  prompt: `Você é um especialista em benefícios do INSS e seu objetivo é fornecer um guia detalhado e completo para o usuário. Com base nas informações fornecidas, gere um passo a passo 100% informativo para solicitar o benefício desejado.

Para cada passo, inclua:
1.  Ação clara e objetiva a ser tomada.
2.  Documentos necessários para essa etapa específica.
3.  Onde a ação deve ser realizada (Ex: site Meu INSS, aplicativo Meu INSS, agência do INSS).
4.  Dicas importantes ou o que esperar após a conclusão do passo.

Seja extremamente claro, organizado e use uma linguagem fácil de entender.

Dados do Usuário:
Nome Completo: {{{fullName}}}
CPF: {{{cpf}}}
Tipo de Benefício: {{{benefitType}}}
Informações Adicionais: {{{additionalInfo}}}

Gere os passos para a solicitação do benefício:`,
});

// Define the flow
const generateBenefitStepsFlow = ai.defineFlow(
  {
    name: 'generateBenefitStepsFlow',
    inputSchema: GenerateBenefitStepsInputSchema,
    outputSchema: GenerateBenefitStepsOutputSchema,
  },
  async input => {
    const {output} = await generateBenefitStepsPrompt(input);
    return output!;
  }
);
