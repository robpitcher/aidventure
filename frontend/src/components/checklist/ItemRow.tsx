import { useState, useRef, useEffect } from 'react';
import type { Item } from '../../types/checklist';

interface ItemRowProps {
  item: Item;
  checklistId: string;
  onToggleComplete: (checklistId: string, itemId: string) => Promise<void>;
  onUpdate: (checklistId: string, itemId: string, updates: Partial<Item>) => Promise<void>;
  onDelete: (checklistId: string, itemId: string) => Promise<void>;
}

export function ItemRow({ item, checklistId, onToggleComplete, onUpdate, onDelete }: ItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedNotes, setEditedNotes] = useState(item.notes || '');
  const [editedQuantity, setEditedQuantity] = useState(item.quantity?.toString() || '');
  const [editedCategory, setEditedCategory] = useState(item.category || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!editedName.trim()) {
      return; // Don't save empty names
    }

    await onUpdate(checklistId, item.id, {
      name: editedName.trim(),
      category: editedCategory.trim() || undefined,
      notes: editedNotes.trim() || undefined,
      quantity: editedQuantity ? parseInt(editedQuantity, 10) : undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(item.name);
    setEditedNotes(item.notes || '');
    setEditedQuantity(item.quantity?.toString() || '');
    setEditedCategory(item.category || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // In-page confirmation for delete
  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  const handleConfirmDelete = async () => {
    await onDelete(checklistId, item.id);
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  if (isDeleting) {
    return (
      <div className="p-3 border border-red-500 rounded bg-red-50">
        <div className="space-y-3">
          <p className="text-sm text-gray-900">
            Delete "{item.name}"?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmDelete}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              aria-label="Confirm delete"
            >
              Delete
            </button>
            <button
              onClick={handleCancelDelete}
              className="px-3 py-1 bg-gray-400 text-white rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Cancel delete"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="p-3 border border-accent rounded bg-white">
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Item name"
            aria-label="Item name"
          />
          <input
            type="text"
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Category (optional)"
            aria-label="Category"
          />
          <input
            type="text"
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Notes (optional)"
            aria-label="Item notes"
          />
          <input
            type="number"
            value={editedQuantity}
            onChange={(e) => setEditedQuantity(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Qty"
            aria-label="Quantity"
            min="1"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-success text-white rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-success"
              aria-label="Save changes"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-400 text-white rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border border-gray-200 rounded bg-white hover:border-gray-300 transition-colors group">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggleComplete(checklistId, item.id)}
          className="mt-1 w-4 h-4 text-success focus:ring-success focus:ring-2"
          aria-label={`Mark ${item.name} as ${item.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium hover:underline cursor-pointer ${
              item.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}
            onClick={() => setIsEditing(true)}
          >
            {item.name}
            {item.quantity && (
              <span className="ml-2 text-sm text-gray-600">× {item.quantity}</span>
            )}
          </p>
          {item.notes && (
            <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
          )}
          {item.category && (
            <span
              onClick={() => setIsEditing(true)}
              className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer"
            >
              {item.category}
            </span>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-600 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent rounded"
            aria-label={`Edit ${item.name}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1 text-gray-600 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 rounded"
            aria-label={`Delete ${item.name}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
