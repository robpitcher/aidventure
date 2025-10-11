import { useEffect, useState } from 'react';
import { useChecklistStore } from '../../state/checklistStore';
import { ItemRow } from './ItemRow';
import { AddItemForm } from './AddItemForm';

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
    setCurrentChecklist,
  } = useChecklistStore();

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isCreatingChecklist, setIsCreatingChecklist] = useState(false);
  const [newChecklistName, setNewChecklistName] = useState('');

  useEffect(() => {
    loadChecklists();
  }, [loadChecklists]);

  const handleCreateChecklist = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newChecklistName.trim()) {
      await createChecklist(newChecklistName.trim());
      setNewChecklistName('');
      setIsCreatingChecklist(false);
    }
  };

  const handleCancelCreate = () => {
    setNewChecklistName('');
    setIsCreatingChecklist(false);
  };

  const handleAddItem = async (
    checklistId: string,
    item: Omit<import('../../types/checklist').Item, 'id'>
  ) => {
    await addItem(checklistId, item);
    setIsAddingItem(false);
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
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">Error: {error}</div>
    );
  }

  const currentChecklist = checklists.find((c) => c.id === currentChecklistId);

  // Calculate stats
  const totalItems = currentChecklist?.items.length || 0;
  const completedItems = currentChecklist?.items.filter((i) => i.completed).length || 0;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentChecklist(null)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
              aria-label="Back to overview"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentChecklist?.name || 'Packing Checklist'}
            </h1>
          </div>
          <button
            onClick={() => setIsCreatingChecklist(true)}
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

      {/* Create Checklist Form */}
      {isCreatingChecklist && (
        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <form onSubmit={handleCreateChecklist} className="space-y-4">
            <div>
              <label
                htmlFor="checklist-name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Checklist Name
              </label>
              <input
                id="checklist-name"
                type="text"
                value={newChecklistName}
                onChange={(e) => setNewChecklistName(e.target.value)}
                placeholder="Enter checklist name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                autoFocus
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Create Checklist
              </button>
              <button
                type="button"
                onClick={handleCancelCreate}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
            onClick={() => setIsCreatingChecklist(true)}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Create Your First Checklist
          </button>
        </div>
      )}

      {/* Items List */}
      {currentChecklist && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {totalItems === 0 && !isAddingItem ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">Your checklist is empty</p>
                <button
                  onClick={() => setIsAddingItem(true)}
                  className="text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded px-2"
                >
                  Add your first item
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {currentChecklist.items.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    checklistId={currentChecklist.id}
                    onToggleComplete={toggleItemComplete}
                    onUpdate={updateItem}
                    onDelete={deleteItem}
                  />
                ))}

                {isAddingItem ? (
                  <AddItemForm
                    checklistId={currentChecklist.id}
                    category="Miscellaneous"
                    onAdd={handleAddItem}
                    onCancel={() => setIsAddingItem(false)}
                  />
                ) : (
                  <button
                    onClick={() => setIsAddingItem(true)}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-accent hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-label="Add item"
                  >
                    + Add Item
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {currentChecklist && totalItems > 0 && (
        <div className="mt-6 p-4 bg-panel rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Quick Actions:</span>
            <div className="flex gap-2">
              <button
              // TODO: [Performance] Sequential awaiting in a loop can be slow. Consider using Promise.all() to toggle items concurrently: await Promise.all(currentChecklist.items.filter((i) => !i.completed).map(item => toggleItemComplete(currentChecklist.id, item.id)))
                onClick={async () => {
                  for (const item of currentChecklist.items.filter((i) => !i.completed)) {
                    await toggleItemComplete(currentChecklist.id, item.id);
                  }
                }}
                className="px-3 py-1 text-sm bg-success text-white rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-success"
                aria-label="Mark all items as complete"
              >
                Mark All Complete
              </button>
              <button
              // TODO: [Performance] Sequential awaiting in a loop can be slow. Consider using Promise.all() to toggle items concurrently: await Promise.all(currentChecklist.items.filter((i) => !i.completed).map(item => toggleItemComplete(currentChecklist.id, item.id)))
                onClick={async () => {
                  for (const item of currentChecklist.items.filter((i) => i.completed)) {
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
