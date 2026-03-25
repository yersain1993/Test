import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().trim().min(1, 'Ingresa tu usuario').email('Ingresa un email valido'),
    password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contrasena'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Las contrasenas no coinciden',
      });
    }
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
