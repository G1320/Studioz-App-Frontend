// Equipment category configuration for display in forms
export interface EquipmentCategoryConfig {
  id: string;
  labelKey: string; // Translation key
  icon: string; // Icon name for display
}

export const equipmentCategories: EquipmentCategoryConfig[] = [
  { id: 'microphones', labelKey: 'equipment.categories.microphones', icon: 'mic' },
  { id: 'preamps', labelKey: 'equipment.categories.preamps', icon: 'tune' },
  { id: 'compressors', labelKey: 'equipment.categories.compressors', icon: 'compress' },
  { id: 'instruments', labelKey: 'equipment.categories.instruments', icon: 'piano' },
  { id: 'monitoring', labelKey: 'equipment.categories.monitoring', icon: 'speaker' },
  { id: 'recording', labelKey: 'equipment.categories.recording', icon: 'album' },
  { id: 'software', labelKey: 'equipment.categories.software', icon: 'computer' },
  { id: 'other', labelKey: 'equipment.categories.other', icon: 'more' }
];

// Type for form state (Record format for easy editing)
export interface CategorizedEquipment {
  [categoryId: string]: string; // Category ID -> raw text input (items separated by newlines or commas)
}

// Equipment data as stored in the database
export interface EquipmentCategory {
  category: string;
  items: string; // Raw text input - items separated by newlines or commas
}

// Helper to convert EquipmentCategory[] to CategorizedEquipment (for form state)
export const equipmentToCategorized = (equipment: EquipmentCategory[]): CategorizedEquipment => {
  return equipment.reduce((acc, cat) => {
    acc[cat.category] = cat.items;
    return acc;
  }, {} as CategorizedEquipment);
};

// Helper to convert CategorizedEquipment to EquipmentCategory[] (for saving)
export const categorizedToEquipment = (categorized: CategorizedEquipment): EquipmentCategory[] => {
  return Object.entries(categorized)
    .filter(([, items]) => items.trim().length > 0)
    .map(([category, items]) => ({ category, items }));
};

// Helper to parse items string into array (for display purposes)
export const parseEquipmentItems = (items: string): string[] => {
  return items
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

// Helper to convert flat equipment array to categorized (for backward compatibility with old data)
export const flatToCategorized = (equipment: string[]): CategorizedEquipment => {
  return {
    other: equipment.join('\n')
  };
};
