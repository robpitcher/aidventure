import { useState } from 'react';
import type { Item } from '../../types/checklist';
import { ItemRow } from './ItemRow';
import { AddItemForm } from './AddItemForm';

interface CategorySectionProps {
  category: string;
  items: Item[];
  checklistId: string;
  onToggleComplete: (checklistId: string, itemId: string) => Promise<void>;
  onUpdateItem: (checklistId: string, itemId: string, updates: Partial<Item>) => Promise<void>;
  onDeleteItem: (checklistId: string, itemId: string) => Promise<void>;
  onAddItem: (checklistId: string, item: Omit<Item, 'id'>) => Promise<void>;
}

export function CategorySection({
  category,
  items,
  checklistId,
  onToggleComplete,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
}: CategorySectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const completedCount = items.filter((item) => item.completed).length;

  const handleAddItem = async (checklistId: string, item: Omit<Item, 'id'>) => {
    await onAddItem(checklistId, item);
    setIsAddingItem(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      {/* Category Header */}
      <div className="bg-panel border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
          aria-expanded={!isCollapsed}
          aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${category} section`}
        >
          <div className="flex items-center gap-2">
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${
                isCollapsed ? '-rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {completedCount} / {items.length}
            </span>
          </div>
        </button>
      </div>

      {/* Category Content */}
      {!isCollapsed && (
        <div className="p-4">
          {items.length === 0 && !isAddingItem ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No items in this category yet</p>
              <button
                onClick={() => setIsAddingItem(true)}
                className="text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded px-2"
              >
                Add an item
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  checklistId={checklistId}
                  onToggleComplete={onToggleComplete}
                  onUpdate={onUpdateItem}
                  onDelete={onDeleteItem}
                />
              ))}
              
              {isAddingItem ? (
                <AddItemForm
                  checklistId={checklistId}
                  category={category}
                  onAdd={handleAddItem}
                  onCancel={() => setIsAddingItem(false)}
                />
              ) : (
                <button
                  onClick={() => setIsAddingItem(true)}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-accent hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label={`Add item to ${category}`}
                >
                  + Add Item
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
