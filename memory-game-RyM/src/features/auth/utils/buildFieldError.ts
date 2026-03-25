import { type FieldError, type FieldErrors } from 'react-hook-form';
import type { RegisterFormValues } from "../schemas/registerSchema";
import type { ZodIssue } from "zod";

export const buildFieldErrors = (issues: ZodIssue[]) => {
  const errors: Partial<Record<keyof RegisterFormValues, FieldError>> = {};

  for (const issue of issues) {
    const fieldName = issue.path[0];

    if (typeof fieldName === 'string' && !errors[fieldName as keyof RegisterFormValues]) {
      errors[fieldName as keyof RegisterFormValues] = {
        type: issue.code,
        message: issue.message,
      };
    }
  }

  return errors as FieldErrors<RegisterFormValues>;
};