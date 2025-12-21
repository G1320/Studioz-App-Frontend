import { z } from 'zod';
import { ZodSchema } from 'zod';

/**
 * Creates a conditional schema that validates based on another field's value
 * 
 * @param condition - Function that returns true if validation should apply
 * @param schema - Schema to apply when condition is true
 * @param otherwiseSchema - Optional schema to apply when condition is false
 * @returns Conditional Zod schema
 * 
 * @example
 * ```ts
 * const schema = z.object({
 *   hasEmail: z.boolean(),
 *   email: conditionalSchema(
 *     (data) => data.hasEmail === true,
 *     z.string().email('Email is required when hasEmail is true'),
 *     z.string().optional()
 *   )
 * });
 * ```
 */
export function conditionalSchema<T extends z.ZodTypeAny>(
  condition: (data: any) => boolean,
  schema: T,
  otherwiseSchema?: z.ZodTypeAny
): z.ZodUnion<[T, z.ZodOptional<z.ZodAny>]> | T {
  return z.union([
    z.object({}).passthrough().refine(
      (data) => {
        if (condition(data)) {
          try {
            schema.parse(data);
            return true;
          } catch {
            return false;
          }
        }
        return true;
      },
      {
        message: 'Conditional validation failed'
      }
    ) as any,
    z.any()
  ]) as any;
}

/**
 * Creates a schema that makes a field required based on another field
 * 
 * @param dependentField - The field name that determines if this field is required
 * @param requiredValue - The value that makes this field required
 * @param baseSchema - Base schema for the field
 * @returns Conditional required schema
 * 
 * @example
 * ```ts
 * const schema = z.object({
 *   type: z.enum(['premium', 'basic']),
 *   premiumFeature: conditionalRequired(
 *     'type',
 *     'premium',
 *     z.string()
 *   )
 * });
 * ```
 */
export function conditionalRequired(
  dependentField: string,
  requiredValue: any,
  baseSchema: z.ZodTypeAny
): z.ZodTypeAny {
  return z.preprocess(
    (val, ctx) => {
      const data = ctx.path.length > 0 ? (ctx as any).data : val;
      const dependentValue = getNestedValue(data, dependentField);
      
      if (dependentValue === requiredValue) {
        return baseSchema.parse(val);
      }
      
      return baseSchema.optional().parse(val);
    },
    baseSchema.optional()
  );
}

/**
 * Helper to get nested value from object
 */
function getNestedValue(obj: any, path: string): any {
  if (path.includes('.')) {
    const [parent, child] = path.split('.');
    return obj[parent]?.[child];
  }
  return obj[path];
}

/**
 * Creates a cross-field validation schema
 * 
 * @param fields - Array of field names to validate together
 * @param validator - Function that validates all fields together
 * @param message - Error message if validation fails
 * @returns Refined schema
 * 
 * @example
 * ```ts
 * const schema = z.object({
 *   password: z.string(),
 *   confirmPassword: z.string()
 * }).refine(
 *   crossFieldValidator(['password', 'confirmPassword'], (data) => 
 *     data.password === data.confirmPassword
 *   ),
 *   { message: 'Passwords must match', path: ['confirmPassword'] }
 * );
 * ```
 */
export function crossFieldValidator(
  fields: string[],
  validator: (data: Record<string, any>) => boolean,
  message?: string
) {
  return (data: Record<string, any>) => {
    const values = fields.map(field => getNestedValue(data, field));
    return validator(data);
  };
}

/**
 * Creates a dynamic required field based on other fields
 * 
 * @param fieldName - Name of the field to make conditionally required
 * @param condition - Function that returns true if field should be required
 * @param baseSchema - Base schema for the field
 * @returns Schema with conditional requirement
 */
export function dynamicRequired(
  fieldName: string,
  condition: (data: Record<string, any>) => boolean,
  baseSchema: z.ZodTypeAny
): z.ZodTypeAny {
  return baseSchema.refine(
    (val, ctx) => {
      const data = (ctx as any).data || {};
      if (condition(data)) {
        return val !== undefined && val !== null && val !== '';
      }
      return true;
    },
    {
      message: `${fieldName} is required`
    }
  );
}

