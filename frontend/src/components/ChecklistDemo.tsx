/**
 * Example demonstrating checklist storage and state management
 * Run this in your browser console or create a test component
 */

import { useChecklistStore } from '../state/checklistStore';
import { useEffect } from 'react';

export function ChecklistDemo() {
  const {
    checklists,
    currentChecklistId,
    isLoading,
    error,
    loadChecklists,
    createChecklist,
    addItem,
    toggleItemComplete,
    setCurrentChecklist,
  } = useChecklistStore();

  // Load checklists on mount
  useEffect(() => {
    loadChecklists();
  }, [loadChecklists]);

  // Demo: Create a checklist with some items
  const handleCreateDemo = async () => {
    const checklist = await createChecklist('24hr Adventure Race');
    
    // Add some items
    await addItem(checklist.id, {
      name: 'Topographic maps',
      category: 'Navigation',
      completed: false,
    });

    await addItem(checklist.id, {
      name: 'Compass',
      category: 'Navigation',
      completed: false,
    });

    await addItem(checklist.id, {
      name: 'Energy gels',
      category: 'Nutrition',
      quantity: 10,
      completed: false,
    });

    await addItem(checklist.id, {
      name: 'Water bottles',
      category: 'Hydration',
      quantity: 2,
      completed: false,
    });

    await addItem(checklist.id, {
      name: 'First aid kit',
      category: 'Emergency',
      completed: false,
    });

    setCurrentChecklist(checklist.id);
  };

  if (isLoading) {
    return <div className="p-4">Loading checklists...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  const currentChecklist = checklists.find((c) => c.id === currentChecklistId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checklist Storage Demo</h1>

      <div className="mb-6">
        <button
          onClick={handleCreateDemo}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Demo Checklist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Checklists List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            All Checklists ({checklists.length})
          </h2>
          {checklists.length === 0 ? (
            <p className="text-gray-500">No checklists yet. Create one above!</p>
          ) : (
            <div className="space-y-2">
              {checklists.map((checklist) => (
                <div
                  key={checklist.id}
                  onClick={() => setCurrentChecklist(checklist.id)}
                  className={`p-3 border rounded cursor-pointer ${
                    currentChecklistId === checklist.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <h3 className="font-medium">{checklist.name}</h3>
                  <p className="text-sm text-gray-600">
                    {checklist.items.length} items •{' '}
                    {checklist.items.filter((i) => i.completed).length} completed
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Checklist Items */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {currentChecklist ? currentChecklist.name : 'No checklist selected'}
          </h2>
          {currentChecklist && (
            <div className="space-y-2">
              {currentChecklist.items.length === 0 ? (
                <p className="text-gray-500">No items in this checklist</p>
              ) : (
                currentChecklist.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border border-gray-200 rounded flex items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() =>
                        toggleItemComplete(currentChecklist.id, item.id)
                      }
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          item.completed ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {item.name}
                        {item.quantity && ` (${item.quantity})`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.category}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Storage Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Storage Info</h3>
        <p className="text-sm text-gray-700">
          Data is persisted in localStorage. Open this page in another tab to see
          cross-tab synchronization in action!
        </p>
        <p className="text-sm text-gray-700 mt-2">
          Check your browser's Developer Tools → Application → Local Storage →
          localhost to see the stored data.
        </p>
      </div>
    </div>
  );
}
