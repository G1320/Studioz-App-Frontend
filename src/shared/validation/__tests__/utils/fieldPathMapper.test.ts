import { describe, it, expect } from 'vitest';
import { mapFieldToPath, mapPathToField, matchesFieldPattern, getParentField } from '../../utils/fieldPathMapper';

describe('fieldPathMapper', () => {
  describe('mapFieldToPath', () => {
    it('should map simple field name to path', () => {
      expect(mapFieldToPath('name')).toEqual(['name']);
    });

    it('should map nested field name to path', () => {
      expect(mapFieldToPath('name.en')).toEqual(['name', 'en']);
    });

    it('should map deeply nested field name to path', () => {
      expect(mapFieldToPath('address.street.number')).toEqual(['address', 'street', 'number']);
    });
  });

  describe('mapPathToField', () => {
    it('should map path array to field name', () => {
      expect(mapPathToField(['name'])).toBe('name');
    });

    it('should map nested path to field name', () => {
      expect(mapPathToField(['name', 'en'])).toBe('name.en');
    });

    it('should handle numeric indices', () => {
      expect(mapPathToField(['items', 0, 'name'])).toBe('items.0.name');
    });
  });

  describe('matchesFieldPattern', () => {
    it('should match exact field name', () => {
      expect(matchesFieldPattern('name.en', 'name.en')).toBe(true);
    });

    it('should match wildcard pattern', () => {
      expect(matchesFieldPattern('name.en', 'name.*')).toBe(true);
      expect(matchesFieldPattern('name.he', 'name.*')).toBe(true);
    });

    it('should not match different field', () => {
      expect(matchesFieldPattern('name.en', 'address.*')).toBe(false);
    });
  });

  describe('getParentField', () => {
    it('should return parent field for nested field', () => {
      expect(getParentField('name.en')).toBe('name');
    });

    it('should return null for top-level field', () => {
      expect(getParentField('name')).toBeNull();
    });
  });
});

