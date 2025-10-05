# Checklist UI Guide

## Overview

The Checklist UI provides a complete CRUD interface for managing adventure racing packing checklists with category grouping and real-time persistence.

## Features

### Category Grouping
- Items are automatically grouped by 10 default categories:
  - Navigation
  - Clothing
  - Footwear
  - Nutrition/Hydration
  - Bike Gear
  - Paddle Gear
  - Safety/Medical
  - Lighting
  - Sleep (expedition)
  - Miscellaneous

### CRUD Operations

#### Adding Items
1. Click "Add Item" button in any category
2. Fill in item details:
   - **Name** (required) - The item name
   - **Category** - Select from dropdown (pre-filled with current category)
   - **Notes** (optional) - Additional details
   - **Quantity** (optional) - Number of items
   - **Priority** - High Priority, Normal, or Optional
3. Click "Add Item" or press Enter to save
4. Press Escape to cancel

#### Editing Items
1. Hover over an item to reveal edit/delete buttons
2. Click the edit (pencil) icon
3. Modify any field
4. Click "Save" or press Enter to save changes
5. Click "Cancel" or press Escape to discard changes

#### Deleting Items
1. Hover over an item to reveal edit/delete buttons
2. Click the delete (trash) icon
3. Confirm deletion in the prompt

#### Completing Items
- Click the checkbox next to any item to mark it as complete/incomplete
- Completed items show strikethrough text and gray color
- Progress bar updates automatically

### Category Management

#### Collapsing/Expanding
- Click the category header to collapse or expand
- Arrow icon indicates current state
- Category shows item count (completed / total)

### Progress Tracking

- **Progress Bar**: Visual indicator of completion percentage
- **Item Count**: Shows "X of Y items packed"
- **Per-Category Count**: Each category header shows completion status

### Bulk Actions

Two quick actions are available at the bottom:
- **Mark All Complete**: Marks all items in the checklist as complete
- **Reset All**: Marks all items as incomplete

### Keyboard Accessibility

All controls are keyboard accessible:
- **Tab** - Navigate between fields
- **Shift+Tab** - Navigate backward
- **Enter** - Submit forms, toggle checkboxes
- **Escape** - Cancel editing/adding
- **Space** - Toggle checkboxes (when focused)

All buttons and interactive elements have ARIA labels for screen readers.

### Data Persistence

- All changes are automatically saved to localStorage
- Data persists across browser sessions
- Cross-tab synchronization supported (changes in one tab reflect in others)

## Color Coding

- **High Priority**: Yellow/gold badge
- **Normal Priority**: Blue badge
- **Optional**: Gray badge
- **Completed Items**: Green checkbox, gray strikethrough text
- **Edit/Delete Buttons**: Visible on hover, orange accent color

## Empty States

- **No Checklist**: Friendly message with "Create Your First Checklist" button
- **Empty Category**: "No items in this category yet" with "Add an item" link

## Technical Notes

- Built with React 19 + TypeScript
- State management via Zustand
- Styling with Tailwind CSS
- PRD-compliant color palette (Deep Forest Green, Burnt Orange, etc.)
- Fully type-safe with comprehensive TypeScript definitions
