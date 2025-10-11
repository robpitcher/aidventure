import { useEffect, useState } from 'react';
import { useChecklistStore } from '../../state/checklistStore';
import type { Checklist } from '../../types/checklist';

export function ChecklistOverview() {
  const {
    checklists,
    isLoading,
    error,
    loadChecklists,
    createChecklist,
    setCurrentChecklist,
  } = useChecklistStore();

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

  const handleSelectChecklist = (id: string) => {
    setCurrentChecklist(id);
  };

  const getChecklistStats = (checklist: Checklist) => {
    const totalItems = checklist.items.length;
    const completedItems = checklist.items.filter((item) => item.completed).length;
    const completionPercentage =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    return { totalItems, completedItems, completionPercentage };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Checklists</h1>
            <p className="text-gray-600 mt-1">Manage your adventure racing gear checklists</p>
          </div>
          <button
            onClick={() => setIsCreatingChecklist(true)}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            New Checklist
          </button>
        </div>
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
      {checklists.length === 0 && (
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No checklists yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first checklist to start planning your adventure race gear
          </p>
          <button
            onClick={() => setIsCreatingChecklist(true)}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Create Your First Checklist
          </button>
        </div>
      )}

      {/* Checklists Grid */}
      {checklists.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {checklists.map((checklist) => {
            const { totalItems, completedItems, completionPercentage } =
              getChecklistStats(checklist);

            return (
              <div
                key={checklist.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSelectChecklist(checklist.id)}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:underline">
                  {checklist.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {completedItems} of {totalItems} items completed
                    </span>
                    <span className="font-medium">{completionPercentage}%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full transition-all"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(checklist.createdAt)}</span>
                  <span>Updated: {formatDate(checklist.updatedAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
