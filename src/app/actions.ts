
'use server';

import {
  generateBypassTechniques,
  type GenerateBypassTechniquesInput,
} from '@/ai/flows/generate-bypass-techniques';
import { z } from 'zod';

const formSchema = z.object({
  environmentDetails: z
    .string()
    .min(10, { message: 'Please provide more details about the environment.' }),
  userObjectives: z
    .string()
    .min(10, { message: 'Please provide more details about your objectives.' }),
});

export async function getBypassTechniques(
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
    const result = await generateBypassTechniques(
      validatedFields.data as GenerateBypassTechniquesInput
    );
    return { success: true, data: result.bypassTechniques, error: null };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      error: 'AI generation failed. Please check your setup and try again.',
    };
  }
}
