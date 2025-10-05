import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChecklistStore } from '../state/checklistStore';
import * as storage from '../storage/checklistStorage';
import type { StorageChangeEvent } from '../storage/checklistStorage';

// Mock the storage module
vi.mock('../storage/checklistStorage', () => {
  const listeners = new Set<(event: StorageChangeEvent) => void>();

  return {
    checklistStorage: {
      getAllChecklists: vi.fn(async () => []),
      getChecklist: vi.fn(async () => null),
      saveChecklist: vi.fn(async () => {}),
      deleteChecklist: vi.fn(async () => {}),
      onStorageChange: vi.fn((callback: (event: StorageChangeEvent) => void) => {
        listeners.add(callback);
        return () => listeners.delete(callback);
      }),
    },
    createEmptyChecklist: (name: string) => ({
      id: `checklist-${Math.random()}`,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
    }),
    generateItemId: () => `item-${Math.random()}`,
  };
});

describe('useChecklistStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useChecklistStore.setState({
      checklists: [],
      currentChecklistId: null,
      error: null,
      isLoading: false,
    });

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('loadChecklists', () => {
    it('loads checklists from storage', async () => {
      const mockChecklists = [
        {
          id: '1',
          name: 'Race 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          items: [],
        },
      ];

      vi.mocked(storage.checklistStorage.getAllChecklists).mockResolvedValue(
        mockChecklists
      );

      const { result } = renderHook(() => useChecklistStore());

      await act(async () => {
        await result.current.loadChecklists();
      });

      expect(result.current.checklists).toEqual(mockChecklists);
      expect(result.current.isLoading).toBe(false);
    });

    it('handles loading errors', async () => {
      vi.mocked(storage.checklistStorage.getAllChecklists).mockRejectedValue(
        new Error('Storage error')
      );

      const { result } = renderHook(() => useChecklistStore());

      await act(async () => {
        await result.current.loadChecklists();
      });

      expect(result.current.error).toBe('Storage error');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('createChecklist', () => {
    it('creates a new checklist and adds it to state', async () => {
      const { result } = renderHook(() => useChecklistStore());

      let createdChecklist;
      await act(async () => {
        createdChecklist = await result.current.createChecklist('My Race');
      });

      expect(createdChecklist).toBeDefined();
      expect(result.current.checklists).toHaveLength(1);
      expect(result.current.checklists[0].name).toBe('My Race');
      expect(result.current.currentChecklistId).toBe(createdChecklist!.id);
      expect(storage.checklistStorage.saveChecklist).toHaveBeenCalled();
    });
  });

  describe('updateChecklist', () => {
    it('updates an existing checklist', async () => {
      const { result } = renderHook(() => useChecklistStore());

      let checklist;
      await act(async () => {
        checklist = await result.current.createChecklist('Original');
      });

      const updated = { ...checklist!, name: 'Updated' };

      await act(async () => {
        await result.current.updateChecklist(updated);
      });

      expect(result.current.checklists[0].name).toBe('Updated');
      expect(storage.checklistStorage.saveChecklist).toHaveBeenCalledWith(updated);
    });
  });

  describe('deleteChecklist', () => {
    it('removes a checklist from state', async () => {
      const { result } = renderHook(() => useChecklistStore());

      let checklist;
      await act(async () => {
        checklist = await result.current.createChecklist('To Delete');
      });

      expect(result.current.checklists).toHaveLength(1);

      await act(async () => {
        await result.current.deleteChecklist(checklist!.id);
      });

      expect(result.current.checklists).toHaveLength(0);
      expect(storage.checklistStorage.deleteChecklist).toHaveBeenCalledWith(
        checklist!.id
      );
    });

    it('clears currentChecklistId when deleting current checklist', async () => {
      const { result } = renderHook(() => useChecklistStore());

      let checklist;
      await act(async () => {
        checklist = await result.current.createChecklist('Current');
      });

      expect(result.current.currentChecklistId).toBe(checklist!.id);

      await act(async () => {
        await result.current.deleteChecklist(checklist!.id);
      });

      expect(result.current.currentChecklistId).toBeNull();
    });
  });

  describe('setCurrentChecklist', () => {
    it('sets the current checklist ID', () => {
      const { result } = renderHook(() => useChecklistStore());

      act(() => {
        result.current.setCurrentChecklist('test-id');
      });

      expect(result.current.currentChecklistId).toBe('test-id');
    });
  });

  describe('addItem', () => {
    it('adds an item to a checklist', async () => {
      const { result } = renderHook(() => useChecklistStore());

      let checklist;
      await act(async () => {
        checklist = await result.current.createChecklist('Test');
      });

      await act(async () => {
        await result.current.addItem(checklist!.id, {
          name: 'Water bottle',
          category: 'Hydration',
          completed: false,
        });
      });

      const updated = result.current.checklists.find(
        (c) => c.id === checklist!.id
      );
      expect(updated?.items).toHaveLength(1);
      expect(updated?.items[0].name).toBe('Water bottle');
    });

    it('throws error when checklist not found', async () => {
      const { result } = renderHook(() => useChecklistStore());

      await expect(
        act(async () => {
          await result.current.addItem('non-existent', {
            name: 'Item',
            category: 'Test',
            completed: false,
          });
        })
      ).rejects.toThrow('Checklist not found');
    });
  });

  describe('updateItem', () => {
    it('updates an item in a checklist', async () => {
      const { result } = renderHook(() => useChecklistStore());

      let checklist;
      await act(async () => {
        checklist = await result.current.createChecklist('Test');
        await result.current.addItem(checklist.id, {
          name: 'Original',
          category: 'Test',
          completed: false,
        });
      });

      const itemId = result.current.checklists[0].items[0].id;

      await act(async () => {
        await result.current.updateItem(checklist!.id, itemId, {
          name: 'Updated',
          completed: true,
        });
      });

      const updated = result.current.checklists[0].items[0];
      expect(updated.name).toBe('Updated');
      expect(updated.completed).toBe(true);
    });
  });

  describe('deleteItem', () => {
    it('removes an item from a checklist', async () => {
      const { result } = renderHook(() => useChecklistStore());

      let checklist;
      await act(async () => {
        checklist = await result.current.createChecklist('Test');
        await result.current.addItem(checklist.id, {
          name: 'To Delete',
          category: 'Test',
          completed: false,
        });
      });

      expect(result.current.checklists[0].items).toHaveLength(1);

      const itemId = result.current.checklists[0].items[0].id;

      await act(async () => {
        await result.current.deleteItem(checklist!.id, itemId);
      });

      expect(result.current.checklists[0].items).toHaveLength(0);
    });
  });

  describe('toggleItemComplete', () => {
    it('toggles the completed status of an item', async () => {
      const { result } = renderHook(() => useChecklistStore());

      let checklist;
      await act(async () => {
        checklist = await result.current.createChecklist('Test');
        await result.current.addItem(checklist.id, {
          name: 'Item',
          category: 'Test',
          completed: false,
        });
      });

      const itemId = result.current.checklists[0].items[0].id;
      expect(result.current.checklists[0].items[0].completed).toBe(false);

      await act(async () => {
        await result.current.toggleItemComplete(checklist!.id, itemId);
      });

      expect(result.current.checklists[0].items[0].completed).toBe(true);

      await act(async () => {
        await result.current.toggleItemComplete(checklist!.id, itemId);
      });

      expect(result.current.checklists[0].items[0].completed).toBe(false);
    });
  });
});
