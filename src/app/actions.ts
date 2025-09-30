'use server';

import {
  generateBenefitSteps,
  type GenerateBenefitStepsOutput,
  type GenerateBenefitStepsInput,
} from '@/ai/flows/generate-benefit-steps';
import {
  answerInssQuestion,
  type AnswerInssQuestionInput,
} from '@/ai/flows/answer-inss-questions';
import { z } from 'zod';

const formSchema = z.object({
  fullName: z.string().min(3, { message: 'Por favor, insira o nome completo.' }),
  cpf: z.string().min(1, { message: 'O CPF não pode estar em branco.' }),
  benefitType: z.string().min(5, { message: 'Por favor, descreva o benefício.' }),
  additionalInfo: z.string().optional(),
});

export async function getBenefitSteps(
  values: z.infer<typeof formSchema>
): Promise<{ success: boolean; data: GenerateBenefitStepsOutput['steps'] | null; error: string | null }> {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors
      .map((e) => e.message)
      .join(' ');
    return { success: false, data: null, error: errorMessages };
  }

  try {
    const result = await generateBenefitSteps(
      validatedFields.data as GenerateBenefitStepsInput
    );
    return { success: true, data: result.steps, error: null };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      error: 'Falha ao gerar os passos. Por favor, tente novamente.',
    };
  }
}

const chatSchema = z.object({
  question: z.string().min(1, { message: 'A pergunta não pode estar vazia.' }),
});

export async function getInssAnswer(
  values: z.infer<typeof chatSchema>
): Promise<{ success: boolean; data: string | null; error: string | null }> {
  const validatedFields = chatSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, data: null, error: 'Pergunta inválida.' };
  }

  try {
    const result = await answerInssQuestion(
      validatedFields.data as AnswerInssQuestionInput
    );
    return { success: true, data: result.answer, error: null };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      error: 'Falha ao obter a resposta. Por favor, tente novamente.',
    };
  }
}
