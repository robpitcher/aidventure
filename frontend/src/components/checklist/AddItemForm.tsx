import { useState, useRef, useEffect } from 'react';
import type { Item } from '../../types/checklist';

interface AddItemFormProps {
  checklistId: string;
  category?: string; // Optional, not used but kept for backward compatibility
  onAdd: (checklistId: string, item: Omit<Item, 'id'>) => Promise<void>;
  onCancel?: () => void;
}

export function AddItemForm({ checklistId, onAdd, onCancel }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(checklistId, {
        name: name.trim(),
        category: selectedCategory.trim() || undefined,
        notes: notes.trim() || undefined,
        quantity: quantity ? parseInt(quantity, 10) : undefined,
        completed: false,
      });

      // Reset form
      setName('');
      setNotes('');
      setQuantity('1');
      setSelectedCategory('');
      inputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border border-accent rounded bg-panel">
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Item name"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Item name"
          required
        />

        <input
          type="text"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Category (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Category"
        />

        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Notes (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Notes"
        />

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Quantity"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Quantity"
          min="1"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="px-4 py-2 bg-success text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-success"
          >
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
