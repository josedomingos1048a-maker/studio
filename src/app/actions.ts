'use server';

import {
  generateBenefitSteps,
  type GenerateBenefitStepsInput,
} from '@/ai/flows/generate-bypass-techniques';
import { z } from 'zod';

const formSchema = z.object({
  fullName: z.string().min(3, { message: 'Por favor, insira o nome completo.' }),
  cpf: z.string().length(11, { message: 'O CPF deve ter 11 dígitos.' }),
  benefitType: z.string().min(5, { message: 'Por favor, descreva o benefício.' }),
  additionalInfo: z.string().optional(),
});

export async function getBenefitSteps(
  values: z.infer<typeof formSchema>
): Promise<{ success: boolean; data: string[] | null; error: string | null }> {
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
