/**
 * Utility functions for mapping form field names to Zod schema paths
 */

/**
 * Maps a form field name to a Zod schema path
 * Handles nested paths like 'name.en' -> ['name', 'en']
 * 
 * @param fieldName - The form field name (e.g., 'name.en', 'address.street')
 * @returns Array of path segments
 * 
 * @example
 * ```ts
 * mapFieldToPath('name.en') // ['name', 'en']
 * mapFieldToPath('address') // ['address']
 * mapFieldToPath('categories.0') // ['categories', '0']
 * ```
 */
export function mapFieldToPath(fieldName: string): string[] {
  return fieldName.split('.');
}

/**
 * Maps a Zod error path to a form field name
 * Converts array paths like ['name', 'en'] -> 'name.en'
 * 
 * @param path - Array of path segments from Zod error
 * @returns Form field name string
 * 
 * @example
 * ```ts
 * mapPathToField(['name', 'en']) // 'name.en'
 * mapPathToField(['address']) // 'address'
 * mapPathToField(['categories', '0']) // 'categories.0'
 * ```
 */
export function mapPathToField(path: (string | number)[]): string {
  return path.map(String).join('.');
}

/**
 * Checks if a field path matches a given field name pattern
 * Supports wildcard matching for array indices
 * 
 * @param fieldName - The field name to check (e.g., 'name.en')
 * @param pattern - The pattern to match (e.g., 'name.*' or 'name.en')
 * @returns Whether the field matches the pattern
 * 
 * @example
 * ```ts
 * matchesFieldPattern('name.en', 'name.*') // true
 * matchesFieldPattern('name.en', 'name.en') // true
 * matchesFieldPattern('name.he', 'name.en') // false
 * ```
 */
export function matchesFieldPattern(fieldName: string, pattern: string): boolean {
  if (pattern === fieldName) return true;
  
  // Replace wildcards with regex
  const regexPattern = pattern.replace(/\*/g, '[^.]+');
  const regex = new RegExp(`^${regexPattern}$`);
  
  return regex.test(fieldName);
}

/**
 * Gets the parent field name from a nested field path
 * 
 * @param fieldName - The nested field name (e.g., 'name.en')
 * @returns The parent field name (e.g., 'name') or null if no parent
 * 
 * @example
 * ```ts
 * getParentField('name.en') // 'name'
 * getParentField('address.street') // 'address'
 * getParentField('name') // null
 * ```
 */
export function getParentField(fieldName: string): string | null {
  const lastDotIndex = fieldName.lastIndexOf('.');
  if (lastDotIndex === -1) return null;
  return fieldName.substring(0, lastDotIndex);
}

/**
 * Gets all child field names for a given parent field
 * 
 * @param fieldName - The parent field name (e.g., 'name')
 * @param allFields - Array of all field names
 * @returns Array of child field names (e.g., ['name.en', 'name.he'])
 * 
 * @example
 * ```ts
 * getChildFields('name', ['name.en', 'name.he', 'address']) 
 * // ['name.en', 'name.he']
 * ```
 */
export function getChildFields(fieldName: string, allFields: string[]): string[] {
  return allFields.filter(field => field.startsWith(`${fieldName}.`));
}

