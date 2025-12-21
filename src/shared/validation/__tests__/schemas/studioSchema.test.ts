import { describe, it, expect } from 'vitest';
import { studioFullSchema, studioStep1Schema } from '../../schemas/studioSchema';

describe('studioFullSchema', () => {
  it('should validate correct studio data', () => {
    const validData = {
      name: { en: 'Test Studio', he: 'סטודיו בדיקה' },
      subtitle: { en: 'Subtitle', he: 'כותרת משנה' },
      description: { en: 'Description', he: 'תיאור' },
      categories: ['music'],
      subCategories: ['recording'],
      genres: ['rock'],
      address: '123 Main St',
      phone: '050-1234567',
      city: 'Tel Aviv',
      coverImage: 'https://example.com/image.jpg',
      galleryImages: ['https://example.com/image1.jpg'],
      maxOccupancy: 10,
      isSmokingAllowed: false,
      parking: 'free'
    };

    expect(() => studioFullSchema.parse(validData)).not.toThrow();
  });

  it('should reject invalid name (too short)', () => {
    const invalidData = {
      name: { en: 'AB', he: 'סטודיו בדיקה' } // Too short
    };
    expect(() => studioFullSchema.parse(invalidData)).toThrow();
  });

  it('should reject missing required fields', () => {
    const invalidData = {
      name: { en: 'Test Studio', he: 'סטודיו בדיקה' }
      // Missing required fields
    };
    expect(() => studioFullSchema.parse(invalidData)).toThrow();
  });
});

describe('studioStep1Schema', () => {
  it('should validate step 1 data', () => {
    const validData = {
      name: { en: 'Test Studio', he: 'סטודיו בדיקה' },
      subtitle: { en: 'Subtitle', he: 'כותרת משנה' },
      description: { en: 'Description', he: 'תיאור' }
    };

    expect(() => studioStep1Schema.parse(validData)).not.toThrow();
  });

  it('should reject missing name', () => {
    const invalidData = {
      subtitle: { en: 'Subtitle', he: 'כותרת משנה' }
    };
    expect(() => studioStep1Schema.parse(invalidData)).toThrow();
  });
});
