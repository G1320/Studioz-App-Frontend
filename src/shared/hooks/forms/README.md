# Form Auto-Save System

A reusable system for automatically saving form data to localStorage, persisting across page refreshes. Works regardless of user authentication status.

## Features

- ✅ **Auto-save with debouncing** - Saves form data automatically after user stops typing
- ✅ **Auto-restore on mount** - Restores saved form data when component loads
- ✅ **Works without login** - Uses localStorage, no server required
- ✅ **Supports both controlled and uncontrolled forms**
- ✅ **Automatic cleanup** - Old form data is cleaned up automatically
- ✅ **Type-safe** - Full TypeScript support

## Usage

### For Controlled Forms (React Hook Form, useState, etc.)

Use `useFormAutoSave` hook:

```tsx
import { useState } from 'react';
import { useFormAutoSave } from '@shared/hooks';

const CreateStudioForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: ''
  });

  const { clearSavedData, saveNow, hasSavedData } = useFormAutoSave({
    formId: 'create-studio',
    formData,
    onRestore: (restoredData) => {
      setFormData(restoredData);
      console.log('Form data restored!');
    },
    onSave: () => {
      console.log('Form auto-saved!');
    },
    debounceMs: 1000, // Save 1 second after user stops typing
    enabled: true,
    restoreOnMount: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear saved data after successful submission
    clearSavedData();
    // ... submit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      {/* ... other fields */}
    </form>
  );
};
```

### For Uncontrolled Forms (GenericForm, native HTML forms)

Use `useFormAutoSaveUncontrolled` hook:

```tsx
import { useRef } from 'react';
import { useFormAutoSaveUncontrolled } from '@shared/hooks';
import { GenericForm } from '@shared/components';

const CreateItemForm = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const { clearSavedData, saveNow, hasSavedData } = useFormAutoSaveUncontrolled({
    formId: 'create-item',
    formRef, // Pass ref or form ID string
    onSave: () => {
      console.log('Form auto-saved!');
    },
    debounceMs: 1000
  });

  const handleSubmit = (data: Record<string, any>) => {
    // Clear saved data after successful submission
    clearSavedData();
    // ... submit logic
  };

  return (
    <GenericForm
      ref={formRef}
      formId="create-item"
      onSubmit={handleSubmit}
      fields={[...]}
    />
  );
};
```

### With Form ID (Alternative for Uncontrolled Forms)

```tsx
import { useFormAutoSaveUncontrolled } from '@shared/hooks';

const EditStudioForm = () => {
  useFormAutoSaveUncontrolled({
    formId: 'edit-studio-123',
    formRef: 'edit-studio-form', // Form ID string
  });

  return (
    <form id="edit-studio-form">
      {/* form fields */}
    </form>
  );
};
```

## API Reference

### `useFormAutoSave`

Hook for controlled forms.

**Options:**
- `formId` (string, required) - Unique identifier for the form
- `formData` (Record<string, any>, required) - Current form data
- `onRestore` (function, optional) - Callback when data is restored on mount
- `debounceMs` (number, optional) - Debounce delay in ms (default: 1000)
- `enabled` (boolean, optional) - Enable/disable auto-save (default: true)
- `restoreOnMount` (boolean, optional) - Restore on mount (default: true)
- `version` (string, optional) - Version for schema migrations
- `onSave` (function, optional) - Callback when data is saved
- `onRestoreComplete` (function, optional) - Callback when restore completes

**Returns:**
- `clearSavedData()` - Manually clear saved data
- `saveNow()` - Manually save data (bypasses debounce)
- `hasSavedData` (boolean) - Whether saved data exists

### `useFormAutoSaveUncontrolled`

Hook for uncontrolled forms.

**Options:**
- `formId` (string, required) - Unique identifier for the form
- `formRef` (RefObject<HTMLFormElement> | string, optional) - Form ref or ID
- `debounceMs` (number, optional) - Debounce delay in ms (default: 1000)
- `enabled` (boolean, optional) - Enable/disable auto-save (default: true)
- `restoreOnMount` (boolean, optional) - Restore on mount (default: true)
- `version` (string, optional) - Version for schema migrations
- `onSave` (function, optional) - Callback when data is saved
- `onRestoreComplete` (function, optional) - Callback when restore completes

**Returns:**
- `clearSavedData()` - Manually clear saved data
- `saveNow()` - Manually save data (bypasses debounce)
- `hasSavedData` (boolean) - Whether saved data exists

## Utility Functions

You can also use the utility functions directly:

```tsx
import {
  saveFormData,
  loadFormData,
  clearFormData,
  hasFormData,
  getFormDataTimestamp,
  cleanupOldFormData
} from '@shared/utils';

// Save form data
saveFormData('my-form', { name: 'John', email: 'john@example.com' });

// Load form data
const data = loadFormData('my-form');

// Check if data exists
if (hasFormData('my-form')) {
  // ...
}

// Clear saved data
clearFormData('my-form');

// Clean up old data (older than 7 days)
cleanupOldFormData(7);
```

## Best Practices

1. **Use unique form IDs** - Include context like `'create-studio'`, `'edit-item-123'`
2. **Clear on successful submit** - Call `clearSavedData()` after successful form submission
3. **Handle nested fields** - The system automatically handles nested fields like `name.en`, `name.he`
4. **Version for migrations** - Use `version` option when form schema changes
5. **Cleanup old data** - Old form data is automatically cleaned up, but you can manually call `cleanupOldFormData()`

## Storage

Form data is stored in localStorage with the key pattern: `form_autosave_{formId}`

Data includes:
- Form values
- Timestamp
- Optional version

Old data (older than 7 days) is automatically cleaned up.

