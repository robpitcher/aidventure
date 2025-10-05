/**
 * Core data types for the Aidventure checklist system
 * Based on PRD.md Section 8: Data Model (MVP Local)
 */

export type Checklist = {
  id: string;
  name: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  items: Item[];
  generatedMeta?: GeneratedChecklistMeta;
};

export type Item = {
  id: string;
  name: string;
  category: string;
  notes?: string;
  quantity?: number;
  priority?: 'high' | 'normal' | 'optional';
  completed: boolean;
};

export type GeneratedChecklistMeta = {
  sourceParams: AIGenerationParams;
  chatSessionId?: string;
};

export type AIGenerationParams = {
  duration: string | number;
  disciplines: string[];
  environment?: string;
  season?: string;
  teamSize?: number;
  sleepStrategy?: string;
  weatherExtremes?: string;
};

export type ChatSession = {
  id: string;
  turns: { role: 'system' | 'user' | 'assistant'; content: string }[];
};

/**
 * AI response structure from Azure OpenAI
 */
export type AIChecklistResponse = {
  categories: CategoryResponse[];
  advisories?: string[];
};

export type CategoryResponse = {
  name: string;
  items: ItemResponse[];
};

export type ItemResponse = {
  itemName: string;
  quantity?: number;
  notes?: string;
  priority?: 'high' | 'normal' | 'optional';
};
