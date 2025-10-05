/**
 * Zustand store for checklist state management
 * Integrates with the storage layer for persistence
 */

import { create } from 'zustand';
import type { Checklist, Item } from '../types/checklist';
import {
  checklistStorage,
  createEmptyChecklist,
  generateItemId,
  type StorageChangeEvent,
} from '../storage/checklistStorage';

interface ChecklistState {
  checklists: Checklist[];
  currentChecklistId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadChecklists: () => Promise<void>;
  createChecklist: (name: string) => Promise<Checklist>;
  updateChecklist: (checklist: Checklist) => Promise<void>;
  deleteChecklist: (id: string) => Promise<void>;
  setCurrentChecklist: (id: string | null) => void;

  // Item actions
  addItem: (checklistId: string, item: Omit<Item, 'id'>) => Promise<void>;
  updateItem: (checklistId: string, itemId: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (checklistId: string, itemId: string) => Promise<void>;
  toggleItemComplete: (checklistId: string, itemId: string) => Promise<void>;
}

export const useChecklistStore = create<ChecklistState>((set, get) => {
  // Subscribe to storage changes for cross-tab sync
  checklistStorage.onStorageChange((event: StorageChangeEvent) => {
    const { checklists } = get();
    
    switch (event.type) {
      case 'create':
      case 'update':
        if (event.checklist) {
          const index = checklists.findIndex((c) => c.id === event.checklistId);
          if (index >= 0) {
            // Update existing
            const updated = [...checklists];
            updated[index] = event.checklist;
            set({ checklists: updated });
          } else {
            // Add new
            set({ checklists: [...checklists, event.checklist] });
          }
        }
        break;
      case 'delete':
        set({
          checklists: checklists.filter((c) => c.id !== event.checklistId),
          currentChecklistId:
            get().currentChecklistId === event.checklistId
              ? null
              : get().currentChecklistId,
        });
        break;
    }
  });

  return {
    checklists: [],
    currentChecklistId: null,
    isLoading: false,
    error: null,

    loadChecklists: async () => {
      set({ isLoading: true, error: null });
      try {
        const checklists = await checklistStorage.getAllChecklists();
        set({ checklists, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to load checklists',
          isLoading: false,
        });
      }
    },

    createChecklist: async (name: string) => {
      set({ isLoading: true, error: null });
      try {
        const checklist = createEmptyChecklist(name);
        await checklistStorage.saveChecklist(checklist);
        set((state) => ({
          checklists: [...state.checklists, checklist],
          currentChecklistId: checklist.id,
          isLoading: false,
        }));
        return checklist;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to create checklist',
          isLoading: false,
        });
        throw error;
      }
    },

    updateChecklist: async (checklist: Checklist) => {
      set({ isLoading: true, error: null });
      try {
        await checklistStorage.saveChecklist(checklist);
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === checklist.id ? checklist : c
          ),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to update checklist',
          isLoading: false,
        });
        throw error;
      }
    },

    deleteChecklist: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        await checklistStorage.deleteChecklist(id);
        set((state) => ({
          checklists: state.checklists.filter((c) => c.id !== id),
          currentChecklistId: state.currentChecklistId === id ? null : state.currentChecklistId,
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to delete checklist',
          isLoading: false,
        });
        throw error;
      }
    },

    setCurrentChecklist: (id: string | null) => {
      set({ currentChecklistId: id });
    },

    addItem: async (checklistId: string, item: Omit<Item, 'id'>) => {
      const { checklists } = get();
      const checklist = checklists.find((c) => c.id === checklistId);
      
      if (!checklist) {
        throw new Error('Checklist not found');
      }

      const newItem: Item = {
        ...item,
        id: generateItemId(),
      };

      const updatedChecklist: Checklist = {
        ...checklist,
        items: [...checklist.items, newItem],
      };

      await get().updateChecklist(updatedChecklist);
    },

    updateItem: async (checklistId: string, itemId: string, updates: Partial<Item>) => {
      const { checklists } = get();
      const checklist = checklists.find((c) => c.id === checklistId);
      
      if (!checklist) {
        throw new Error('Checklist not found');
      }

      const updatedChecklist: Checklist = {
        ...checklist,
        items: checklist.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      };

      await get().updateChecklist(updatedChecklist);
    },

    deleteItem: async (checklistId: string, itemId: string) => {
      const { checklists } = get();
      const checklist = checklists.find((c) => c.id === checklistId);
      
      if (!checklist) {
        throw new Error('Checklist not found');
      }

      const updatedChecklist: Checklist = {
        ...checklist,
        items: checklist.items.filter((item) => item.id !== itemId),
      };

      await get().updateChecklist(updatedChecklist);
    },

    toggleItemComplete: async (checklistId: string, itemId: string) => {
      const { checklists } = get();
      const checklist = checklists.find((c) => c.id === checklistId);
      
      if (!checklist) {
        throw new Error('Checklist not found');
      }

      const item = checklist.items.find((i) => i.id === itemId);
      if (!item) {
        throw new Error('Item not found');
      }

      await get().updateItem(checklistId, itemId, { completed: !item.completed });
    },
  };
});
