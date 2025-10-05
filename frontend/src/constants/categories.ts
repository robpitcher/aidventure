/**
 * Default categories for adventure racing checklists
 * Based on PRD.md Section 5.2
 */

export const DEFAULT_CATEGORIES = [
  'Navigation',
  'Clothing',
  'Footwear',
  'Nutrition/Hydration',
  'Bike Gear',
  'Paddle Gear',
  'Safety/Medical',
  'Lighting',
  'Sleep (expedition)',
  'Miscellaneous',
] as const;

export type DefaultCategory = typeof DEFAULT_CATEGORIES[number];
