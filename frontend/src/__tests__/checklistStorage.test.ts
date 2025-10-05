import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Checklist } from '../types/checklist';
import {
  checklistStorage,
  generateChecklistId,
  generateItemId,
  createEmptyChecklist,
} from '../storage/checklistStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('checklistStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getAllChecklists', () => {
    it('returns empty array when no checklists exist', async () => {
      const checklists = await checklistStorage.getAllChecklists();
      expect(checklists).toEqual([]);
    });

    it('returns all saved checklists', async () => {
      const checklist1 = createEmptyChecklist('Race 1');
      const checklist2 = createEmptyChecklist('Race 2');

      await checklistStorage.saveChecklist(checklist1);
      await checklistStorage.saveChecklist(checklist2);

      const checklists = await checklistStorage.getAllChecklists();
      expect(checklists).toHaveLength(2);
      expect(checklists.map((c) => c.name)).toContain('Race 1');
      expect(checklists.map((c) => c.name)).toContain('Race 2');
    });
  });

  describe('getChecklist', () => {
    it('returns null for non-existent checklist', async () => {
      const result = await checklistStorage.getChecklist('non-existent-id');
      expect(result).toBeNull();
    });

    it('returns the correct checklist by id', async () => {
      const checklist = createEmptyChecklist('My Checklist');
      await checklistStorage.saveChecklist(checklist);

      const result = await checklistStorage.getChecklist(checklist.id);
      expect(result).toEqual(checklist);
      expect(result?.name).toBe('My Checklist');
    });
  });

  describe('saveChecklist', () => {
    it('creates a new checklist with timestamps', async () => {
      const checklist = createEmptyChecklist('New Checklist');
      const originalCreatedAt = checklist.createdAt;

      await checklistStorage.saveChecklist(checklist);

      const saved = await checklistStorage.getChecklist(checklist.id);
      expect(saved).toBeDefined();
      expect(saved?.createdAt).toBe(originalCreatedAt);
      expect(saved?.updatedAt).toBeDefined();
    });

    it('updates an existing checklist', async () => {
      const checklist = createEmptyChecklist('Original Name');
      await checklistStorage.saveChecklist(checklist);

      const updatedChecklist: Checklist = {
        ...checklist,
        name: 'Updated Name',
        items: [
          {
            id: generateItemId(),
            name: 'Water bottle',
            category: 'Hydration',
            completed: false,
          },
        ],
      };

      await checklistStorage.saveChecklist(updatedChecklist);

      const saved = await checklistStorage.getChecklist(checklist.id);
      expect(saved?.name).toBe('Updated Name');
      expect(saved?.items).toHaveLength(1);
      expect(saved?.items[0].name).toBe('Water bottle');
    });

    it('updates the updatedAt timestamp on save', async () => {
      const checklist = createEmptyChecklist('Test');
      await checklistStorage.saveChecklist(checklist);

      const first = await checklistStorage.getChecklist(checklist.id);
      const firstUpdatedAt = first?.updatedAt;

      // Wait a bit to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = { ...checklist, name: 'Updated' };
      await checklistStorage.saveChecklist(updated);

      const second = await checklistStorage.getChecklist(checklist.id);
      expect(second?.updatedAt).not.toBe(firstUpdatedAt);
    });
  });

  describe('deleteChecklist', () => {
    it('removes a checklist from storage', async () => {
      const checklist = createEmptyChecklist('To Delete');
      await checklistStorage.saveChecklist(checklist);

      let result = await checklistStorage.getChecklist(checklist.id);
      expect(result).toBeDefined();

      await checklistStorage.deleteChecklist(checklist.id);

      result = await checklistStorage.getChecklist(checklist.id);
      expect(result).toBeNull();
    });

    it('does not error when deleting non-existent checklist', async () => {
      await expect(
        checklistStorage.deleteChecklist('non-existent-id')
      ).resolves.not.toThrow();
    });
  });

  describe('onStorageChange', () => {
    it('notifies listeners on create', async () => {
      const listener = vi.fn();
      const unsubscribe = checklistStorage.onStorageChange(listener);

      const checklist = createEmptyChecklist('New');
      await checklistStorage.saveChecklist(checklist);

      expect(listener).toHaveBeenCalledWith({
        type: 'create',
        checklistId: checklist.id,
        checklist: expect.objectContaining({
          id: checklist.id,
          name: 'New',
        }),
      });

      unsubscribe();
    });

    it('notifies listeners on update', async () => {
      const checklist = createEmptyChecklist('Original');
      await checklistStorage.saveChecklist(checklist);

      const listener = vi.fn();
      const unsubscribe = checklistStorage.onStorageChange(listener);

      const updated = { ...checklist, name: 'Updated' };
      await checklistStorage.saveChecklist(updated);

      expect(listener).toHaveBeenCalledWith({
        type: 'update',
        checklistId: checklist.id,
        checklist: expect.objectContaining({
          name: 'Updated',
        }),
      });

      unsubscribe();
    });

    it('notifies listeners on delete', async () => {
      const checklist = createEmptyChecklist('To Delete');
      await checklistStorage.saveChecklist(checklist);

      const listener = vi.fn();
      const unsubscribe = checklistStorage.onStorageChange(listener);

      await checklistStorage.deleteChecklist(checklist.id);

      expect(listener).toHaveBeenCalledWith({
        type: 'delete',
        checklistId: checklist.id,
      });

      unsubscribe();
    });

    it('allows unsubscribing from storage changes', async () => {
      const listener = vi.fn();
      const unsubscribe = checklistStorage.onStorageChange(listener);

      unsubscribe();

      const checklist = createEmptyChecklist('Test');
      await checklistStorage.saveChecklist(checklist);

      expect(listener).not.toHaveBeenCalled();
    });
  });
});

describe('utility functions', () => {
  describe('generateChecklistId', () => {
    it('generates a unique ID', () => {
      const id1 = generateChecklistId();
      const id2 = generateChecklistId();
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });

    it('generates a valid UUID format', () => {
      const id = generateChecklistId();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(id).toMatch(uuidRegex);
    });
  });

  describe('generateItemId', () => {
    it('generates a unique ID', () => {
      const id1 = generateItemId();
      const id2 = generateItemId();
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });
  });

  describe('createEmptyChecklist', () => {
    it('creates a checklist with correct structure', () => {
      const checklist = createEmptyChecklist('Test Checklist');
      expect(checklist).toMatchObject({
        id: expect.any(String),
        name: 'Test Checklist',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        items: [],
      });
    });

    it('creates checklist with valid ISO timestamps', () => {
      const checklist = createEmptyChecklist('Test');
      const createdAt = new Date(checklist.createdAt);
      const updatedAt = new Date(checklist.updatedAt);

      expect(createdAt.toISOString()).toBe(checklist.createdAt);
      expect(updatedAt.toISOString()).toBe(checklist.updatedAt);
    });

    it('sets createdAt and updatedAt to same value', () => {
      const checklist = createEmptyChecklist('Test');
      expect(checklist.createdAt).toBe(checklist.updatedAt);
    });
  });
});
