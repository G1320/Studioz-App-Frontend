import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { formatZodError, getFieldError } from '../../utils/zodErrorFormatter';

describe('formatZodError', () => {
  it('should format Zod error to ValidationError', () => {
    const schema = z.object({
      name: z.string().min(3, 'Name must be at least 3 characters'),
      email: z.string().email('Invalid email')
    });

    try {
      schema.parse({ name: 'AB', email: 'invalid' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = formatZodError(error);
        expect(validationError.fieldErrors).toHaveProperty('name');
        expect(validationError.fieldErrors).toHaveProperty('email');
        expect(validationError.errors.length).toBeGreaterThan(0);
      }
    }
  });

  it('should handle nested field paths', () => {
    const schema = z.object({
      name: z.object({
        en: z.string().min(3),
        he: z.string().min(3)
      })
    });

    try {
      schema.parse({ name: { en: 'AB', he: 'סטודיו' } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = formatZodError(error);
        expect(validationError.fieldErrors).toHaveProperty('name.en');
      }
    }
  });
});

describe('getFieldError', () => {
  it('should get error for specific field', () => {
    const schema = z.object({
      name: z.string().min(3, 'Name too short')
    });

    try {
      schema.parse({ name: 'AB' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = getFieldError(error, 'name');
        expect(errorMessage).toBeDefined();
        expect(errorMessage).toContain('short');
      }
    }
  });
});

