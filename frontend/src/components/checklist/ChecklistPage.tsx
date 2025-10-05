import { useEffect } from 'react';
import { useChecklistStore } from '../../state/checklistStore';
import { CategorySection } from './CategorySection';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import type { Item } from '../../types/checklist';

export function ChecklistPage() {
  const {
    checklists,
    currentChecklistId,
    isLoading,
    error,
    loadChecklists,
    createChecklist,
    toggleItemComplete,
    updateItem,
    deleteItem,
    addItem,
  } = useChecklistStore();

  useEffect(() => {
    loadChecklists();
  }, [loadChecklists]);

  const handleCreateChecklist = async () => {
    const name = prompt('Enter checklist name:');
    if (name?.trim()) {
      await createChecklist(name.trim());
    }
  };

  if (isLoading && checklists.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading checklists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
        Error: {error}
      </div>
    );
  }

  const currentChecklist = checklists.find((c) => c.id === currentChecklistId);

  // Group items by category
  const itemsByCategory = currentChecklist
    ? DEFAULT_CATEGORIES.reduce((acc, category) => {
        acc[category] = currentChecklist.items.filter((item) => item.category === category);
        return acc;
      }, {} as Record<string, Item[]>)
    : {};

  // Calculate stats
  const totalItems = currentChecklist?.items.length || 0;
  const completedItems = currentChecklist?.items.filter((i) => i.completed).length || 0;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentChecklist?.name || 'Packing Checklist'}
          </h1>
          <button
            onClick={handleCreateChecklist}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            New Checklist
          </button>
        </div>

        {currentChecklist && (
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">{completedItems}</span> of{' '}
              <span className="font-medium">{totalItems}</span> items packed
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
              <div
                className="bg-success h-2 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="font-medium">{completionPercentage}%</div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!currentChecklist && (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No checklist selected</h3>
          <p className="text-gray-600 mb-4">
            Create a new checklist to start planning your adventure race gear
          </p>
          <button
            onClick={handleCreateChecklist}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Create Your First Checklist
          </button>
        </div>
      )}

      {/* Categories */}
      {currentChecklist && (
        <div className="space-y-4">
          {DEFAULT_CATEGORIES.map((category) => {
            const categoryItems = itemsByCategory[category] || [];
            // Only show categories with items, or all categories if checklist is empty
            if (categoryItems.length > 0 || totalItems === 0) {
              return (
                <CategorySection
                  key={category}
                  category={category}
                  items={categoryItems}
                  checklistId={currentChecklist.id}
                  onToggleComplete={toggleItemComplete}
                  onUpdateItem={updateItem}
                  onDeleteItem={deleteItem}
                  onAddItem={addItem}
                />
              );
            }
            return null;
          })}
        </div>
      )}

      {/* Bulk Actions */}
      {currentChecklist && totalItems > 0 && (
        <div className="mt-6 p-4 bg-panel rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Quick Actions:</span>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  for (const item of currentChecklist.items.filter(i => !i.completed)) {
                    await toggleItemComplete(currentChecklist.id, item.id);
                  }
                }}
                className="px-3 py-1 text-sm bg-success text-white rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-success"
                aria-label="Mark all items as complete"
              >
                Mark All Complete
              </button>
              <button
                onClick={async () => {
                  for (const item of currentChecklist.items.filter(i => i.completed)) {
                    await toggleItemComplete(currentChecklist.id, item.id);
                  }
                }}
                className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Reset all items to incomplete"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
