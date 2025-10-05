# Checklist Storage and State Management

This document describes how to use the local persistence layer and state management for checklists.

## Overview

The persistence layer consists of two main parts:

1. **Storage Service** (`src/storage/checklistStorage.ts`) - Low-level persistence using localStorage
2. **Zustand Store** (`src/state/checklistStore.ts`) - Application state management

## Storage Service

The storage service provides a simple abstraction over localStorage with future-proofing for IndexedDB migration.

### Key Features

- **CRUD Operations**: Create, read, update, and delete checklists
- **Automatic Timestamps**: Manages `createdAt` and `updatedAt` timestamps
- **Storage Events**: Emits events for cross-tab synchronization
- **Version Management**: Built-in versioning for future data migrations

### Basic Usage

```typescript
import { 
  checklistStorage, 
  createEmptyChecklist,
  generateItemId 
} from './storage/checklistStorage';

// Create a new checklist
const checklist = createEmptyChecklist('Race Prep');

// Save to storage
await checklistStorage.saveChecklist(checklist);

// Get a checklist
const saved = await checklistStorage.getChecklist(checklist.id);

// Get all checklists
const allChecklists = await checklistStorage.getAllChecklists();

// Delete a checklist
await checklistStorage.deleteChecklist(checklist.id);

// Listen for storage changes (for cross-tab sync)
const unsubscribe = checklistStorage.onStorageChange((event) => {
  console.log('Storage changed:', event.type, event.checklistId);
});

// Later: unsubscribe
unsubscribe();
```

## Zustand Store

The Zustand store provides a higher-level interface for managing checklist state in React components.

### Key Features

- **State Management**: Centralized state for all checklists
- **Auto-persistence**: Automatically saves changes to localStorage
- **Cross-tab Sync**: Listens to storage events and updates state
- **Item Management**: Convenient methods for managing checklist items

### Using in React Components

```typescript
import { useChecklistStore } from './state/checklistStore';

function ChecklistComponent() {
  const { 
    checklists, 
    currentChecklistId,
    loadChecklists,
    createChecklist,
    addItem,
    toggleItemComplete 
  } = useChecklistStore();

  // Load checklists on mount
  useEffect(() => {
    loadChecklists();
  }, [loadChecklists]);

  // Create a new checklist
  const handleCreate = async () => {
    const checklist = await createChecklist('New Race');
    console.log('Created:', checklist);
  };

  // Add an item
  const handleAddItem = async (checklistId: string) => {
    await addItem(checklistId, {
      name: 'Water bottle',
      category: 'Hydration',
      completed: false,
    });
  };

  // Toggle item completion
  const handleToggle = async (checklistId: string, itemId: string) => {
    await toggleItemComplete(checklistId, itemId);
  };

  return (
    <div>
      {checklists.map(checklist => (
        <div key={checklist.id}>
          <h3>{checklist.name}</h3>
          {/* Render items */}
        </div>
      ))}
    </div>
  );
}
```

## Store API Reference

### State

- `checklists: Checklist[]` - Array of all checklists
- `currentChecklistId: string | null` - ID of the currently selected checklist
- `isLoading: boolean` - Loading state indicator
- `error: string | null` - Error message if any operation failed

### Actions

#### Checklist Management

- `loadChecklists(): Promise<void>` - Load all checklists from storage
- `createChecklist(name: string): Promise<Checklist>` - Create a new checklist
- `updateChecklist(checklist: Checklist): Promise<void>` - Update an existing checklist
- `deleteChecklist(id: string): Promise<void>` - Delete a checklist
- `setCurrentChecklist(id: string | null): void` - Set the current checklist

#### Item Management

- `addItem(checklistId: string, item: Omit<Item, 'id'>): Promise<void>` - Add an item to a checklist
- `updateItem(checklistId: string, itemId: string, updates: Partial<Item>): Promise<void>` - Update an item
- `deleteItem(checklistId: string, itemId: string): Promise<void>` - Delete an item
- `toggleItemComplete(checklistId: string, itemId: string): Promise<void>` - Toggle item completion status

## Data Model

### Checklist

```typescript
type Checklist = {
  id: string;
  name: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  items: Item[];
  generatedMeta?: GeneratedChecklistMeta; // For AI-generated checklists
};
```

### Item

```typescript
type Item = {
  id: string;
  name: string;
  category: string;
  notes?: string;
  quantity?: number;
  priority?: 'high' | 'normal' | 'optional';
  completed: boolean;
};
```

## Storage Events

The storage service emits events for cross-tab synchronization:

```typescript
type StorageChangeEvent = {
  type: 'create' | 'update' | 'delete';
  checklistId: string;
  checklist?: Checklist; // Present for 'create' and 'update'
};
```

## Future Enhancements

The storage layer is designed to support easy migration to IndexedDB:

1. Create a new class implementing `ChecklistStorageAPI`
2. Replace the singleton instance in `checklistStorage.ts`
3. No changes needed in the Zustand store or components

## Testing

See test files for usage examples:

- `src/__tests__/checklistStorage.test.ts` - Storage service tests
- `src/__tests__/checklistStore.test.ts` - Zustand store tests
