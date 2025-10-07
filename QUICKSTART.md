# Quick Start Guide

## Current Project Status

**✅ Implemented:**

- Complete type system and data model
- LocalStorage persistence with cross-tab sync
- Zustand state management with CRUD operations
- Production Checklist UI (category grouping, CRUD, progress, bulk actions) – see `frontend/CHECKLIST_UI.md`
- Core test coverage (storage + state)
- Docker development environment
- Linting & formatting setup

**⏳ In Progress / Planned:**

- AI service integration (Azure OpenAI) behind backend proxy
- AI-assisted checklist generation & iterative refinement flow
- Zod validation + robust error handling for AI responses
- Additional UI interaction & accessibility tests

---

## Option 1: Docker (Recommended)

The fastest way to get started with a consistent development environment.

1. **Prerequisites**: Docker Desktop or Docker Engine + Docker Compose

2. **Start the application**:

   ```bash
   docker compose up
   ```

   Visit http://localhost:5173

3. **Stop the application**:
   ```bash
   docker compose down
   ```

## Option 2: Local Development

### Initial Setup

1. **Prerequisites**: Node.js >= 20.0.0

2. **Install dependencies**:

   ```bash
   cd frontend
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   Visit http://localhost:5173

## Available Commands

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server with hot reload |
| `npm run build`        | Build for production                     |
| `npm run preview`      | Preview production build                 |
| `npm run lint`         | Check code quality with ESLint           |
| `npm run format`       | Format code with Prettier                |
| `npm run format:check` | Check if code is formatted               |
| `npm run test`         | Run tests in watch mode                  |
| `npm run test:ui`      | Run tests with UI                        |

## Project Conventions

### Architecture Overview

The application follows a layered architecture:

1. **Types Layer** (`types/`) - TypeScript definitions for all data structures
2. **Storage Layer** (`storage/`) - LocalStorage abstraction with cross-tab sync
3. **State Layer** (`state/`) - Zustand stores for application state
4. **Component Layer** (`components/`, `pages/`) - React UI components

### State Management

**Zustand Store** (`src/state/checklistStore.ts`):

- Use the store for ALL state operations
- Never access storage layer directly from components
- Store provides: CRUD operations, item management, cross-tab sync
- Example:

  ```typescript
  import { useChecklistStore } from "../state/checklistStore";

  const { checklists, createChecklist, addItem } = useChecklistStore();
  ```

**When to use Zustand:**

- State shared across 3+ components
- Persisted state
- Global application state

**When to use local state:**

- Component-specific UI state
- Form inputs (before submission)
- Temporary state

### Storage Layer

**Do NOT access directly from components!** Use the Zustand store instead.

The storage layer (`src/storage/checklistStorage.ts`) provides:

- Abstract `ChecklistStorageAPI` interface
- `LocalStorageChecklistStorage` implementation
- Helper functions: `createEmptyChecklist()`, `generateChecklistId()`, `generateItemId()`
- Automatic timestamps and cross-tab sync

See `frontend/STORAGE.md` for complete documentation.

### File Organization (Key Paths)

- `components/checklist/` – Production Checklist UI (see `CHECKLIST_UI.md`)
- `components/ChecklistDemo.tsx` – Legacy demo component
- `state/checklistStore.ts` – Global Zustand store
- `storage/checklistStorage.ts` – Persistence layer
- `types/checklist.ts` – Domain & AI types
- `ai/` – (Planned) AI service & prompt utilities

### Code Style

- TypeScript for all new files
- Run `npm run lint` before committing
- Run `npm run format` to auto-fix formatting
- Follow existing patterns in the codebase

### Testing

**Comprehensive test coverage implemented:**

- ✅ Storage layer tests (`checklistStorage.test.ts`)
  - CRUD operations, timestamps, cross-tab sync, error handling
- ✅ State management tests (`checklistStore.test.ts`)
  - All Zustand store actions and state updates
- ✅ Component tests (`App.test.tsx`)
  - Basic component rendering

**Test Commands:**

- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with Vitest UI

**Writing tests:**

- Use Vitest + React Testing Library
- Co-locate tests with source or use `__tests__/`
- See existing tests for examples
- Always write tests for new components and logic

## Type Definitions

Complete type system is defined in `src/types/checklist.ts`:

**Core Types:**

- `Checklist` - Main checklist structure with items and metadata
- `Item` - Individual checklist item (category, notes, quantity, priority, completed)
- `AIGenerationParams` - AI generation parameters (duration, disciplines, etc.)
- `AIChecklistResponse` - AI response structure
- `CategoryResponse` - Category with items
- `ItemResponse` - Individual item from AI
- `GeneratedChecklistMeta` - AI-generated checklist metadata
- `ChatSession` - Chat history for refinement

**Helper Functions:**

- `createEmptyChecklist(name)` - Create a new empty checklist
- `generateChecklistId()` - Generate unique checklist ID
- `generateItemId()` - Generate unique item ID

All IDs use `crypto.randomUUID()` for uniqueness.

## Next Steps

Focus areas:

1. AI Integration (`ai/`)

- Service wrapper (backend proxy -> Azure OpenAI)
- Prompt builder & system templates
- Zod schema validation for structured responses

2. Generation Workflow

- Create + refine flow (chat-style iteration)
- Mapping AI output -> checklist items

3. Testing Enhancements

- UI interaction tests (add/edit/delete, bulk actions)
- Accessibility assertions

4. Hardening

- Error states & fallback messaging for AI failures
- Schema evolution/versioning strategy

See `PRD.md` for detailed feature specs, `frontend/STORAGE.md` for persistence details, and `frontend/CHECKLIST_UI.md` for UI behavior.
