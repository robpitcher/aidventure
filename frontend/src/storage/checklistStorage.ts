/**
 * Local storage service for checklist persistence
 * Uses localStorage with abstraction layer for future IndexedDB migration
 */

import type { Checklist } from '../types/checklist';

const STORAGE_KEY = 'aidventure_checklists';
const STORAGE_VERSION = '1.0';

/**
 * Storage event type for cross-tab synchronization
 */
export type StorageChangeEvent = {
  type: 'create' | 'update' | 'delete';
  checklistId: string;
  checklist?: Checklist;
};

/**
 * Storage interface for checklist persistence
 * This abstraction allows for easy migration from localStorage to IndexedDB
 */
export interface ChecklistStorageAPI {
  getAllChecklists(): Promise<Checklist[]>;
  getChecklist(id: string): Promise<Checklist | null>;
  saveChecklist(checklist: Checklist): Promise<void>;
  deleteChecklist(id: string): Promise<void>;
  onStorageChange(callback: (event: StorageChangeEvent) => void): () => void;
}

/**
 * LocalStorage implementation of ChecklistStorageAPI
 */
class LocalStorageChecklistStorage implements ChecklistStorageAPI {
  private storageKey = STORAGE_KEY;
  private listeners: Set<(event: StorageChangeEvent) => void> = new Set();

  constructor() {
    // Listen for storage events from other tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageEvent);
    }
  }

  private handleStorageEvent = (event: StorageEvent) => {
    if (event.key === this.storageKey && event.newValue) {
      // Storage changed in another tab - notify listeners
      // We can't determine the exact change type from storage events alone,
      // so we'll need to compare values if needed in the future
    }
  };

  private getStorageData(): Record<string, Checklist> {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return {};
      const parsed = JSON.parse(data);
      // Validate storage version for future migrations
      if (parsed.version === STORAGE_VERSION) {
        return parsed.checklists || {};
      }
      // Handle migration if needed in the future
      return {};
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return {};
    }
  }

  private setStorageData(checklists: Record<string, Checklist>): void {
    try {
      const data = {
        version: STORAGE_VERSION,
        checklists,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      throw new Error('Failed to save checklist data');
    }
  }

  private notifyListeners(event: StorageChangeEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  async getAllChecklists(): Promise<Checklist[]> {
    const data = this.getStorageData();
    return Object.values(data);
  }

  async getChecklist(id: string): Promise<Checklist | null> {
    const data = this.getStorageData();
    return data[id] || null;
  }

  async saveChecklist(checklist: Checklist): Promise<void> {
    const data = this.getStorageData();
    const isNew = !data[checklist.id];
    
    // Update timestamps
    const now = new Date().toISOString();
    const updatedChecklist = {
      ...checklist,
      updatedAt: now,
      createdAt: checklist.createdAt || now,
    };

    data[checklist.id] = updatedChecklist;
    this.setStorageData(data);

    // Notify listeners
    this.notifyListeners({
      type: isNew ? 'create' : 'update',
      checklistId: checklist.id,
      checklist: updatedChecklist,
    });
  }

  async deleteChecklist(id: string): Promise<void> {
    const data = this.getStorageData();
    if (data[id]) {
      delete data[id];
      this.setStorageData(data);

      // Notify listeners
      this.notifyListeners({
        type: 'delete',
        checklistId: id,
      });
    }
  }

  onStorageChange(
    callback: (event: StorageChangeEvent) => void
  ): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  cleanup(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageEvent);
    }
  }
}

/**
 * Singleton instance of the storage service
 * Future: This could be swapped for IndexedDB implementation
 */
export const checklistStorage: ChecklistStorageAPI =
  new LocalStorageChecklistStorage();

/**
 * Utility functions for checklist operations
 */

/**
 * Generate a unique ID for a new checklist
 */
export function generateChecklistId(): string {
  return crypto.randomUUID();
}

/**
 * Generate a unique ID for a new item
 */
export function generateItemId(): string {
  return crypto.randomUUID();
}

/**
 * Create a new empty checklist
 */
export function createEmptyChecklist(name: string): Checklist {
  const now = new Date().toISOString();
  return {
    id: generateChecklistId(),
    name,
    createdAt: now,
    updatedAt: now,
    items: [],
  };
}
